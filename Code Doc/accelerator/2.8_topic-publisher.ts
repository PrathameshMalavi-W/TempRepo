// @ts-nocheck
import { TopicDataMessage } from "./topic-data-message";
import { TopicMessage } from "./topic-message";
import { TopicMessageType } from "./2.4_topic-message-type";
import { TopicResolveMessage } from "./topic-resolve-message";

export class TopicPublisher<T> {
  protected publishPromiseResolver: Record<number, () => void> = {};
  protected publishBroadcastChannel: BroadcastChannel | undefined;

  constructor(public name: string, public version: number) {}

  public publish(value: T): Promise<void> {
    // create TopicDataMessage
    const message = new TopicDataMessage<T>(
      TopicMessageType.TopicNext,
      this.name,
      this.version,
      value
    );
    // sendMessage(data)
    this.sendMessage(message);
    
    const resolveMessage = new TopicResolveMessage(
      TopicMessageType.TopicResolve,
      this.name,
      this.version,
      message.id
    );
    const promise = new Promise<void>((resolve) => {
      this.publishPromiseResolver[message.id] = resolve;
    });
    this.sendMessage(resolveMessage);
    return promise;
  }

  protected createBroadcastChannel(): void {
    // channel is created once per Topic instance
    if (this.publishBroadcastChannel) {
      return;
    }

    // This flag was: defaulted in declarations.ts
    if (window["@onecx/accelerator"]?.topic?.useBroadcastChannel) {
      // BroadcastChannel not supported  => false
      if (typeof BroadcastChannel === "undefined") {
        console.log(
          "BroadcastChannel not supported. Disabling BroadcastChannel for topic publisher"
        );
        window["@onecx/accelerator"] ??= {};
        window["@onecx/accelerator"].topic ??= {};
        window["@onecx/accelerator"].topic.useBroadcastChannel = false;

      } else {
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
    if (window["@onecx/accelerator"]?.topic?.useBroadcastChannel) {
      this.publishBroadcastChannel?.postMessage(message);
    } else {
      window.postMessage(message, "*");
    }
  }
}
