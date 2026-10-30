/** The three collections of messages in the house. */
export type MessageKind = "morning" | "night" | "comfort";

/** A morning or night letter. There is one of each for every day. */
export interface DailyMessage {
  day: number; // 1, 2, 3 ...
  title: string;
  body: string;
}

/** A note in the Comfort Jar. */
export interface ComfortNote {
  id: number; // 1, 2, 3 ...
  title: string;
  body: string;
}

/** A message from any collection, ready to be shown on screen. */
export interface ResolvedMessage {
  key: string; // e.g. "morning:3"
  kind: MessageKind;
  id: number;
  title: string;
  body: string;
  label: string; // e.g. "Morning letter, Day 3"
}
