"use client";

import { SessionProvider } from "next-auth/react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export function AllProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
        <AntdRegistry>{children}</AntdRegistry>
    </SessionProvider>
  );
}
