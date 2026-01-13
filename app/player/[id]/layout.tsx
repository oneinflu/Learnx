import type { ReactNode } from "react";

export function generateStaticParams() {
  return ["1", "2", "3", "4", "5"].map((id) => ({ id }));
}

export default function PlayerIdLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

