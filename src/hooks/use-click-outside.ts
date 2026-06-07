import { useEffect } from 'react';

const events = ['mousedown', 'touchstart'] as const;

type RefLike = { current: Element | null } | null | undefined;

export default function useClickOutside(
  refs: RefLike[],
  onClickOutside: (event: MouseEvent | TouchEvent) => void
): void {
  const isOutside = (element: EventTarget | null) =>
    refs.every((ref) => !ref?.current || !ref.current.contains(element as Node));

  const onClick = (event: MouseEvent | TouchEvent) => {
    if (isOutside(event.target)) {
      onClickOutside(event);
    }
  };

  useEffect(() => {
    events.forEach((event) => document.addEventListener(event, onClick as EventListener));
    return () => {
      events.forEach((event) => document.removeEventListener(event, onClick as EventListener));
    };
  });
}
