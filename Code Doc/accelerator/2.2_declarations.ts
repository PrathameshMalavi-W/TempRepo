// @ts-nocheck


//TypeScript does not know that you want to put custom data on window. As Mfe they all share the same browser window
//  '@onecx/accelerator' =>  This is a namespace.

declare global {
  interface Window {
    '@onecx/accelerator': {
      gatherer?: {
        debug?: string[]                //which gatherers should log
        promises?: { [id: number]: Promise<unknown>[] }
      }
      topic?: {
        debug?: string[]               // Which topic names should print console logs?
        statsEnabled?: boolean         // Stats about messages published and instances created 
        stats?: {                      // Only present if statsEnabled is true  => Debug / monitoring only.
          messagesPublished?: {
            [topicName: string]: {
              TopicNext: number
              TopicGet: number
              TopicResolve: number
            }
          }
          instancesCreated?: { [topicName: string]: number }
        }
        // We intentionally create ONE BroadcastChannel PER topic+version
        useBroadcastChannel?: boolean  // Whether to use BroadcastChannel API for cross-tab communication 
        initDate?: number              // Timestamp when the topic system/accelerator was initialized 
      }
    }
  }
}

window['@onecx/accelerator'] ??= {}
window['@onecx/accelerator'].gatherer ??= {}
window['@onecx/accelerator'].gatherer.promises ??= {}
window['@onecx/accelerator'].gatherer.debug ??= []
window['@onecx/accelerator'].topic ??= {}
window['@onecx/accelerator'].topic.useBroadcastChannel ??= true
window['@onecx/accelerator'].topic.initDate ??= Date.now()

export default globalThis



/*


[MFE-A] gather("req1")
[MFE-A] id=4
[MFE-A] promises[4] = []
[MFE-A] Topic.publish({id:4, request:"req1"})

[MFE-B] received TopicNext id=4
[MFE-B] executing callback
[MFE-B] pushing promise

[MFE-C] received TopicNext id=4
[MFE-C] executing callback
[MFE-C] pushing promise

[MFE-B] callback resolved → resolve promise
[MFE-C] callback resolved → resolve promise

[MFE-A] Promise.all resolved (2 responses)
[MFE-A] cleanup promises[4]


gatherer => Gatherer = ask all MFEs a question and collect all their answers
Why does gatherer.promises exist globally?
    Because the requester and the responders live in different JS instances, and the only shared memory they all see is window.
debug?: string[]
        window['@onecx/accelerator'].topic.debug = ['current-workspace']
        window['@onecx/accelerator'].gatherer.debug = ['menu']
        logs : 
              Gatherer menu: received request
              Gatherer menu: answered request
promises?: { [id: number]: Promise<unknown>[] }
        promises: {
          1: [Promise, Promise, Promise],
          2: [Promise, Promise]
        }
id : a request id generated when gather() is called
          const responses = await gatherer.gather('get-menu')
          window['@onecx/accelerator'].gatherer.promises[42] = []
          All MFEs receive:   { id: 42, request: 'get-menu' }
          window['@onecx/accelerator'].gatherer.promises[42]    
          Each MFE does:
              callback(request).then(response => {
                resolve(response)
              })
          Shell receives:     ['menu-from-mfe-a', 'menu-from-mfe-c']
Internally: request id = 42 , all MFEs respond, each response becomes a Promise, all promises are stored in:  window['@onecx/accelerator'].gatherer.promises[42]





statsEnabled?: boolean
Stats exist only to debug and observe Topics.
messagesPublished: {
  [topicName]: {
    TopicNext: number
    TopicGet: number
    TopicResolve: number
  }
}
instancesCreated = {
  'current-workspace': 3,
  'is-authenticated': 1
}
messagesPublished = {
  'current-workspace': {
    TopicNext: 2,
    TopicGet: 10,
    TopicResolve: 2
  }
}




useBroadcastChannel?: boolean
Some browsers don’t support BroadcastChannel. Some environments (tests) fake it
        if (useBroadcastChannel) {
          new BroadcastChannel(...)
        } else {
          window.postMessage(...)
        }




initDate?: number
Avoid race conditions during startup. Give early Topics time to initialize
          if (Date.now() - initDate < 2000) {
            delay TopicGet
          }
*/