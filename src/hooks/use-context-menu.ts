import { useEffect, useState } from 'react';

const useContextMenu = (): { clicked: boolean; setClicked: (v: boolean) => void } => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleClick = () => setClicked(false);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return { clicked, setClicked };
};

export default useContextMenu;
