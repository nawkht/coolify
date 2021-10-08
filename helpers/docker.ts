import Dockerode from 'dockerode'
import { saveBuildLog } from './common';

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