import type { ReactNode } from "react";

export function generateStaticParams() {
  return ["1", "2", "3", "4", "5"].map((studentId) => ({ studentId }));
}

export default function StudentIdLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

