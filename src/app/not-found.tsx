import '@/app/(frontend)/styles.css'
import { DM_Sans, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { Providers } from '@/components/providers'
import { FontApplier } from '@/components/font-applier'
import Topbar from 'components/shared/topbar/topbar'
import TopbarProvider from 'components/shared/topbar/topbar-provider'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import { NotFoundContent } from '@/components/not-found-content'

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

export default function NotFound() {
  return (
    <Providers>
      <TopbarProvider>
        <FontApplier
          dmSansVariable={dmSans.variable}
          geistMonoVariable={geistMono.variable}
          instrumentSerifVariable={instrumentSerif.variable}
        />
        <Topbar />
        <SiteNav />
        <main className="flex-1">
          <NotFoundContent />
        </main>
        <SiteFooter />
      </TopbarProvider>
    </Providers>
  )
}
