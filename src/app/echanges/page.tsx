"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { useRecommendations } from "@/hooks/useRecommendations";
import { IMessage, IRecommendation } from "@/types/recommendation";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getInitial } from "@/lib/user";
import Tabs from "@/components/Tabs";

const TABS = ["Discussion", "Suggestions"] as const;
type Tab = (typeof TABS)[number];

/** Day separator label (Aujourd'hui / Hier / date). */
function dayLabel(date: Date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return "Aujourd'hui";
  if (same(d, yesterday)) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function timeLabel(date: Date) {
  return new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/** Mini reco card embedded in a chat bubble. */
function SharedReco({ rec }: { rec: IRecommendation }) {
  return (
    <Link href={`/recommendations/${rec.id}`} className="flex gap-3 items-center mb-2">
      <span className="w-10 h-12 rounded-md bg-ink/80 flex items-center justify-center font-serif text-surface text-sm shrink-0">
        {rec.title.charAt(0)}
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-ink leading-tight truncate">{rec.title}</span>
        {rec.author && <span className="block text-xs text-muted truncate">{rec.author}</span>}
      </span>
    </Link>
  );
}

function Bubble({ message, mine }: { message: IMessage; mine: boolean }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
          mine
            ? "bg-rose-light text-ink rounded-br-sm"
            : "bg-ink text-surface rounded-bl-sm"
        }`}>
        {message.recommendation && <SharedReco rec={message.recommendation} />}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        <p className={`text-[0.6rem] mt-1 text-right ${mine ? "text-ink/50" : "text-surface/50"}`}>
          {timeLabel(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default function EchangesPage() {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useMessages();
  const { recommendations } = useRecommendations();
  const [tab, setTab] = useState<Tab>("Discussion");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, tab]);

  // Group messages by day for separators.
  const grouped = useMemo(() => {
    const groups: { label: string; items: IMessage[] }[] = [];
    for (const m of messages) {
      const label = dayLabel(m.createdAt);
      const last = groups[groups.length - 1];
      if (last && last.label === label) last.items.push(m);
      else groups.push({ label, items: [m] });
    }
    return groups;
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setDraft("");
    try {
      await sendMessage({ content });
    } catch {
      setDraft(content); // restore on failure
    } finally {
      setSending(false);
    }
  };

  const shareReco = async (rec: IRecommendation) => {
    setTab("Discussion");
    await sendMessage({
      content: `Je te partage « ${rec.title} »`,
      recommendationId: rec.id,
    });
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <section className="flex flex-col flex-1 w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="px-6 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-2xl tracking-[0.2em] text-ink">ÉCHANGES</h1>
            <span className="w-9 h-9 rounded-full bg-rose-light flex items-center justify-center text-ink text-sm font-medium">
              {getInitial(user?.email)}
            </span>
          </div>

          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>

        {/* Discussion */}
        {tab === "Discussion" && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {isLoading && messages.length === 0 && (
                <p className="text-center text-subtle text-sm py-10">Chargement…</p>
              )}
              {!isLoading && messages.length === 0 && (
                <p className="text-center text-muted text-sm py-10">
                  Démarrez la conversation — partagez un coup de cœur ✨
                </p>
              )}
              {grouped.map((group) => (
                <div key={group.label} className="space-y-3">
                  <p className="text-center text-[0.6rem] uppercase tracking-[0.25em] text-subtle py-1">
                    {group.label}
                  </p>
                  {group.items.map((m) => (
                    <Bubble key={m.id} message={m} mine={m.userId === user?.id} />
                  ))}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <form onSubmit={send} className="sticky bottom-0 bg-surface/95 backdrop-blur-sm px-6 py-3 flex items-center gap-3 border-t border-ink/5">
              <button
                type="button"
                onClick={() => setTab("Suggestions")}
                aria-label="Partager une recommandation"
                className="w-10 h-10 rounded-full bg-white/70 border border-ink/5 flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Écrivez votre message…"
                className="flex-1 bg-white border border-rose-light rounded-full px-5 py-2.5 text-ink text-sm focus:outline-none focus:border-rose transition-colors"
              />
              <button
                type="submit"
                disabled={!draft.trim() || sending}
                aria-label="Envoyer"
                className="w-10 h-10 rounded-full bg-rose flex items-center justify-center text-ink hover:bg-rose-light transition-colors disabled:opacity-50 shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l14-7-7 14-2-5-5-2z" />
                </svg>
              </button>
            </form>
          </>
        )}

        {/* Suggestions */}
        {tab === "Suggestions" && (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
            <p className="text-muted text-sm mb-2">Touchez une reco pour la partager dans la discussion.</p>
            {recommendations.length === 0 && (
              <p className="text-subtle text-sm py-8 text-center">Aucune recommandation à partager.</p>
            )}
            {recommendations.map((rec) => (
              <button
                key={rec.id}
                onClick={() => shareReco(rec)}
                className="w-full text-left flex gap-3 items-center rounded-2xl bg-white/70 border border-ink/5 p-3 hover:shadow-md transition-all">
                <span className="w-12 h-12 rounded-lg bg-rose-light flex items-center justify-center font-serif text-ink shrink-0">
                  {rec.title.charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  {rec.category && (
                    <span className="block text-[0.6rem] uppercase tracking-[0.18em] text-subtle">
                      {CATEGORY_LABELS[rec.category]}
                    </span>
                  )}
                  <span className="block font-serif text-ink leading-tight truncate">{rec.title}</span>
                  {rec.author && <span className="block text-xs text-muted truncate">{rec.author}</span>}
                </span>
                <span className="text-rose text-xs uppercase tracking-wide shrink-0">Partager</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
