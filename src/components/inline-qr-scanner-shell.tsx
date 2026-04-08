"use client";

import dynamic from "next/dynamic";

const InlineQrScanner = dynamic(
  () =>
    import("@/components/inline-qr-scanner").then(
      (module) => module.InlineQrScanner,
    ),
  {
    ssr: false,
  },
);

export function InlineQrScannerShell() {
  return <InlineQrScanner />;
}
