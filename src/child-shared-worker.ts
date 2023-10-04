import type { Resolvers } from './child'
import { call as _call, makeCallListener, registerListener } from 'osra'

const test = makeCallListener(async ({ foo, qux }: { foo: string, qux: () => {} }) => {
  console.log('CHILD test called', foo, qux)
  setTimeout(() => {
    qux()
  }, 2000)
  return 
})

const resolvers = {
  test
}

globalThis.addEventListener('connect', (e) => {
  const port = e.ports[0] as MessagePort
  port.start()

  registerListener({
    target: port as unknown as Window,
    resolvers,
    key: 'test'
  })

  // const call = _call<Resolvers>(port as unknown as Window, { key: 'test' })

  // call('test', { foo: 'bar', qux: () => { console.log('yeet') } })

  port.addEventListener('message', (event) => {
    console.log('CHILD received sharedWorker message', event.data)
  })
  // const ab = new ArrayBuffer(12)
  // port.postMessage({ msg: 'parent from child sharedworker', ab }, { transfer: [ab] })

})

console.log('child sharedworker')
