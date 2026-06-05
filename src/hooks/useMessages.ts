"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IMessage } from "@/types/recommendation";

interface SendMessageData {
  content: string;
  recommendationId?: number;
}

/** Refetch interval for the chat thread (ms). */
const POLL_INTERVAL = 4000;

/**
 * Loads and manages the shared chat thread (« Échanges »).
 * Polls the server every {@link POLL_INTERVAL}ms while mounted so new messages
 * from the partner appear without a manual refresh.
 * @returns `{ messages, isLoading, error, sendMessage, refresh }`
 */
export function useMessages() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // True while the component is mounted — guards against setState after unmount.
  const mounted = useRef(true);
  // True while a fetch is in flight — skips overlapping polls (avoids out-of-order updates).
  const inFlight = useRef(false);

  const fetchMessages = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const response = await fetch("/api/messages");

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch messages");
      }

      if (!mounted.current) return;
      setMessages(data.data.messages);
      setError(null);
    } catch (err) {
      if (mounted.current) setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching messages:", err);
    } finally {
      inFlight.current = false;
      if (mounted.current) setIsLoading(false);
    }
  }, [router]);

  const sendMessage = useCallback(
    async (payload: SendMessageData) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setMessages((prev) => [...prev, data.data.message]);
      return data.data.message as IMessage;
    },
    []
  );

  useEffect(() => {
    mounted.current = true;
    fetchMessages();
    const interval = setInterval(fetchMessages, POLL_INTERVAL);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [fetchMessages]);

  return { messages, isLoading, error, sendMessage, refresh: fetchMessages };
}
