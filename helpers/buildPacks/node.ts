import Logger from '@ioc:Adonis/Core/Logger'
import { promises as fs } from 'fs';
import { buildImage } from 'Helpers/docker';

const createDockerfile = async ({ image, workdir, port, installCommand, buildCommand, startCommand, baseDirectory }): Promise<void> => {
    Logger.info('Creating Dockerfile')
    const Dockerfile: Array<string> = []
    Dockerfile.push(`FROM ${image}`)
    Dockerfile.push('WORKDIR /usr/src/app')
    Dockerfile.push(`COPY ./${baseDirectory || ""}package*.json ./`)
    Dockerfile.push(`RUN ${installCommand}`)
    Dockerfile.push(`COPY ./${baseDirectory || ""} ./`)
    if (buildCommand) { Dockerfile.push(`RUN ${buildCommand}`) }
    Dockerfile.push(`EXPOSE ${port}`)
    Dockerfile.push(`CMD ${startCommand}`)
    await fs.writeFile(`${workdir}/Dockerfile`, Dockerfile.join('\n'))
}

export default async function ({ id, commit, workdir, docker, buildId, port, installCommand, buildCommand, startCommand, baseDirectory }) {
    // TODO: Select node version
    const image = 'node:lts'
    Logger.info('Buildpack started.')
    await createDockerfile({ image, workdir, port, installCommand, buildCommand, startCommand, baseDirectory })
    Logger.info('Image building started.')
    await buildImage({ id, commit, workdir, docker, buildId })
    Logger.info('Image building done.')
    Logger.info('Buildpack done.')
}