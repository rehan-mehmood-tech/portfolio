"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Icon } from "./icons";

type Line = { kind: "system" | "user" | "agent"; text: string };
type AgentEvent = { t: string } | { code: string; message: string } | { message_id: string };

const RobotAvatar = dynamic(() => import("./robot-avatar").then((module) => module.RobotAvatar), { ssr: false });
const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_API_URL ?? "http://localhost:8000";
const SESSION_KEY = "rehan_agent_session";
const WELCOME_MESSAGE = "Hi, I’m Rehan AI Agent. I can help you explore AI agents, full-stack MVPs, workflow automation, or hiring Rehan. What would you like to build?";
const QUICK_ACTIONS = ["Build an AI Agent", "Full-Stack MVP", "Workflow Automation", "Book a Call", "Hire Rehan"] as const;

function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [lines, setLines] = useState<Line[]>([{ kind: "agent", text: WELCOME_MESSAGE }]);
  const outputRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, busy]);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function clearHistory() {
    requestRef.current?.abort();
    sessionStorage.removeItem(SESSION_KEY);
    setBusy(false);
    setValue("");
    setLines([{ kind: "agent", text: WELCOME_MESSAGE }]);
  }

  async function run(message: string) {
    const text = message.trim();
    if (!text || busy) return;
    setLines((current) => [...current, { kind: "user", text }]);
    setValue("");
    setBusy(true);
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await fetch(`${AGENT_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: getSessionId(), message: text }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) throw new Error(`Agent request failed with status ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      let hasAgentLine = false;

      while (true) {
        const { done, value: chunkValue } = await reader.read();
        buffer += decoder.decode(chunkValue, { stream: !done }).replaceAll("\r\n", "\n");
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";
        for (const block of blocks) {
          const data = block.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
          if (!data) continue;
          const event = JSON.parse(data) as AgentEvent;
          if ("t" in event) {
            answer += event.t;
            if (!hasAgentLine) {
              setLines((current) => [...current, { kind: "agent", text: answer }]);
              hasAgentLine = true;
            } else {
              setLines((current) => [...current.slice(0, -1), { kind: "agent", text: answer }]);
            }
          } else if ("code" in event) {
            throw new Error(event.message);
          }
        }
        if (done) break;
      }
      if (!answer.trim()) throw new Error("Agent returned an empty response");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setLines((current) => [...current, {
        kind: "agent",
        text: "I’m temporarily unavailable, but Rehan can help directly. Email **mehmoodrehan708@gmail.com** or WhatsApp **+92 328 8514952**.",
      }]);
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <>
        <RobotAvatar onActivate={() => setOpen(true)} />
        <button ref={triggerRef} className="terminal-launcher" onClick={() => setOpen(true)} aria-label="Talk to my AI">
          <span className="terminal-launcher-copy">Talk to my AI</span><i aria-hidden="true">▍</i>
        </button>
      </>
    );
  }

  return (
    <section className="terminal-window agent-chat" role="dialog" aria-modal="true" aria-label="Rehan AI Agent">
      <header className="agent-chat-header">
        <div>
          <span className="agent-status-dot" aria-hidden="true" />
          <div><strong>Rehan AI Agent</strong><small>Online</small></div>
        </div>
        <div className="agent-header-actions">
          <button type="button" onClick={clearHistory} aria-label="Clear chat history" title="Clear history">Clear</button>
          <button type="button" onClick={() => { setOpen(false); triggerRef.current?.focus(); }} aria-label="Close AI assistant"><Icon name="close" size={15} /></button>
        </div>
      </header>

      <div className="terminal-output agent-messages" ref={outputRef} aria-live="polite">
        {lines.map((line, index) => (
          <article key={`${line.kind}-${index}`} className={`agent-message ${line.kind}`}>
            {line.kind === "agent" && <span className="agent-message-mark" aria-hidden="true"><Icon name="terminal" size={13} /></span>}
            <div><ReactMarkdown remarkPlugins={[remarkGfm]}>{line.text}</ReactMarkdown></div>
          </article>
        ))}
        {busy && <div className="agent-typing" role="status"><i /><i /><i /><span className="sr-only">Rehan AI Agent is responding</span></div>}
      </div>

      <div className="agent-chat-controls">
        <div className="command-chips" aria-label="Suggested questions">
          {QUICK_ACTIONS.map((action) => <button key={action} type="button" disabled={busy} onClick={() => void run(action)}>{action}</button>)}
        </div>
        <form className="terminal-input" onSubmit={(event: FormEvent) => { event.preventDefault(); void run(value); }}>
          <label className="sr-only" htmlFor="terminal-command">Ask Rehan AI Agent</label>
          <input id="terminal-command" autoFocus value={value} onChange={(event) => setValue(event.target.value)} maxLength={1000} disabled={busy} placeholder="Ask about a project or service..." />
          <button type="submit" disabled={busy || !value.trim()} aria-label="Send message"><Icon name="arrow" size={15} /></button>
        </form>
        <p className="agent-disclaimer">AI responses can be imperfect. Do not share sensitive information.</p>
      </div>
    </section>
  );
}