import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import Topbar from 'components/shared/topbar/topbar'
import TopbarProvider from 'components/shared/topbar/topbar-provider'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <TopbarProvider>
      <Topbar />
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </TopbarProvider>
  )
}
