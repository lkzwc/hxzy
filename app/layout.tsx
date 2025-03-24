import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import Layout from '@/components/Layout'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://hxzy.life'),
  title: {
    default: '中医传承平台',
    template: '%s | 中医传承平台'
  },
  description: '传承千年智慧，守护健康人生',
  keywords: ['中医', '中药', '养生', '健康', '传统医学'],
  authors: [{ name: '中医传承平台' }],
  creator: '中医传承平台',
  publisher: '中医传承平台',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  themeColor: '#2C3E50',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <meta name="google-adsense-account" content="ca-pub-8701466885719364"></meta>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen bg-white text-neutral-800">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
