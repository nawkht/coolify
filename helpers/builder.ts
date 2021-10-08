
import Build from 'App/Models/Build'
import crypto from 'crypto'
import * as buildpacks from './buildPacks'
import * as importers from './importers'
import { dockerInstance } from './docker'
import { asyncExecShell, saveBuildLog } from './common'
import Application from 'App/Models/Application'

export default async function (job) {
  /*
    Edge cases:
    1 - Change build pack and redeploy, what should happen?
  */
  const { id, repository, branch, build_pack: buildPack, destinationDocker, gitSource, build_id: buildId, config_hash: configHash, port, install_command: installCommand, build_command: buildCommand, start_command: startCommand } = job.data
  const destinationSwarm = null
  const kubernetes = null

  let deployNeeded = true

  const docker = dockerInstance({ destinationDocker })

  const build = await Build.create({
    id: buildId,
    applicationId: id,
    destinationDockerId: destinationDocker.id,
    gitSourceId: gitSource.id,
    githubAppId: gitSource.githubApp.id,
    status: 'running',
  })
  const workdir = `/tmp/build-sources/${repository}/${build.id}`
  await asyncExecShell(`mkdir -p ${workdir}`)

  const commit = await importers[gitSource.type]({ workdir, githubAppId: gitSource.githubApp.id, repository, branch, buildId: build.id })
  await build.merge({ commit }).save()

  const currentHash = crypto.createHash('sha256').update(JSON.stringify({ buildPack, port, installCommand, buildCommand, startCommand })).digest('hex')
  if (configHash !== currentHash) {
    const applicationFound = await Application.findOrFail(id)
    await applicationFound.merge({ configHash: currentHash }).save()
    deployNeeded = true
    saveBuildLog({ line: 'Configuration changed, redeploying.', buildId })
  } else {
    deployNeeded = false
  }

  const image = await docker.engine.getImage(`${id}:${commit.slice(0, 7)}`)

  let imageFound = false
  try {
    await image.inspect()
    imageFound = true
  } catch (error) {
    //
  }
  if (!imageFound || deployNeeded) {
    await buildpacks[buildPack]({ id, commit, workdir, docker, buildId: build.id, port, installCommand, buildCommand, startCommand })
  } else {
    deployNeeded = false
    saveBuildLog({ line: 'Nothing changed.', buildId })
  }

  // TODO: Move this to deploy.ts?
  if (deployNeeded) {
    if (destinationDocker) {
      // Deploy to docker
      try {
        await asyncExecShell(`docker stop -t 0 ${id}`)
        await asyncExecShell(`docker rm ${id}`)
      } catch (error) {
        //
      } finally {
        saveBuildLog({ line: 'Remove old deployments.', buildId })
      }

      // TODO: Must be localhost
      if (destinationDocker.engine === '/var/run/docker.sock') {
        saveBuildLog({ line: 'Deploying.', buildId })
        const { stderr } = await asyncExecShell(`docker run --name ${id} --network ${docker.network} --restart always -d ${id}:${commit.slice(0, 7)}`)
        if (stderr) console.log(stderr)
        saveBuildLog({ line: 'Deployment successful!', buildId })
      }

    } else if (destinationSwarm) {
      // Deploy to swarm
    } else if (kubernetes) {
      // Deploy to k8s
    }
  }

  await asyncExecShell(`rm -fr ${workdir}`)
}
