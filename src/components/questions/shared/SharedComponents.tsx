import styled from "styled-components";
import { motion } from "framer-motion";

// Common animated label used in multiple components
export const AnimatedLabel = styled(motion.span).attrs({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
})`
  display: inline-block;
  min-width: 2ch;
  font-weight: 500;
`;

// Common grip component for drag handles
export const DragGrip = styled.span<{ $size?: number }>`
  align-items: center;
  cursor: grab;
  display: flex;
  height: 100%;
  justify-content: center;
  aspect-ratio: 1 / 1;
  ${({ $size }) =>
    $size &&
    `
    max-width: ${$size}rem;
    min-width: ${$size}rem;
  `}
`;

// Common item wrapper for draggable items
export const DraggableItemWrapper = styled.div<{
  $isDragging?: boolean;
  $background?: string;
}>`
  background-color: ${({ $background }) => $background || "var(--accent-4)"};
  border-radius: max(var(--radius-3), var(--radius-full));
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  width: 100%;
`;
