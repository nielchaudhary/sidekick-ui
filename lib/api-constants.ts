export const SIDEKICK_CORE_BASE_URL =
  process.env.NEXT_PUBLIC_SIDEKICK_CORE_URL || "http://localhost:8090";

export const WAITLIST_URL = `${SIDEKICK_CORE_BASE_URL}/waitlist/add`;

export const CHAT_URL = `${SIDEKICK_CORE_BASE_URL}/v1/chat`;
