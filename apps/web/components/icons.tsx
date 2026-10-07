import type { ReactNode } from "react";
export function Icon({ name, size=20 }: { name:string; size?:number }) {
  const paths: Record<string,ReactNode> = { arrow:<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>, external:<><path d="M15 4h5v5"/><path d="m10 14 10-10"/><path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6"/></>, terminal:<><path d="m7 8 4 4-4 4M13 16h4"/><rect x="3" y="3" width="18" height="18" rx="2"/></>, menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>, close:<><path d="m6 6 12 12M18 6 6 18"/></>, mail:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>, check:<path d="m5 12 4 4L19 6"/> };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[name]??paths.arrow}</svg>;
}
