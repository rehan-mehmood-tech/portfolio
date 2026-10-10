"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

type Line = { kind: "system" | "user" | "agent"; text: string };
type AgentEvent = { t: string } | { code: string; message: string } | { message_id: string };

const RobotAvatar = dynamic(() => import("./robot-avatar").then((module) => module.RobotAvatar), { ssr: false });

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_API_URL ?? "http://localhost:8000";
const SESSION_KEY = "rehan_agent_session";

function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [lines, setLines] = useState<Line[]>([{ kind: "system", text: "Rehan AI Agent — answers can be imperfect. Do not share sensitive information." }]);
  const outputRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [lines, busy]);

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

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

  async function run(message: string) {
    const text = message.trim();
    if (!text || busy) return;
    if (text.toLowerCase() === "clear") {
      setLines([]);
      setValue("");
      return;
    }

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
      setLines((current) => [...current, { kind: "agent", text: "The assistant is unavailable right now. Please try again or contact Rehan directly." }]);
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      setBusy(false);
    }
  }

  if (!open) {
    return <>
      <RobotAvatar onActivate={() => setOpen(true)} />
      <button ref={triggerRef} className="terminal-launcher" onClick={() => setOpen(true)}><span>&gt;_ ask rehan&apos;s agent</span><i>▍</i></button>
    </>;
  }

  return <div className={`terminal-window ${maximized ? "maximized" : ""}`} role="dialog" aria-modal="true" aria-label="Rehan's AI assistant">
    <div className="terminal-title"><span><Icon name="terminal" size={15} /> Command Prompt — Rehan AI Agent</span><div><button onClick={() => setMaximized((current) => !current)} aria-label={maximized ? "Restore" : "Maximize"}>□</button><button onClick={() => { setOpen(false); triggerRef.current?.focus(); }} aria-label="Close"><Icon name="close" size={14} /></button></div></div>
    <div className="terminal-output" ref={outputRef} aria-live="polite">{lines.map((line, index) => <p key={`${line.kind}-${index}`} className={line.kind}>{line.kind === "user" && <strong>guest&gt; </strong>}{line.kind === "agent" && <strong>rehan-ai&gt; </strong>}{line.text}</p>)}{busy && <p className="system">connecting / streaming…</p>}</div>
    <div className="command-chips">{["services", "projects", "availability", "contact"].map((command) => <button key={command} disabled={busy} onClick={() => void run(command)}>{command}</button>)}</div>
    <form className="terminal-input" onSubmit={(event: FormEvent) => { event.preventDefault(); void run(value); }}><label htmlFor="terminal-command">guest&gt;</label><input id="terminal-command" autoFocus value={value} onChange={(event) => setValue(event.target.value)} maxLength={1000} disabled={busy} /><span>▍</span></form>
  </div>;
}


