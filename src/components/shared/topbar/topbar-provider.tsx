'use client';

import { useState } from 'react';

import { TopbarContext } from 'contexts/topbar-context';

export default function TopbarProvider({ children }: { children: React.ReactNode }) {
  const [hasTopbar, setHasTopbar] = useState(false);

  return (
    <TopbarContext.Provider value={{ hasTopbar, setHasTopbar }}>
      {children}
    </TopbarContext.Provider>
  );
}
