import TopbarClient from './topbar-client/topbar-client';

const TOPBAR_DATA = {
  text: 'Free site visit & consultation for projects above ₹5 lakhs — Book now and get a detailed quote within 48 hours.',
  link: {
    url: '/contact',
  },
};

const Topbar = () => {
  if (!TOPBAR_DATA.text || !TOPBAR_DATA.link?.url) return null;

  return <TopbarClient {...TOPBAR_DATA} />;
};

export default Topbar;
