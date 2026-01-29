# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\accelerator\src

## Folder: accelerator/src (1 files)

### File: accelerator/src/index.ts

```ts

export * from './lib/topic/topic'
export * from './lib/topic/mocks/fake-topic'
export * from './lib/topic/mocks/broadcast-channel.mock'
export * from './lib/topic/syncable-topic'
export * from './lib/topic/topic-publisher'
export * from './lib/utils/path.utils'
export * from './lib/utils/date.utils'
export * from './lib/utils/is-test.utils'
export * from './lib/utils/normalize-locales.utils'
export * from './lib/utils/get-normalized-browser-locales.utils'
export * from './lib/utils/gatherer'


```

## Folder: accelerator/src/lib (1 files)

### File: accelerator/src/lib/declarations.ts

```ts

declare global {
  interface Window {
    '@onecx/accelerator': {
      gatherer?: {
        debug?: string[]
        promises?: { [id: number]: Promise<unknown>[] }
      }
      topic?: {
        debug?: string[]
        statsEnabled?: boolean
        stats?: {
          messagesPublished?: {
            [topicName: string]: {
              TopicNext: number
              TopicGet: number
              TopicResolve: number
            }
          }
          instancesCreated?: { [topicName: string]: number }
        }
        useBroadcastChannel?: boolean
        initDate?: number
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


```

## Folder: accelerator/src/lib/topic (10 files)

### File: accelerator/src/lib/topic/message.ts

```ts

declare global {
  interface Window {
    onecxMessageId: number
  }
}

window['onecxMessageId'] ??= 1

export class Message {
  timestamp: number
  id: number // id can be undefined while used via old implementation

  constructor(public type: string) {
    this.timestamp = window.performance.now()
    this.id = window['onecxMessageId']++
  }
}


```

### File: accelerator/src/lib/topic/syncable-topic.spec.ts

```ts

/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { SyncableTopic } from './syncable-topic'
import {
  BroadcastChannelMock
} from "./mocks/broadcast-channel.mock"

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannelMock)

describe('Syncable Topic', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let testSyncableTopic1: SyncableTopic<string>
  let testSyncableTopic2: SyncableTopic<string>

  beforeEach(() => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.initDate = Date.now() - 1000000
    window['@onecx/accelerator'].topic.useBroadcastChannel = true

    BroadcastChannelMock.asyncCalls = false

    listeners = []

    testSyncableTopic1 = new SyncableTopic<string>('test', 1)
    testSyncableTopic2 = new SyncableTopic<string>('test', 1)

  })

  afterEach(() => {
    testSyncableTopic1.destroy()
    testSyncableTopic2.destroy()
    BroadcastChannelMock.listeners =  {}
    BroadcastChannelMock.asyncCalls = false
  })

  it('should get correct value', async () => {
    expect(testSyncableTopic1.getValue()).toEqual(undefined)

    await testSyncableTopic1.publish('value1')

    expect(testSyncableTopic1.getValue()).toEqual('value1')
    expect(testSyncableTopic2.getValue()).toEqual('value1')
  })
})


```

### File: accelerator/src/lib/topic/syncable-topic.ts

```ts

import { Topic } from './topic'
import { TopicDataMessage } from './topic-data-message'

/**
 * This class allows sync access to the value of a Topic.
 * If you use this as a super class, you have to make sure that
 * in all cases when the value is accessed it is initialized.
 * This means that you have to make sure that in all possible
 * code paths reaching your sync access you made sure that it
 * is initialized (in standalone and shell mode).
 * Keep in mind that there can be multiple instances of the Topic
 * so you cannot rely on the fact that the shell has already checked
 * that it is initialized.
 * 
 * @deprecated Should not be used anymore because reading async data in a sync way is dangerous and leads to errors. Use `Topic` instead.
 */
export class SyncableTopic<T> extends Topic<T> {
  constructor(name: string, version: number) {
    super(name, version)
  }

  /**
   * This function does not offer read after write consistency!
   * This means you cannot call it directly after publish, because the new value will not be there yet!
   * This function will return undefined until the isInitialized Promise is resolved.
   * @returns the current value of the Topic in a synchronous way
   */
  getValue(): T | undefined {
    return this.isInit ? (<TopicDataMessage<T>>this.data.value).data : undefined
  }
}


```

### File: accelerator/src/lib/topic/topic.spec.ts

```ts

/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { map } from 'rxjs'
import { Topic } from './topic'
import { TopicMessageType } from './topic-message-type'
import { TopicDataMessage } from './topic-data-message'
import { BroadcastChannelMock } from './mocks/broadcast-channel.mock'

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannelMock)

describe('Topic', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let values1: any[]
  let values2: any[]

  let testTopic1: Topic<string>
  let testTopic2: Topic<string>

  beforeEach(() => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.statsEnabled = true
    window['@onecx/accelerator'].topic.initDate = Date.now() - 1000000
    window['@onecx/accelerator'].topic.useBroadcastChannel = true
    window['@onecx/accelerator'].topic.debug = ['SpecificTestTopic']

    BroadcastChannelMock.asyncCalls = false

    listeners = []

    values1 = []
    values2 = []

    testTopic1 = new Topic<string>('test', 1)
    testTopic2 = new Topic<string>('test', 1)

    testTopic1.subscribe((v) => values1.push(v))
    testTopic2.subscribe((v) => values2.push(v))
  })

  afterEach(() => {
    testTopic1.destroy()
    testTopic2.destroy()
    BroadcastChannelMock.listeners = {}
    BroadcastChannelMock.asyncCalls = false
    if (window['@onecx/accelerator']?.topic?.debug) {
      window['@onecx/accelerator'].topic.debug = undefined
    }
  })

  it('should have correct value for 2 topics after first topic publishes', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])
  })

  it('should have correct value for 2 topics after second topic publishes', () => {
    testTopic2.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])
  })

  it('should have same value for a new initialized topic like the already existing topics', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: any[] = []
    const testTopic3 = new Topic<string>('test', 1)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual(['value1'])
  })

  it('should have same values for both topics after one topic publishes 2 values', () => {
    testTopic1.publish('value1')
    testTopic2.publish('value2')

    expect(values1).toEqual(['value1', 'value2'])
    expect(values2).toEqual(['value1', 'value2'])
  })

  it('should have no value if message name is different', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: any[] = []
    const testTopic3 = new Topic<string>('test123', 1)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual([])
  })

  it('should have no value if message version is different', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: any[] = []
    const testTopic3 = new Topic<string>('test', 2)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual([])
  })

  it('should have no value if message is undefined', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: any[] = []
    const testTopic3 = new Topic<undefined>('', 0)
    testTopic3.subscribe((v) => values3.push(v))
    testTopic3.publish(undefined)

    expect(values3).toEqual([])
  })

  it('should remove event listener', () => {
    testTopic1.destroy()
    testTopic2.publish('value1')

    expect(values1).toEqual([])
    expect(values2).toEqual(['value1'])
  })

  it('should pipe to get the length of the value', () => {
    let v = 0
    testTopic1.pipe(map((v) => v.length)).subscribe((s) => (v = s))
    testTopic1.publish('value1')

    expect(v).toEqual(6)
    expect(values1).toEqual(['value1'])
  })

  it('should check isInitialized', (done) => {
    let initialized = false
    testTopic1.isInitialized.then(() => (initialized = true))

    expect(initialized).toBe(false)

    testTopic1.publish('test')
    setTimeout(() => {
      expect(initialized).toBe(true)
      done()
    })
  })

  it('should have no values if publish is not awaited', async () => {
    const original = window.postMessage
    window.postMessage = (m: any) => {
      listeners.forEach((l) => {
        // Set timeout to simulate async behavior
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setTimeout(() => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }), 0)
      })
    }
    BroadcastChannelMock.asyncCalls = true

    const val1: number[] = []
    const val2: number[] = []

    const testTopic1 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic2 = new Topic<number>('SpecificTestTopic', 1, false)
    testTopic1.subscribe((val) => {
      val1.push(val)
    })
    testTopic2.subscribe((val) => val2.push(val))

    const promise = testTopic1.publish(321)

    expect(val1).toEqual([])
    expect(val2).toEqual([])

    await promise

    window.postMessage = original
  })

  it('should have values if publish is awaited', async () => {
    BroadcastChannelMock.asyncCalls = true

    const val1: number[] = []
    const val2: number[] = []

    const testTopic1 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic2 = new Topic<number>('SpecificTestTopic', 1, false)
    testTopic1.subscribe((val) => {
      val1.push(val)
    })
    testTopic2.subscribe((val) => {
      val2.push(val)
    })

    await testTopic1.publish(123)

    expect(val1).toEqual([123])
    expect(val2).toEqual([123])
  })

  it('should have all values if publish is awaited on first created topic', async () => {
    BroadcastChannelMock.asyncCalls = true

    const val1: number[] = []
    const val2: number[] = []
    const val3: number[] = []

    const testTopic1 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic2 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic3 = new Topic<number>('SpecificTestTopic', 1, false)
    testTopic1.subscribe((val) => {
      val1.push(val)
    })
    testTopic2.subscribe((val) => val2.push(val))
    testTopic3.subscribe((val) => val3.push(val))

    await testTopic1.publish(123)

    expect(val1).toEqual([123])
    expect(val2).toEqual([123])
    expect(val3).toEqual([123])
  })

  it('should have values if publish is awaited for all topics', async () => {
    BroadcastChannelMock.asyncCalls = true

    const val1: number[] = []
    const val2: number[] = []
    const val3: number[] = []

    const testTopic1 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic2 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic3 = new Topic<number>('SpecificTestTopic', 1, false)
    testTopic1.subscribe((val) => {
      val1.push(val)
    })
    testTopic2.subscribe((val) => val2.push(val))
    testTopic3.subscribe((val) => val3.push(val))

    await testTopic1.publish(1)

    expect(val1).toEqual([1])
    expect(val2).toEqual([1])
    expect(val3).toEqual([1])

    await testTopic2.publish(2)

    expect(val1).toEqual([1, 2])
    expect(val2).toEqual([1, 2])
    expect(val3).toEqual([1, 2])

    await testTopic3.publish(3)

    expect(val1).toEqual([1, 2, 3])
    expect(val2).toEqual([1, 2, 3])
    expect(val3).toEqual([1, 2, 3])
  })

  it('schedules TopicGet via timeout when recently initialized', () => {
    jest.useFakeTimers()
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.initDate = Date.now() // recent
    window['@onecx/accelerator'].topic.useBroadcastChannel = false

    const spy = jest.spyOn(window, 'postMessage')
    const t = new Topic<string>('timeout-get', 1)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    t.subscribe(() => {})

    // Advance timers to trigger scheduled get
    jest.advanceTimersByTime(150)

    expect(spy).toHaveBeenCalled()
    t.destroy()
    spy.mockRestore()
    jest.useRealTimers()
  })

  it('logs window message when debug enabled and handles TopicGet on window path', () => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.debug = ['win-topic']
    window['@onecx/accelerator'].topic.useBroadcastChannel = false

    const t = new Topic<string>('win-topic', 1, false)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    t.subscribe(() => {})
    // initialize with a value so TopicGet will respond
    t.publish('init')

    const sendSpy = jest.spyOn(t as any, 'sendMessage')

    // Send TopicGet via window to trigger handleTopicGetMessage through onWindowMessage
    const getMsg = {
      data: { type: TopicMessageType.TopicGet, name: 'win-topic', version: 1 },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopImmediatePropagation: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopPropagation: () => {},
    } as any
    listeners.forEach((l) => l(getMsg))

    expect(sendSpy).toHaveBeenCalled()
    t.destroy()
    sendSpy.mockRestore()
  })

  it('handles error in TopicResolve processing (catch branch)', () => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.useBroadcastChannel = false

    const t = new Topic<string>('resolve-error', 1, false)
    // inject a throwing resolver
    ;(t as any).publishPromiseResolver[123] = () => {
      throw new Error('boom')
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const resolveMsg = {
      data: { type: TopicMessageType.TopicResolve, name: 'resolve-error', version: 1, resolveId: 123 },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopImmediatePropagation: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopPropagation: () => {},
    } as any

    listeners.forEach((l) => l(resolveMsg))

    expect(errSpy).toHaveBeenCalled()
    t.destroy()
    errSpy.mockRestore()
  })

  describe('integration with older versions of library', () => {
    let previousMessage: TopicDataMessage<string>
    let incomingMessage: MessageEvent<TopicDataMessage<string>>

    beforeEach(() => {
      previousMessage = {
        type: TopicMessageType.TopicNext,
        name: testTopic1.name,
        version: testTopic1.version,
        data: '',
        timestamp: 0,
        id: 0,
      }
      incomingMessage = {
        data: {
          type: TopicMessageType.TopicNext,
          name: testTopic1.name,
          version: testTopic1.version,
          data: '',
          timestamp: 0,
          id: 0,
        },
      } as any

      // initialize topic
      testTopic1.publish('initMsg')

      jest.resetAllMocks()
    })

    it('should have value if incoming id is greater than previous id', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = 0
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have value if incoming timestamp is greater than previous timestamp with no ids provided', () => {
      previousMessage.data = 'msg1'
      ;(<any>previousMessage).id = undefined
      previousMessage.timestamp = 1
      incomingMessage.data.data = 'msg2'
      ;(<any>incomingMessage.data).id = undefined
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have value if incoming timestamp is greater than previous timestamp when current message has id', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = 1
      previousMessage.timestamp = 1
      incomingMessage.data.data = 'msg2'
      ;(<any>incomingMessage.data).id = undefined
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have value if incoming timestamp is greater than previous timestamp when incoming message has id', () => {
      previousMessage.data = 'msg1'
      ;(<any>previousMessage).id = undefined
      previousMessage.timestamp = 1
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have no value if incoming timestamp is equal to the previous timestamp with no ids provided', () => {
      previousMessage.data = 'msg1'
      ;(<any>previousMessage).id = undefined
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      ;(<any>incomingMessage.data).id = undefined
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1'])
    })

    it('should have no value if incoming timestamp is equal to the previous timestamp when current message has id', () => {
      jest.spyOn(console, 'warn')
      previousMessage.data = 'msg1'
      previousMessage.id = 1
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      ;(<any>incomingMessage.data).id = undefined
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1'])
      expect(console.warn).toHaveBeenLastCalledWith(
        'Message was dropped because of equal timestamps, because there was an old style message in the system. Please upgrade all libraries to the latest version.'
      )
    })

    it('should have no value if incoming timestamp is equal to previous timestamp when incoming message has id', () => {
      jest.spyOn(console, 'warn')
      previousMessage.data = 'msg1'
      ;(<any>previousMessage).id = undefined
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1'])
      expect(console.warn).toHaveBeenLastCalledWith(
        'Message was dropped because of equal timestamps, because there was an old style message in the system. Please upgrade all libraries to the latest version.'
      )
    })

    it('should have no value and no warning if incoming timestamp is equal to previous timestamp when incoming message has smaller id then current', () => {
      jest.spyOn(console, 'warn')
      previousMessage.data = 'msg1'
      ;(<any>previousMessage).id = 2
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1'])
      expect(console.warn).toHaveBeenCalledTimes(0)
    })
  })

  describe('for compatibility with older versions and browsers', () => {
    it('disables BroadcastChannel when not supported (TopicPublisher constructor branch)', () => {
      const originalBC = (globalThis as any).BroadcastChannel
      ;(globalThis as any).BroadcastChannel = undefined

      window['@onecx/accelerator'] ??= {}
      window['@onecx/accelerator'].topic ??= {}
      window['@onecx/accelerator'].topic.useBroadcastChannel = true

      // Creating a topic triggers TopicPublisher constructor branch
      const t = new Topic<string>('no-bc', 1, false)
      t.destroy()

      expect(window['@onecx/accelerator'].topic.useBroadcastChannel).toBe(false)
      ;(globalThis as any).BroadcastChannel = originalBC
    })

    it('uses window.postMessage when BroadcastChannel is disabled (sendMessage else path)', () => {
      window['@onecx/accelerator'] ??= {}
      window['@onecx/accelerator'].topic ??= {}
      window['@onecx/accelerator'].topic.useBroadcastChannel = false

      const spy = jest.spyOn(window, 'postMessage')

      const t = new Topic<string>('window-path', 1, false)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      t.subscribe(() => {})
      t.publish('x')

      expect(spy).toHaveBeenCalled()
      t.destroy()
      spy.mockRestore()
    })

    it('covers deprecated helpers: source, operator, lift, forEach, toPromise', async () => {
      const t = new Topic<number>('helpers', 1, false)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      t.subscribe(() => {})

      // Access deprecated properties
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ;(t as any).source
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ;(t as any).operator

      // lift with identity map
      const lifted = (t as any).lift((obs: any) => obs)
      expect(lifted).toBeTruthy()

      // forEach: invoke without awaiting completion (never completes)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      t.forEach(() => {})
      t.publish(7)

      // toPromise: invoke to cover method without awaiting resolution
      const p2 = (t as any).toPromise?.()
      if (p2) {
        t.publish(9)
      }
      t.destroy()
    })
  })
})


```

### File: accelerator/src/lib/topic/topic.ts

```ts

import { filter, map } from 'rxjs/operators'
import {
  BehaviorSubject,
  Observable,
  Observer,
  OperatorFunction,
  Subscribable,
  Subscription,
  UnaryFunction,
} from 'rxjs'
import { TopicDataMessage } from './topic-data-message'
import { TopicMessage } from './topic-message'
import { TopicMessageType } from './topic-message-type'
import { TopicPublisher } from './topic-publisher'
import { TopicResolveMessage } from './topic-resolve-message'
import '../declarations'
import { increaseInstanceCount, isStatsEnabled } from '../utils/logs.utils'

export class Topic<T> extends TopicPublisher<T> implements Subscribable<T> {
  protected isInitializedPromise: Promise<void>
  protected data = new BehaviorSubject<TopicDataMessage<T> | undefined>(undefined)

  protected isInit = false
  private resolveInitPromise!: (value: void | PromiseLike<void>) => void
  private readonly windowEventListener = (m: MessageEvent<TopicMessage>) => this.onWindowMessage(m)
  protected readonly readBroadcastChannel: BroadcastChannel | undefined

  constructor(name: string, version: number, sendGetMessage = true) {
    super(name, version)
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.initDate ??= Date.now()

    if (window['@onecx/accelerator']?.topic?.useBroadcastChannel) {
      if (typeof BroadcastChannel === 'undefined') {
        console.log('BroadcastChannel not supported. Disabling BroadcastChannel for topic')
        window['@onecx/accelerator'] ??= {}
        window['@onecx/accelerator'].topic ??= {}
        window['@onecx/accelerator'].topic.useBroadcastChannel = false
      } else {
        this.readBroadcastChannel = new BroadcastChannel(`Topic-${this.name}|${this.version}`)
      }
    }

    if (isStatsEnabled()) {
      increaseInstanceCount(this.name)
    }

    this.isInitializedPromise = new Promise<void>((resolve) => {
      this.resolveInitPromise = resolve
    })
    window.addEventListener('message', this.windowEventListener)
    this.readBroadcastChannel?.addEventListener('message', (m) => this.onBroadcastChannelMessage(m))

    if (sendGetMessage) {
      if (
        window['@onecx/accelerator'].topic.initDate &&
        Date.now() - window['@onecx/accelerator'].topic.initDate < 2000
      ) {
        // Delay the get message a bit to give other topics time to initialize
        setTimeout(() => {
          if (!this.isInit) {
            const message = new TopicMessage(TopicMessageType.TopicGet, this.name, this.version)
            this.sendMessage(message)
          }
        }, 100)
      } else {
        const message = new TopicMessage(TopicMessageType.TopicGet, this.name, this.version)
        this.sendMessage(message)
      }
    }
  }

  get isInitialized(): Promise<void> {
    return this.isInitializedPromise
  }

  asObservable(): Observable<T> {
    return this.data.asObservable().pipe(
      filter(() => this.isInit),
      map((d) => (<TopicDataMessage<T>>d).data)
    )
  }

  subscribe(observerOrNext?: Partial<Observer<T>> | ((value: T) => void)): Subscription
  /** @deprecated is deprecated in rxjs. This is only here to be compatible with the interface. */
  subscribe(
    next?: ((value: T) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Subscription
  subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
    error?: (error: any) => void | null,
    complete?: () => void | null
  ): Subscription {
    return (<any>this.asObservable()).subscribe(observerOrNext, error, complete)
  }

  pipe(): Observable<T>
  pipe<A>(op1: UnaryFunction<Observable<T>, A>): A
  pipe<A, B>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>): B
  pipe<A, B, C>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>): C
  pipe<A, B, C, D>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>
  ): D
  pipe<A, B, C, D, E>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>
  ): E
  pipe<A, B, C, D, E, F>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>
  ): F
  pipe<A, B, C, D, E, F, G>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>
  ): G
  pipe<A, B, C, D, E, F, G, H>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>
  ): H
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>,
    op9: UnaryFunction<H, I>
  ): I
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>,
    op9: UnaryFunction<H, I>,
    ...operations: OperatorFunction<any, any>[]
  ): Observable<unknown>
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>,
    op9: UnaryFunction<H, I>,
    ...operations: UnaryFunction<any, any>[]
  ): unknown

  pipe(...operations: UnaryFunction<any, any>[]): unknown {
    return (<any>this.asObservable()).pipe(...operations)
  }

  /**
   * @deprecated source is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  get source() {
    return this.asObservable().source
  }

  /**
   * @deprecated operator is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  get operator() {
    return this.asObservable().operator
  }

  /**
   * @deprecated lift is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  lift<R>(operator: OperatorFunction<T, R>): Observable<R> {
    return this.asObservable().lift(operator)
  }

  /**
   * @deprecated foreach is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  forEach(next: (value: T) => void, thisArg?: any): Promise<void> {
    return this.asObservable().forEach(next, thisArg)
  }

  /**
   * @deprecated toPromise is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  toPromise(): Promise<T | undefined> {
    return this.asObservable().toPromise()
  }

  destroy() {
    window.removeEventListener('message', this.windowEventListener, true)
    this.readBroadcastChannel?.close()
    this.publishBroadcastChannel?.close()
  }

  private onWindowMessage(m: MessageEvent<TopicMessage>): any {
    if (this.isLogEnabled() && m.data?.name === this.name && m.data?.version === this.version) {
      console.log('Topic', this.name, ':', this.version, 'received message via window', m.data)
    }
    switch (m.data.type) {
      case TopicMessageType.TopicNext: {
        this.disableBroadcastChannel()
        if (m.data.name === this.name && m.data.version === this.version) {
          this.handleTopicNextMessage(m)
        }
        break
      }
      case TopicMessageType.TopicGet: {
        this.disableBroadcastChannel()
        if (m.data.name === this.name && m.data.version === this.version && this.isInit && this.data.value) {
          this.handleTopicGetMessage(m)
        }
        break
      }
      case TopicMessageType.TopicResolve: {
        this.disableBroadcastChannel()
        this.handleTopicResolveMessage(m)
        break
      }
    }
  }

  private onBroadcastChannelMessage(m: MessageEvent<TopicMessage>): any {
    if (this.isLogEnabled()) {
      console.log('Topic', this.name, ':', this.version, 'received message', m.data)
    }
    switch (m.data.type) {
      case TopicMessageType.TopicNext: {
        this.handleTopicNextMessage(m)
        break
      }
      case TopicMessageType.TopicGet: {
        if (this.isInit && this.data.value) {
          this.handleTopicGetMessage(m)
        }
        break
      }
      case TopicMessageType.TopicResolve: {
        this.handleTopicResolveMessage(m)
        break
      }
    }
  }

  private disableBroadcastChannel() {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    if (window['@onecx/accelerator'].topic.useBroadcastChannel === true) {
      console.log('Disabling BroadcastChannel for topic')
    }
    window['@onecx/accelerator'].topic.useBroadcastChannel = false
  }

  private isLogEnabled() {
    return window['@onecx/accelerator']?.topic?.debug?.includes(this.name)
  }

  private handleTopicResolveMessage(m: MessageEvent<TopicMessage>) {
    const publishPromiseResolver = this.publishPromiseResolver[(<TopicResolveMessage>m.data).resolveId]
    if (publishPromiseResolver) {
      try {
        publishPromiseResolver()
        m.stopImmediatePropagation()
        m.stopPropagation()
        delete this.publishPromiseResolver[(<TopicResolveMessage>m.data).resolveId]
      } catch (error) {
        console.error('Error handling TopicResolveMessage:', error)
      }
    }
  }

  private handleTopicGetMessage(m: MessageEvent<TopicMessage>) {
    if (this.data.value) {
      this.sendMessage(this.data.value)
      m.stopImmediatePropagation()
      m.stopPropagation()
    }
  }

  private handleTopicNextMessage(m: MessageEvent<TopicMessage>) {
    if (
      !this.data.value ||
      (this.isInit && m.data.id !== undefined && this.data.value.id !== undefined && m.data.id > this.data.value.id) ||
      (this.isInit && m.data.timestamp > this.data.value.timestamp)
    ) {
      this.isInit = true
      this.data.next(<TopicDataMessage<T>>m.data)
      this.resolveInitPromise()
    } else if (
      this.data.value &&
      this.isInit &&
      m.data.timestamp === this.data.value.timestamp &&
      ((m.data.id && !this.data.value.id) || (!m.data.id && this.data.value.id))
    ) {
      console.warn(
        'Message was dropped because of equal timestamps, because there was an old style message in the system. Please upgrade all libraries to the latest version.'
      )
    }
  }
}


```

### File: accelerator/src/lib/topic/topic-data-message.ts

```ts

import { TopicMessage } from './topic-message'
import { TopicMessageType } from './topic-message-type'

export class TopicDataMessage<T> extends TopicMessage {
  constructor(type: TopicMessageType, name: string, version: number, public data: T) {
    super(type, name, version)
  }
}


```

### File: accelerator/src/lib/topic/topic-message.ts

```ts

import { increaseMessageCount, isStatsEnabled } from '../utils/logs.utils'
import { Message } from './message'
import { TopicMessageType } from './topic-message-type'

export class TopicMessage extends Message {
  constructor(
    type: TopicMessageType,
    public name: string,
    public version: number
  ) {
    super(type)
    if (isStatsEnabled()) {
      increaseMessageCount(this.name, type)
    }
  }
}


```

### File: accelerator/src/lib/topic/topic-message-type.ts

```ts

export const enum TopicMessageType {
  TopicNext = 'TopicNext',
  TopicGet = 'TopicGet',
  TopicResolve = 'TopicResolve',
}


```

### File: accelerator/src/lib/topic/topic-publisher.ts

```ts

import { TopicDataMessage } from './topic-data-message'
import { TopicMessage } from './topic-message'
import { TopicMessageType } from './topic-message-type'
import { TopicResolveMessage } from './topic-resolve-message'

export class TopicPublisher<T> {
  protected publishPromiseResolver: Record<number, () => void> = {}
  protected publishBroadcastChannel: BroadcastChannel | undefined

  constructor(
    public name: string,
    public version: number
  ) {}

  public publish(value: T): Promise<void> {
    const message = new TopicDataMessage<T>(TopicMessageType.TopicNext, this.name, this.version, value)
    this.sendMessage(message)
    const resolveMessage = new TopicResolveMessage(TopicMessageType.TopicResolve, this.name, this.version, message.id)
    const promise = new Promise<void>((resolve) => {
      this.publishPromiseResolver[message.id] = resolve
    })
    this.sendMessage(resolveMessage)
    return promise
  }

  protected createBroadcastChannel(): void {
    if (this.publishBroadcastChannel) {
      return
    }

    if (window['@onecx/accelerator']?.topic?.useBroadcastChannel) {
      if (typeof BroadcastChannel === 'undefined') {
        console.log('BroadcastChannel not supported. Disabling BroadcastChannel for topic publisher')
        window['@onecx/accelerator'] ??= {}
        window['@onecx/accelerator'].topic ??= {}
        window['@onecx/accelerator'].topic.useBroadcastChannel = false
      } else {
        this.publishBroadcastChannel = new BroadcastChannel(`Topic-${this.name}|${this.version}`)
      }
    }
  }

  protected sendMessage(message: TopicMessage): void {
    this.createBroadcastChannel()
    if (window['@onecx/accelerator']?.topic?.useBroadcastChannel) {
      this.publishBroadcastChannel?.postMessage(message)
    } else {
      window.postMessage(message, '*')
    }
  }
}


```

### File: accelerator/src/lib/topic/topic-resolve-message.ts

```ts

import { TopicMessage } from './topic-message'
import { TopicMessageType } from './topic-message-type'

export class TopicResolveMessage extends TopicMessage {
  constructor(
    type: TopicMessageType,
    name: string,
    version: number,
    public resolveId: number
  ) {
    super(type, name, version)
  }
}


```

## Folder: accelerator/src/lib/topic/mocks (2 files)

### File: accelerator/src/lib/topic/mocks/broadcast-channel.mock.ts

```ts

export class BroadcastChannelMock {
    public static listeners: Record<string, ((m: any) => any)[]> = {} // NOSONAR
    public static asyncCalls = false // NOSONAR
    listener: ((m: any) => any) | undefined

    constructor(public name: string) { }

    postMessage(m: any) {
        if (BroadcastChannelMock.asyncCalls) {
            setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                BroadcastChannelMock.listeners[this.name]?.forEach((l) => l({ data: m, stopImmediatePropagation: () => { }, stopPropagation: () => { } }))
            }, 0)
        } else {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            BroadcastChannelMock.listeners[this.name]?.forEach((l) => l({ data: m, stopImmediatePropagation: () => { }, stopPropagation: () => { } }))
        }
    }

    addEventListener(event: string, listener: (m: any) => any) {
        this.listener = listener;
        BroadcastChannelMock.listeners[this.name] ??= [];
        BroadcastChannelMock.listeners[this.name].push(listener)
    }

    close() {
        BroadcastChannelMock.listeners[this.name] = BroadcastChannelMock.listeners[this.name].filter((l) => l !== this.listener)
    }
}

```

### File: accelerator/src/lib/topic/mocks/fake-topic.ts

```ts

import { Subject, Observable, Observer, Subscription, UnaryFunction, BehaviorSubject, ReplaySubject } from 'rxjs'

export class FakeTopic<T> {
  private state: Subject<T>
  constructor(initialValue: T | undefined = undefined) {
    if (initialValue !== undefined) {
      this.state = new BehaviorSubject<T>(initialValue)
    } else {
      this.state = new ReplaySubject<T>(1)
    }
  }
  asObservable(): Observable<T> {
    return this.state.asObservable()
  }

  subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void),
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return (<any>this.asObservable()).subscribe(observerOrNext, error, complete)
  }

  pipe(...operations: UnaryFunction<any, any>[]): unknown {
    return (<any>this.asObservable()).pipe(...operations)
  }

  publish(value: T): Promise<void> {
    this.state.next(value)
    return Promise.resolve()
  }

  destroy(): void {
    this.state.complete()
  }

  getValue(): T {
    if (this.state instanceof BehaviorSubject) {
      return this.state.getValue()
    }
    throw new Error('Only possible for FakeTopic with initial value')
  }
}


```

## Folder: accelerator/src/lib/utils (10 files)

### File: accelerator/src/lib/utils/date.utils.ts

```ts

export function isValidDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value as any)
}

/**
 * This function removes time info from a JS DateTime Object and returns
 * the local date as a correct UTC Date
 * @param date a date-time Date object
 * @returns the date without time / timezone issues
 */
export function getUTCDateWithoutTimezoneIssues(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0))
}


```

### File: accelerator/src/lib/utils/gatherer.spec.ts

```ts

/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { TopicPublisher } from '../topic/topic-publisher'
import { Gatherer } from './gatherer'

import { BroadcastChannelMock } from '../topic/mocks/broadcast-channel.mock'

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannelMock)

describe('Gatherer', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let gatherer1: Gatherer<string, string>
  let gatherer2: Gatherer<string, string>

  beforeEach(() => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.initDate = Date.now() - 1000000

    listeners = []

    gatherer1 = new Gatherer<string, string>('test', 1, async (request) => `responseGatherer1: ${request}`)
    gatherer2 = new Gatherer<string, string>('test', 1, async (request) => `responseGatherer2: ${request}`)
  })

  afterEach(() => {
    gatherer1.destroy()
    gatherer2.destroy()
  })

  it('should gather responses from all instances', async () => {
    const responses = await gatherer1.gather('request1')

    expect(responses).toEqual(['responseGatherer2: request1'])
  })

  it('should not gather responses if destroyed', async () => {
    gatherer2.destroy()

    const responses = await gatherer1.gather('request2')

    expect(responses).toEqual([])
  })

  it('should throw an error if gatherer is not initialized', async () => {
    delete (window as any)['@onecx/accelerator'].gatherer.promises

    await expect(gatherer1.gather('request3')).rejects.toThrow('Gatherer is not initialized')
    // Ensure that promises are reset for the next test
    ;(window as any)['@onecx/accelerator'].gatherer.promises = {}
  })

  it('should log received and answered requests if debug is enabled', async () => {
    ;(window as any)['@onecx/accelerator'].gatherer.debug = ['test']
    const consoleLogSpy = jest.spyOn(console, 'log')

    await gatherer1.gather('request4')

    expect(consoleLogSpy).toHaveBeenCalledWith('Gatherer test: 1 received request request4')
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Gatherer test: 1 answered request request4 with response',
      'responseGatherer2: request4'
    )

    consoleLogSpy.mockRestore()
  })

  it('should warn if array was not initialized', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    gatherer2['isOwnerOfRequest'] = () => false
    new TopicPublisher('test', 1).publish({ id: 999, request: 'test' })

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Expected an array of promises to gather for id ',
      999,
      ' but the id was not present'
    )
  })

  it('should clean up promises on destroy', () => {
    gatherer1['ownIds'].add(1)
    ;(window as any)['@onecx/accelerator'].gatherer.promises[1] = []

    gatherer1.destroy()

    expect((window as any)['@onecx/accelerator'].gatherer.promises[1]).toBeUndefined()
  })
})


```

### File: accelerator/src/lib/utils/gatherer.ts

```ts

import { Subscription } from 'rxjs'
import { Topic } from '../topic/topic'

import '../declarations'

/**
 * Implementation of the Scatter-Gather pattern.
 */
export class Gatherer<Request, Response> {
  private static id = 0
  private readonly topic: Topic<{ id: number; request: Request }>
  private readonly ownIds = new Set<number>()
  private readonly topicSub: Subscription | null = null
  private readonly topicName: string

  constructor(name: string, version: number, callback: (request: Request) => Promise<Response>) {
    this.topicName = name
    this.logIfDebug(name, `Gatherer ${name}: ${version} created`)

    this.topic = new Topic<{ id: number; request: Request }>(name, version, false)
    // Perform a callback every time a request is received in the topic.
    this.topicSub = this.topic.subscribe((m) => {
      if (!this.isOwnerOfRequest(m) && window['@onecx/accelerator']?.gatherer?.promises) {
        this.logReceivedIfDebug(name, version, m)
        if (!window['@onecx/accelerator'].gatherer.promises[m.id]) {
          console.warn('Expected an array of promises to gather for id ', m.id, ' but the id was not present')
          return
        }
        let resolve: (value: Response) => void
        window['@onecx/accelerator'].gatherer.promises[m.id].push(
          new Promise((r) => {
            resolve = r
          })
        )
        callback(m.request).then((response) => {
          resolve(response)
          this.logAnsweredIfDebug(name, version, m, response)
        })
      }
    })
  }

  destroy() {
    this.logIfDebug(this.topic.name, `Gatherer ${this.topic.name}: ${this.topic.version} destroyed`)

    this.topicSub?.unsubscribe()
    this.topic.destroy()
    for (const id of this.ownIds) {
      if (window['@onecx/accelerator']?.gatherer?.promises?.[id]) {
        delete window['@onecx/accelerator'].gatherer.promises[id]
      }
    }
  }

  async gather(request: Request): Promise<Response[]> {
    if (!window['@onecx/accelerator']?.gatherer?.promises) {
      throw new Error('Gatherer is not initialized')
    }

    const id = Gatherer.id++
    // Save the id to ownIds to prevent processing own requests.
    this.ownIds.add(id)
    window['@onecx/accelerator'].gatherer.promises[id] = []
    // Publish the request to the topic.
    // This will trigger the callback for all instances of gatherer.
    // Await is crucial here to ensure that promises are created before awaiting them.
    // See Why Awaiting the Promise Works in dev-docs/topics/scheduling.adoc.
    const message = { id, request }
    await this.topic.publish(message)
    const promises = window['@onecx/accelerator'].gatherer.promises[id] as Promise<Response>[]
    delete window['@onecx/accelerator'].gatherer.promises[id]
    this.ownIds.delete(id)
    return Promise.all(promises).then((v) => {
      this.logIfDebug(this.topicName, 'Finished gathering responses', v)
      return v
    })
  }

  private logReceivedIfDebug(name: string, version: number, m: { id: number; request: Request }) {
    this.logIfDebug(name, 'Gatherer ' + name + ': ' + version + ' received request ' + m.request)
  }

  private logAnsweredIfDebug(name: string, version: number, m: { id: number; request: Request }, response: Response) {
    this.logIfDebug(
      name,
      'Gatherer ' + name + ': ' + version + ' answered request ' + m.request + ' with response',
      response
    )
  }

  private logIfDebug(name: string, ...args: any[]) {
    if (window['@onecx/accelerator']?.gatherer?.debug?.includes(name)) {
      console.log(...args)
    }
  }

  private isOwnerOfRequest(m: { id: number; request: Request }): boolean {
    return this.ownIds.has(m.id)
  }
}


```

### File: accelerator/src/lib/utils/get-normalized-browser-locales.utils.spec.ts

```ts

/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

jest.mock('./normalize-locales.utils', () => ({
  normalizeLocales: jest.fn(),
}))

import { normalizeLocales } from './normalize-locales.utils'
import { getNormalizedBrowserLocales } from './get-normalized-browser-locales.utils'

describe('getNormalizedBrowserLocales', () => {
  const originalNavigator = window.navigator
  let mockNormalizeLocales: jest.Mock

  beforeEach(() => {
    mockNormalizeLocales = normalizeLocales as jest.Mock
  })

  afterEach(() => {
    // Restore the original navigator object after each test
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      configurable: true,
    })
  })

  it('should return ["en"] if navigator is undefined', () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
    })
    expect(getNormalizedBrowserLocales()).toEqual(['en'])
  })

  it('should return normalized locales from navigator.languages', () => {
    Object.defineProperty(window, 'navigator', {
      value: { languages: ['en-US', 'fr-FR'] },
      configurable: true,
    })
    const expected = ['en-US', 'en', 'fr-FR', 'fr']
    mockNormalizeLocales.mockReturnValue(expected)

    const result = getNormalizedBrowserLocales()
    expect(mockNormalizeLocales).toHaveBeenCalledWith(['en-US', 'fr-FR'])
    expect(result).toEqual(expected)
  })

  it('should return normalized locales from navigator.language if navigator.languages is undefined', () => {
    Object.defineProperty(window, 'navigator', {
      value: { language: 'de-DE' },
      configurable: true,
    })
    const expected = ['de-DE', 'de']
    mockNormalizeLocales.mockReturnValue(expected)

    const result = getNormalizedBrowserLocales()
    expect(mockNormalizeLocales).toHaveBeenCalledWith(['de-DE'])
    expect(result).toEqual(expected)
  })
})


```

### File: accelerator/src/lib/utils/get-normalized-browser-locales.utils.ts

```ts

import { normalizeLocales } from './normalize-locales.utils'

export function getNormalizedBrowserLocales(): string[] {
  if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
    return ['en']
  }

  const langs = window.navigator.languages || [window.navigator.language]
  return normalizeLocales(langs.filter(Boolean))
}


```

### File: accelerator/src/lib/utils/is-test.utils.ts

```ts

/**
 * Utility function to determine if the code is running in a test environment.
 * It checks for the presence of Jasmine or Jest environment variables.
 *
 * @returns {boolean} - Returns true if running in a test environment, otherwise false.
 */
export function isTest(): boolean {
  if(typeof (globalThis as any).jasmine !== 'undefined') {
    return true;
  }
  if(typeof process !== 'undefined' && process.env?.["JEST_WORKER_ID"] !== undefined) {
    return true;
  }
  return false;
}

```

### File: accelerator/src/lib/utils/logs.utils.ts

```ts

import '../declarations'
import { TopicMessageType } from '../topic/topic-message-type'

export function isStatsEnabled(): boolean {
  return window['@onecx/accelerator']?.topic?.statsEnabled === true
}

export function increaseMessageCount(topicName: string, messageType: TopicMessageType): void {
  window['@onecx/accelerator'].topic ??= {}
  window['@onecx/accelerator'].topic.stats ??= {}
  window['@onecx/accelerator'].topic.stats.messagesPublished ??= {}
  if (isStatsEnabled()) {
    const messageStats = window['@onecx/accelerator'].topic.stats.messagesPublished
    if (!messageStats[topicName]) {
      messageStats[topicName] = {
        TopicNext: 0,
        TopicGet: 0,
        TopicResolve: 0,
      }
    }
    messageStats[topicName][messageType]++
  }
}

export function increaseInstanceCount(topicName: string): void {
  window['@onecx/accelerator'].topic ??= {}
  window['@onecx/accelerator'].topic.stats ??= {}
  window['@onecx/accelerator'].topic.stats.instancesCreated ??= {}
  if (isStatsEnabled()) {
    const instanceStats = window['@onecx/accelerator'].topic.stats.instancesCreated
    if (!instanceStats[topicName]) {
      instanceStats[topicName] = 0
    }
    instanceStats[topicName]++
  }
}


```

### File: accelerator/src/lib/utils/normalize-locales.utils.spec.ts

```ts

import { normalizeLocales } from './normalize-locales.utils'

describe('normalizeLocales', () => {
  it('should return an empty array if input is undefined', () => {
    expect(normalizeLocales(undefined)).toEqual([])
  })

  it('should return an empty array if input is an empty array', () => {
    expect(normalizeLocales([])).toEqual([])
  })

  it('should return array with all locales and their general versions', () => {
    const input = ['en-US', 'fr-FR']
    expect(normalizeLocales(input)).toEqual(['en-US', 'en', 'fr-FR', 'fr'])
  })

  it('should handle locales with different separators', () => {
    const input = ['en_US', 'fr-FR']
    expect(normalizeLocales(input)).toEqual(['en_US', 'en', 'fr-FR', 'fr'])
  })

  it('should handle single language codes', () => {
    const input = ['en', 'fr']
    expect(normalizeLocales(input)).toEqual(['en', 'fr'])
  })

  it('should extend locales only if general locale not present in the array already', () => {
    const input = ['en-US', 'de-DE', 'en-GB', 'en']
    expect(normalizeLocales(input)).toEqual(['en-US', 'de-DE', 'de', 'en-GB', 'en'])
  })
})


```

### File: accelerator/src/lib/utils/normalize-locales.utils.ts

```ts

export function normalizeLocales(locales: string[] | undefined): string[] {
  if (!locales || locales.length === 0) return []
  const expanded: string[] = []
  for (const locale of locales) {
    if (!expanded.includes(locale)) expanded.push(locale)
    const lang = locale.split(/[-_]/)[0]
    if (!expanded.includes(lang) && !locales.includes(lang)) expanded.push(lang)
  }
  return expanded
}


```

### File: accelerator/src/lib/utils/path.utils.ts

```ts

type ocxLocation = Location & { deploymentPath: string; applicationPath: string }

/**
 * returns the standard window.location enriched with deploymentPath and applicationPath.
 * deploymentPath contains the part of the URL which identifies the sub folder to which the shell is deployed
 * applicationPath contains the rest of the path which is identifying the workspace and the application to be opened
 */
export function getLocation(): ocxLocation {
  const baseHref = document.getElementsByTagName('base')[0]?.href ?? window.location.origin + '/'
  const location = window.location as ocxLocation
  location.deploymentPath = baseHref.substring(window.location.origin.length)
  location.applicationPath = window.location.href.substring(baseHref.length - 1)

  return location
}


```


