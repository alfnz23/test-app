import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'REDLINE Recording Studio - Premium Recording, Mixing & Mastering',
  description: 'Professional recording studio in the heart of the city. State-of-the-art equipment, world-class acoustics, and expert engineers. Book your session today.',
  keywords: 'recording studio, music production, mixing, mastering, podcast recording, rehearsal space',
  authors: [{ name: 'REDLINE Studios' }],
  creator: 'REDLINE Recording Studio',
  publisher: 'REDLINE Studios',
  metadataBase: new URL('https://redlinestudios.com'),
  openGraph: {
    title: 'REDLINE Recording Studio - Where Legends Are Recorded',
    description: 'Professional recording studio with premium equipment and expert sound engineers. Experience the difference.',
    url: 'https://redlinestudios.com',
    siteName: 'REDLINE Recording Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'REDLINE Recording Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REDLINE Recording Studio',
    description: 'Professional recording studio - Where legends are recorded',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-black text-white font-inter antialiased overflow-x-hidden">
        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}