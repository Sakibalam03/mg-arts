import Header from 'components/shared/header'
import { getNavigation } from '@/lib/cms'

export default async function SiteNav() {
  const navItems = await getNavigation()
  return <Header isSticky navItems={navItems} />
}
