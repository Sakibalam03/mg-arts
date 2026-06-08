import React from 'react'
import { DM_Sans, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { Providers } from '@/components/providers'
import './styles.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '700', '800'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  weight: ['400', '500', '600', '700'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
})

export const metadata = {
  title: {
    default: 'MG Arts - Interior Design & Execution',
    template: '%s | MG Arts',
  },
  description:
    'Turnkey interior design and execution — civil, electrical, plumbing, carpentry. Transparent pricing, Pan-India delivery.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme')||'system';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.classList.add(r)}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
