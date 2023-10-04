import { getTransferableObjects, makeCallListener, makeProxyCallListener, registerListener } from 'osra'
import type { Resolvers as ChildSharedWorkerResolvers } from './child-shared-worker'

import WorkerURL from './child-shared-worker?worker&url'

const worker = new SharedWorker(WorkerURL, { type: 'module' })

worker.port.start()

worker.port.addEventListener('error', (err) => {
  console.error(err)
})

worker.port.addEventListener('message', (event) => {
  console.log('CHILD received sharedworker window message', event.data)
})

window.addEventListener('message', (event) => {
  console.log('CHILD received window message', event.data)
  // console.log('ARGS', event.data, { transfer: getTransferableObjects(event.data) })
  // worker.port!.postMessage(event.data, { transfer: getTransferableObjects(event.data), targetOrigin: '*' })
})

// const test = makeCallListener(async ({  }: {  }) => {
//   console.log('CHILD test called')
//   return 
// })

const test = makeProxyCallListener<ChildSharedWorkerResolvers['test']>(worker.port, { key: 'test' })

const resolvers = {
  test
}

export type Resolvers = typeof resolvers

registerListener({
  target: window,
  resolvers,
  key: 'test'
})
