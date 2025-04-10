import "./globals.css";

import Layout from "@/components/Layout";
import { AllProvider } from "./providers";

export const metadata = {
  metadataBase: new URL("https://hxzy.life"),
  title: {
    default: "中医传承平台",
    template: "%s | 中医传承平台",
  },
  description: "传承千年智慧，守护健康人生",
  keywords: ["中医", "中药", "养生", "健康", "传统医学"],
  authors: [{ name: "中医传承平台" }],
  creator: "中医传承平台",
  publisher: "中医传承平台",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <meta
        name="google-adsense-account"
        content="ca-pub-8701466885719364"
      ></meta>
      <body suppressHydrationWarning>
        <AllProvider>
          <Layout>{children}</Layout>
        </AllProvider>
      </body>
    </html>
  );
}
