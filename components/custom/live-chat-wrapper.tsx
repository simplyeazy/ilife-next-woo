"use client";

import dynamic from "next/dynamic";

export const LiveChatWidget = dynamic(
  () => import("@/components/custom/live-chat").then((mod) => mod.LiveChatWidget),
  {
    ssr: false,
  }
);
