import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Briefing | ROXXO Design',
  description: 'Responda o briefing e receba uma estratégia personalizada para sua marca.',
  metadataBase: new URL('https://briefing.roxxodesign.com'),
  openGraph: {
    title: 'Briefing Estratégico | ROXXO Design',
    description: 'Design que vende. Estratégia que escala.',
    type: 'website',
  },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
