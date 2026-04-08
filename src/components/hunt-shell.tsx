import type { ReactNode } from "react";

type HuntShellProps = {
  children: ReactNode;
};

export function HuntShell({ children }: HuntShellProps) {
  return (
    <main className="page-shell">
      <section className="content-stack">{children}</section>
    </main>
  );
}
