import { call as _call, registerListener, makeProxyCallListener, getTransferableObjects } from 'osra'
import WorkerURL from './parent-shared-worker?worker&url'
import type { Resolvers as SharedWorkerResolvers } from './parent-shared-worker'
import type { Resolvers as ChildResolvers } from './child'

const iframe = document.createElement('iframe')
iframe.style.border = '1px solid yellow'
iframe.src = 'http://localhost:8081/'
document.body.appendChild(iframe)

const iframe2 = document.createElement('iframe')
iframe2.style.border = '1px solid red'
iframe2.src = 'http://localhost:8081/'

setTimeout(() => {
  document.body.appendChild(iframe2)
  setTimeout(() => {
    iframe.remove()
  }, 500)
}, 1000)

const worker = new SharedWorker(WorkerURL, { type: 'module' })

worker.port.start()

worker.port.addEventListener('error', (err) => {
  console.error(err)
})

worker.port.addEventListener('message', (event) => {
  console.log('PARENT received sharedworker window message', event.data)
  console.log('ARGS', event.data, { transfer: getTransferableObjects(event.data) })
  // iframe.contentWindow!.postMessage(event.data, { transfer: getTransferableObjects(event.data), targetOrigin: '*' })
})


const call = _call<ChildResolvers>(iframe.contentWindow!, { key: 'test' })

// setTimeout(() => {
//   call('test', {}).then((res) => {
//     console.log('PARENT test result', res)
//   })
// }, 100)


const test = makeProxyCallListener<SharedWorkerResolvers['test']>(iframe.contentWindow!, { key: 'test' })

const resolvers = {
  test
}

export type Resolvers = typeof resolvers

registerListener({
  target: worker.port,
  resolvers,
  key: 'test'
})
