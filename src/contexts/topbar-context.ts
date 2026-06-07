'use client';

import { createContext } from 'react';

export const TopbarContext = createContext<{
  hasTopbar: boolean;
  setHasTopbar: (value: boolean) => void;
}>({
  hasTopbar: false,
  setHasTopbar: () => {},
});
