import type { ReactNode } from "react";

import { getHunt } from "@/lib/hunt";

type HuntShellProps = {
  children: ReactNode;
};

export function HuntShell({ children }: HuntShellProps) {
  const hunt = getHunt();

  return (
    <main className="page-shell">
      <header className="site-chrome">
        <a className="site-badge" href="/">
          <span className="site-badge-mark" />
          <span>{hunt.title}</span>
        </a>
        <nav aria-label="Primary" className="site-nav">
          <a className="site-link" href="/">
            Home
          </a>
          <a className="site-link" href="/how-to">
            How To
          </a>
        </nav>
      </header>
      <section className="content-stack">{children}</section>
    </main>
  );
}
