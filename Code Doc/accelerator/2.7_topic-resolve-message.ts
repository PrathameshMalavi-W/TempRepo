// @ts-nocheck
/*

Message
│
└── TopicMessage
    │
    ├── TopicDataMessage<T>
    │     └─ carries payload (TopicNext)
    │
    └── TopicResolveMessage
          └─ carries resolveId (TopicResolve)

| Class                 | Created in     | Consumed in                   |
| --------------------- | -------------- | ----------------------------- |
| `Message`             | via `super()`  | comparison logic              |
| `TopicMessage`        | TopicPublisher | Topic handlers                |
| `TopicDataMessage`    | `publish()`    | `handleTopicNextMessage()`    |
| `TopicResolveMessage` | `publish()`    | `handleTopicResolveMessage()` |
    

*/


import { TopicMessage } from "./topic-message";
import { TopicMessageType } from "./2.4_topic-message-type";

export class TopicResolveMessage extends TopicMessage {
  constructor(
    type: TopicMessageType,
    name: string,
    version: number,
    public resolveId: number
  ) {
    super(type, name, version);
  }
}





/*

Where it is handled => 📄 topic.ts
calling -> handleTopicResolveMessage
    const resolver = this.publishPromiseResolver[m.resolveId]
    resolver()



ecution example (concrete)
[MFE-A] publish("value1")
[MFE-A] sends TopicNext (id=10)
[MFE-A] sends TopicResolve (resolveId=10)

[MFE-B] receives TopicNext
[MFE-C] receives TopicNext

[MFE-A] receives TopicResolve
[MFE-A] resolves publish() Promise






Code In ==> TopicPublisher.publish() 

const dataMessage = new TopicDataMessage(...)
sendMessage(dataMessage)

const resolveMessage = new TopicResolveMessage(
  TopicMessageType.TopicResolve,
  name,
  version,
  dataMessage.id
)

sendMessage(resolveMessage)

return new Promise(resolve => {
  this.publishPromiseResolver[dataMessage.id] = resolve
})
*/