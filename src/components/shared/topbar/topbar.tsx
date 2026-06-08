import { getSiteSettings } from '@/lib/cms';
import TopbarClient from './topbar-client/topbar-client';

const Topbar = async () => {
  try {
    const settings = await getSiteSettings();
    const { enabled, text, linkUrl } = settings.topbar ?? {};
    if (!enabled || !text || !linkUrl) return null;
    return <TopbarClient text={text} link={{ url: linkUrl }} />;
  } catch {
    return null;
  }
};

export default Topbar;
