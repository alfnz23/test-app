import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'REVOLOVERS - Grunge Blues Band | Official Site',
  description: 'Official website of REVOLOVERS - Cinematic grunge blues from the underground. Tour dates, merch, and booking.',
  keywords: 'grunge, blues, band, music, tour dates, merch, booking, revolovers',
  authors: [{ name: 'REVOLOVERS' }],
  openGraph: {
    title: 'REVOLOVERS - Grunge Blues Band',
    description: 'Cinematic grunge blues from the underground',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REVOLOVERS - Grunge Blues Band',
    description: 'Cinematic grunge blues from the underground',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#B45309',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="msapplication-TileColor" content="#B45309" />
        <meta name="theme-color" content="#B45309" />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}