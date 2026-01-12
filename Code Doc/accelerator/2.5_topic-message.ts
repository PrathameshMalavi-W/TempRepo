// @ts-nocheck
import { increaseMessageCount, isStatsEnabled } from "./utils/logs.utils";
import { Message } from "./2.3_message";
import { TopicMessageType } from "./2.4_topic-message-type";

export class TopicMessage extends Message {
  constructor(
    type: TopicMessageType,
    public name: string,
    public version: number
  ) {
    super(type);
    if (isStatsEnabled()) {
      increaseMessageCount(this.name, type);
    }
  }
}



/*


What isStatsEnabled() checks ==>  From utils/log.utils.ts
    return window['@onecx/accelerator']?.topic?.statsEnabled === true

What increaseMessageCount() does increaseMessageCount(topicName, messageType) ==> It increments counters like:
      window.topic.stats.messagesPublished[topicName].TopicNext++



*/