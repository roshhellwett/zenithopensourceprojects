import { useState, useCallback, useRef } from "react";

export function useMouseSpotlight() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<any>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return {
    ref: elementRef,
    x: coords.x,
    y: coords.y,
    isHovered,
    bind: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}
