import GithubApp from "App/Models/GithubApp"
import got from "got"
import { asyncExecShell, saveBuildLog } from "Helpers/common"
import jsonwebtoken from 'jsonwebtoken'
import Logger from '@ioc:Adonis/Core/Logger'

export default async function ({ workdir, githubAppId, repository, branch, buildId }): Promise<string> {
    try {
        saveBuildLog({ line: 'Importer started.', buildId })
        const { privateKey, appId, installationId } = await GithubApp.findOrFail(githubAppId)
        const githubPrivateKey = privateKey.replace(/\\n/g, '\n').replace(/"/g, '');

        const payload = {
            iat: Math.round(new Date().getTime() / 1000),
            exp: Math.round(new Date().getTime() / 1000 + 60),
            iss: appId
        };
        const jwtToken = jsonwebtoken.sign(payload, githubPrivateKey, {
            algorithm: 'RS256'
        });
        const { token } = await got.post(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                Accept: 'application/vnd.github.machine-man-preview+json'
            }
        }).json()
        saveBuildLog({ line: 'Cloning repository.', buildId })
        await asyncExecShell(`git clone -q -b ${branch} https://x-access-token:${token}@github.com/${repository}.git ${workdir}/ && cd ${workdir} && git submodule update --init --recursive && cd ..`)
        const { stdout: commit } = await asyncExecShell(`cd ${workdir}/ && git rev-parse HEAD`)
        return commit.replace('\n', '')
    } catch (error) {
        throw new Error(error)
    }

}