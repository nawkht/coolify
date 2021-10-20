import Dockerode from 'dockerode'
import { saveBuildLog } from './common';
import { promises as fs } from 'fs';

export async function buildCacheImageWithNode({id, commit, workdir, docker, buildId, baseDirectory, installCommand, buildCommand}) {
    const Dockerfile: Array<string> = []
    Dockerfile.push(`FROM node:lts`)
    Dockerfile.push('WORKDIR /usr/src/app')
    if (installCommand) {
        Dockerfile.push(`COPY ./${baseDirectory || ""}package*.json ./`)
        Dockerfile.push(`RUN ${installCommand}`)
    }
    Dockerfile.push(`COPY ./${baseDirectory || ""} ./`)
    Dockerfile.push(`RUN ${buildCommand}`)
    await fs.writeFile(`${workdir}/Dockerfile-cache`, Dockerfile.join('\n')) 
    await buildImage({id, commit, workdir, docker, buildId, isCache:true})
}
export async function buildImage({ id, commit, workdir, docker, buildId, isCache = false }) {
    const stream = await docker.engine.buildImage(
        { src: ['.'], context: workdir },
        { dockerfile: isCache ? 'Dockerfile-cache' : 'Dockerfile', t: `${id}:${commit.slice(0, 7)}${isCache ? '-cache' : ''}` }
    );
    await streamEvents({ stream, docker, buildId })
}
export function dockerInstance({ destinationDocker }): { engine: Dockerode, network: string } {
    return {
        engine: new Dockerode({
            socketPath: destinationDocker.engine,
        }),
        network: destinationDocker.network,
    }
}
export async function streamEvents({ stream, docker, buildId }) {
    await new Promise((resolve, reject) => {
        docker.engine.modem.followProgress(stream, onFinished, onProgress);
        function onFinished(err, res) {
            if (err) reject(err);
            resolve(res);
        }
        function onProgress(event) {
            if (event.error) {
                reject(event.error);
            } else if (event.stream) {
                if (event.stream !== '\n') {
                    saveBuildLog({ line: event.stream.replace('\n', ''), buildId })
                }
            }
        }
    });
}


export const baseServiceConfigurationDocker = {
    restart_policy: {
        condition: 'any',
        max_attempts: 6,
    }
};

export const baseServiceConfigurationSwarm = {
    replicas: 1,
    restart_policy: {
        condition: 'any',
        max_attempts: 6,
    },
    update_config: {
        parallelism: 1,
        delay: '10s',
        order: 'start-first',
    },
    rollback_config: {
        parallelism: 1,
        delay: '10s',
        order: 'start-first',
        failure_action: 'rollback',
    },
};