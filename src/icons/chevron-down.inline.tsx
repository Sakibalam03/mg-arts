import React from 'react';

const ChevronDownIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M3.5 5.75L7 9.25L10.5 5.75" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
export default ChevronDownIcon;
