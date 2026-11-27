import { useRef, useState } from 'react';

const DISMISS_THRESHOLD_PX = 80;

/**
 * Adds native touch swipe-down dismissal to bottom sheets.
 * Only activates when the sheet is scrolled to the top (scrollTop <= 0)
 * so inner scrolling is never hijacked.
 */
export function useSwipeDownDismiss(
  onClose: () => void,
  scrollContainerRef: React.RefObject<HTMLElement | null>,
) {
  const startY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);

  const onTouchStart = (e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (container && container.scrollTop > 0) return;
    startY.current = e.touches[0]?.clientY ?? null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const currentY = e.touches[0]?.clientY ?? startY.current;
    const delta = currentY - startY.current;
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const onTouchEnd = () => {
    if (startY.current === null) return;
    const finalDrag = dragY;
    startY.current = null;
    setDragY(0);
    if (finalDrag >= DISMISS_THRESHOLD_PX) {
      onClose();
    }
  };

  return {
    dragY,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    style:
      dragY > 0
        ? { transform: `translateY(${dragY}px)`, transition: 'none' }
        : { transition: 'transform 180ms ease-out' },
  };
}
