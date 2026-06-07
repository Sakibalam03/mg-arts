import React from 'react';

const GlossaryIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M7 1V13M1 4L13 10M13 4L1 10" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
export default GlossaryIcon;
