import { cloneElement } from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';

/** Wraps a single child element so it drifts toward the pointer on hover. */
export default function Magnetic({ children, strength = 0.35, scale = 1 }) {
  const ref = useMagnetic({ strength, scale });
  return cloneElement(children, { ref });
}
