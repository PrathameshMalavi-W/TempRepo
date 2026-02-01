// @ts-nocheck
export type IconTopicPayload =
  | { kind: 'IconRequested'; name: string }
  | { kind: 'IconsReceived'; icons: Record<string, string | null> }


