// @ts-nocheck
import { Topic } from '@onecx/accelerator'
import { IconTopicPayload } from './icons.model'

export class IconsTopic extends Topic<IconTopicPayload> {
  constructor() {
    // do not send the initial GET message (third param = false)
    super('icons', 1, false)
  }
}

