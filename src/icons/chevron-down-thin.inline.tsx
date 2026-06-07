import React from 'react';

const ChevronDownThinIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M5.143 10.286 12 17.143l6.857-6.857" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
export default ChevronDownThinIcon;
