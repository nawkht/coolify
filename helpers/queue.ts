import Application from '@ioc:Adonis/Core/Application'
import builder from 'Helpers/queues/builder'
import type { Job } from 'bullmq'
import { Queue, Worker } from 'bullmq'
import cuid from 'cuid'
import { saveBuildLog } from './common'
import Build from 'App/Models/Build'
import letsencrypt from './queues/letsencrypt'

const mode = Application.nodeEnvironment
const dev = mode === 'development'

const buildQueueName = dev ? cuid() : 'build_queue'
const buildQueue = new Queue(buildQueueName, {
  connection: {
    host: 'localhost'
  }
})
const buildWorker = new Worker(buildQueueName, async (job) => await builder(job), {
  concurrency: 2,
  connection: {
    host: 'localhost'
  }
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

const letsEncryptQueueName = dev ? cuid() : 'letsencrypt_queue'
const letsEncryptQueue = new Queue(letsEncryptQueueName, {
  connection: {
    host: 'localhost'
  }
})

const letsEncryptWorker = new Worker(letsEncryptQueueName, async (job) => await letsencrypt(job), {
  concurrency: 1,
  connection: {
    host: 'localhost'
  }
})
letsEncryptWorker.on('completed', async (job: Job) => {
  // TODO: Save letsencrypt logs as build logs!
  console.log('Lets Encrypt job completed')
})

letsEncryptWorker.on('failed', async (job: Job, failedReason: string) => {
  console.log('Lets Encrypt job failed')
  console.log(failedReason)
})
export { buildQueue, letsEncryptQueue }
