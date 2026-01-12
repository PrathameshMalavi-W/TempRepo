// @ts-nocheck
/*
This is the base of all messages.
Every message in the Topic system needs:


what kind of message → type
Why id is global (window.onecxMessageId) Because:
* many MFEs exist
* messages come from different bundles
* IDs must never collide
* So OneCX uses the browser window as the global counter.
*/


declare global {
  interface Window {
    onecxMessageId: number
  }
}
// This is just: a number counter  ==>   Every time a message is created:
// used to assign a unique ID to every message across all apps
window['onecxMessageId'] ??= 1



/*
* type ->  TopicNext, TopicGet,  TopicResolve
* when it was created → timestamp
* unique identity → id
*/
export class Message {
  timestamp: number
  id: number // id can be undefined while used via old implementation

  constructor(public type: string) {
    this.timestamp = window.performance.now()
    this.id = window['onecxMessageId']++
  }
}

