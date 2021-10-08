import child from 'child_process'
import util from 'util'
import Logger from '@ioc:Adonis/Core/Logger'
import BuildLog from 'App/Models/BuildLog'

const asyncExecShell = util.promisify(child.exec)
const asyncSleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const saveBuildLog = ({ line, buildId }) => {
    Logger.info(line)
    BuildLog.create({ line, buildId })
}
export { asyncExecShell, asyncSleep, saveBuildLog }
