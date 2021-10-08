import Application from '@ioc:Adonis/Core/Application'
import builder from 'Helpers/builder'
import type { Job } from 'bullmq'
import { Queue, Worker } from 'bullmq'
import cuid from 'cuid'
import { saveBuildLog } from './common'
import Build from 'App/Models/Build'

const mode = Application.nodeEnvironment
const dev = mode === 'development'

const buildQueueName = dev ? cuid() : 'build_queue'
const buildQueue = new Queue(buildQueueName)
const buildWorker = new Worker(buildQueueName, async (job) => await builder(job), {
  concurrency: 2,
})

buildWorker.on('completed', async (job: Job) => {
  const build = await Build.findOrFail(job.data.build_id)
  await build.merge({ status: 'success' }).save()
})

buildWorker.on('failed', async (job: Job, failedReason: string) => {
  try {
    const build = await Build.findOrFail(job.data.build_id)
    await build.merge({ status: 'failed' }).save()
  } catch (error) {
    console.log(error)
  }
  saveBuildLog({ line: 'Failed build!', buildId: job.data.build_id })
  saveBuildLog({ line: `Reason: ${failedReason.toString()}`, buildId: job.data.build_id })
})

export { buildQueue }
