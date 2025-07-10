"use client";

import { SessionProvider } from "next-auth/react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from 'antd';

export function AllProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AntdRegistry>
        <ConfigProvider
          wave={{ disabled: true }}
        >
          <App>
            {children}
          </App>
        </ConfigProvider>
      </AntdRegistry>
    </SessionProvider>
  );
}
