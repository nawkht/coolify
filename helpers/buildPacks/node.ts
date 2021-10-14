import Logger from '@ioc:Adonis/Core/Logger'
import { promises as fs } from 'fs';
import { streamEvents } from 'Helpers/docker';

const createDockerfile = async ({ nodeVersion, workdir, port, installCommand, buildCommand, startCommand }): Promise<void> => {
    Logger.info('Creating Dockerfile')
    let Dockerfile: Array<string> = []
    Dockerfile.push(`FROM node:${nodeVersion}`)
    Dockerfile.push('WORKDIR /usr/src/app')
    Dockerfile.push(`COPY package*.json ./`)
    Dockerfile.push(`RUN ${installCommand}`)
    Dockerfile.push(`COPY ./ ./`)
    // TODO: base and publish dir
    if (buildCommand) {
        Dockerfile.push(`RUN ${buildCommand}`)
    } 
    Dockerfile.push(`EXPOSE ${port}`)
    Dockerfile.push(`CMD ${startCommand}`)
    await fs.writeFile(`${workdir}/Dockerfile`, Dockerfile.join('\n'))
}

const buildImage = async ({ id, commit, workdir, docker, buildId }) => {
    const stream = await docker.engine.buildImage(
        { src: ['.'], context: workdir },
        { t: `${id}:${commit.slice(0, 7)}` }
    );
    await streamEvents({ stream, docker, buildId })
}

export default async function ({ id, commit, workdir, docker, buildId, port, installCommand, buildCommand, startCommand }) {
    // TODO: Select node version
    const nodeVersion = 'lts'
    Logger.info('Buildpack started.')
    await createDockerfile({ nodeVersion, workdir, port, installCommand, buildCommand, startCommand })
    Logger.info('Image building started.')
    await buildImage({ id, commit, workdir, docker, buildId })
    Logger.info('Image building done.')
    Logger.info('Buildpack done.')
}