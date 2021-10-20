import Logger from '@ioc:Adonis/Core/Logger'
import { promises as fs } from 'fs';
import { buildCacheImageWithNode, buildImage } from 'Helpers/docker';

const createDockerfile = async ({ id, commit, image, workdir, buildCommand, baseDirectory, publishDirectory }): Promise<void> => {
    Logger.info('Creating Dockerfile')
    let Dockerfile: Array<string> = []
    Dockerfile.push(`FROM ${image}`)
    Dockerfile.push('WORKDIR /usr/share/nginx/html')
    if (buildCommand) {
        Dockerfile.push(`COPY --from=${id}:${commit.slice(0, 7)}-cache /usr/src/app/${publishDirectory} ./`)
    } else {
        Dockerfile.push(`COPY ./${baseDirectory || ""} ./`)
    }
    Dockerfile.push(`EXPOSE 80`)
    Dockerfile.push('CMD ["nginx", "-g", "daemon off;"]')
    await fs.writeFile(`${workdir}/Dockerfile`, Dockerfile.join('\n'))
}

export default async function ({ id, commit, workdir, docker, buildId, installCommand, buildCommand, baseDirectory, publishDirectory }) {
    const image = 'nginx:stable-alpine'
    Logger.info('Buildpack started.')
    if (buildCommand) {
        Logger.info('Cache image building started.')
        await buildCacheImageWithNode({ id, commit, workdir, docker, buildId, baseDirectory, installCommand, buildCommand })
    }
    await createDockerfile({ id, commit, image, workdir, buildCommand, baseDirectory, publishDirectory })
    Logger.info('Image building started.')
    await buildImage({ id, commit, workdir, docker, buildId })
    Logger.info('Image building done.')
    Logger.info('Buildpack done.')
}