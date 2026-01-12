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

export class TopicDataMessage<T> extends TopicMessage {
  constructor(
    type: TopicMessageType,
    name: string,
    version: number,
    public data: T
  ) {
    super(type, name, version);
  }
}


/*

When Shell does:
currentWorkspace$.publish(workspace)


Internally this object is created:
new TopicDataMessage(
  TopicMessageType.TopicNext,
  'current-workspace',
  1,
  workspace
)


Which becomes (conceptually):
{
  type: 'TopicNext',
  id: 42,
  timestamp: 12345,
  name: 'current-workspace',
  version: 1,
  data: {...}
}





Where this is used (preview, no jumping) ==> You’ll see this class created in:
calling -> TopicPublisher.publish

    const message = new TopicDataMessage(
      TopicMessageType.TopicNext,
      this.name,
      this.version,
      value
    )


And consumed in:  ==> calling -> Topic.handleTopicNextMessage

    Execution example (concrete)
    new TopicDataMessage(
      TopicMessageType.TopicNext,
      'user',
      1,
      { id: 10, name: 'Alice' }
    )


Produces an object equivalent to:
    {
      type: 'TopicNext',
      name: 'user',
      version: 1,
      data: { id: 10, name: 'Alice' },
      id: 42,
      timestamp: 1234.56
    }

Execution / console-style summary What happened
    [TopicDataMessage] created
    [TopicDataMessage] payload attached

*/