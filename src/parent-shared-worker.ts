import {  call as _call } from 'osra'
import { Resolvers } from './parent'

globalThis.addEventListener('connect', (e) => {
  const port = e.ports[0] as MessagePort

  port.start()
  port.addEventListener('message', (event) => {
    console.log('PARENT received sharedWorker message', event.data)
  })


  const call = _call<Resolvers>(port as unknown as Window, { key: 'test' })

  setTimeout(() => {
    call('test', { foo: 'bar', qux: () => { console.log('yeet') } })
  }, 100)

  // const ab = new ArrayBuffer(8)
  // port.postMessage({ msg: 'parent from child sharedworker', ab }, { transfer: [ab] })
})

console.log('parent sharedworker')
