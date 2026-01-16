// @ts-nocheck

/*

BroadcastChannel is a browser-provided global constructor just like:
    window
    document
    localStorage
    fetch
    Worker

If the browser supports it, the browser injects it into the global scope:
    globalThis.BroadcastChannel = function BroadcastChannel(...) { ... }
* You never import it.
* You never declare it.
* You only detect its presence.



How tests make it “exist”
Look at your test files:
    Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannelMock)

What happened here
The test manually injects a global:
    globalThis.BroadcastChannel = BroadcastChannelMock
Now this condition becomes:
    typeof BroadcastChannel === 'function'


  
*/
import { TopicDataMessage } from "./topic-data-message";
import { TopicMessage } from "./topic-message";
import { TopicMessageType } from "./2.4_topic-message-type";
import { TopicResolveMessage } from "./topic-resolve-message";

export class TopicPublisher<T> {
  // Publishing returns a Promise<void>. That promise must resolve only when all receivers acknowledge.
  //      Each publish() creates a promise
  //      Resolver stored under message ID
  //      Later resolved by TopicResolveMessage
  protected publishPromiseResolver: Record<number, () => void> = {};

  // A lazy-created BroadcastChannel used only for publishing.
  // Receiving uses a different channel instance (in Topic).
  //      How
  //      Created only if: feature flag enabled & browser supports BroadcastChannel
  protected publishBroadcastChannel: BroadcastChannel | undefined;



  // Topic identity = (name, version)
  constructor(public name: string, public version: number) {}



  public publish(value: T): Promise<void> {

    // create TopicDataMessage
    const message = new TopicDataMessage<T>(
      TopicMessageType.TopicNext,
      this.name,
      this.version,
      value
    );

    // sendMessage(data) => We pause publish flow and jump to sendMessage.
    this.sendMessage(message);
    
    // A TopicResolve message is created. This is the acknowledgement trigger.
    const resolveMessage = new TopicResolveMessage(
      TopicMessageType.TopicResolve,
      this.name,
      this.version,
      message.id
    );

    // Promise resolver is stored but not executed. Resolution must happen later, after receivers respond.
    const promise = new Promise<void>((resolve) => {
      this.publishPromiseResolver[message.id] = resolve;
    });

    // Resolve signal is broadcast. Receivers handle this in: Topic.handleTopicResolveMessage
    this.sendMessage(resolveMessage);


    // A Promise is resolved when its internal resolve function is called — no matter where that call happens
    // So when OneCX executes: publishPromiseResolver()  means resolve()
    return promise;
  }




  protected createBroadcastChannel(): void {
    // Ensures one channel per publisher instance. One channel is created once per Topic instance
    if (this.publishBroadcastChannel) {
      return;
    }

    // This flag was: defaulted in declarations.ts Checks global runtime decision. => This flag can be flipped dynamically:
    //  unsupported browser, fallback after errors, forced window messaging
    if (window["@onecx/accelerator"]?.topic?.useBroadcastChannel) {

      // BroadcastChannel not supported  => false
      if (typeof BroadcastChannel === "undefined") {
        console.log(
          "BroadcastChannel not supported. Disabling BroadcastChannel for topic publisher"
        );


        // Feature flag is globally disabled.
        // So all future publishers & topics fall back consistently.
        window["@onecx/accelerator"] ??= {};
        window["@onecx/accelerator"].topic ??= {};
        window["@onecx/accelerator"].topic.useBroadcastChannel = false;

      } else {

        // Yes. In environments that support it, the browser injects it into the global scope:  globalThis.BroadcastChannel === window.BroadcastChannel
        // BroadcastChannel supported  
        //    Topic-user|1
        //    Topic-config|1
        // Topic name + version = isolation Different Topics NEVER collide
        this.publishBroadcastChannel = new BroadcastChannel(
          `Topic-${this.name}|${this.version}`
        );
      }
    }
  }





  protected sendMessage(message: TopicMessage): void {
    this.createBroadcastChannel();

    // Message is dispatched via exactly one transport.
    //    BroadcastChannel → cross-tab, cross-MFE
    //    window.postMessage → fallback / legacy
    if (window["@onecx/accelerator"]?.topic?.useBroadcastChannel) {
      this.publishBroadcastChannel?.postMessage(message);
    } else {
      window.postMessage(message, "*");
    }
  }
}



/*

Resolve publish promise

    this.publishPromiseResolver[message.id] = resolve
The resolve function is saved in an object, keyed by message.id.
Because something else will decide when this publish is “done”.
That “something else” is:
👉 a TopicResolveMessage received later.
    {
      42: resolveFunction
    }

Instead of calling resolve() immediately, OneCX says:
“I will decide later when this Promise should complete.”


Where does it ACTUALLY resolve then?
Later, in file: Topic.ts, this happens:

    private handleTopicResolveMessage(m: MessageEvent<TopicMessage>) {
      const publishPromiseResolver = this.publishPromiseResolver[(m.data as TopicResolveMessage).resolveId]

      if (publishPromiseResolver) {
        publishPromiseResolver()   // ✅ RESOLVE HERE
        delete this.publishPromiseResolver[resolveId]
      }
    }





Concrete execution example (REAL FLOW)
Step 1 — publish is called
await topic.publish('hello')

Internally:
message.id = 7
publishPromiseResolver = {}




Step 2 — Promise is created
this.publishPromiseResolver[7] = resolveFn

Now memory looks like:

publishPromiseResolver = {
  7: resolveFn
}
Promise is still pending.



Step 3 — messages are sent
TopicNext(id=7, data='hello')
TopicResolve(resolveId=7)



Step 4 — another Topic instance receives resolve
That instance sends resolve back.



Step 5 — resolve handler runs
publishPromiseResolver[7]()

➡ Promise resolves
➡ await publish() continues
➡ Cleanup happens



Step 6 — Why key by message.id?
Because: multiple publishes can happen concurrently each publish must resolve independently

Example:

publish('A') → id 1
publish('B') → id 2


Map becomes:

{
  1: resolveA,
  2: resolveB
}

Each resolves separately when its resolve message arrives.
*/