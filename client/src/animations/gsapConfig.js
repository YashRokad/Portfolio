/**
 * Shared GSAP configuration. Every tween in the app pulls its easing,
 * duration and stagger from here so timing can be tuned globally.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, Flip, Draggable, InertiaPlugin, CustomEase, ScrambleTextPlugin);

/* Two named house eases — a confident editorial ease-out for reveals and a
   snappier one for hover/micro-interactions. */
CustomEase.create('editorial', '0.16, 0.9, 0.24, 1');
CustomEase.create('snap', '0.2, 1, 0.3, 1');
CustomEase.create('curtain', '0.76, 0, 0.24, 1');

export const EASE = {
  editorial: 'editorial',
  snap: 'snap',
  curtain: 'curtain',
  drift: 'sine.inOut',
};

export const DUR = {
  micro: 0.24,
  quick: 0.4,
  standard: 0.7,
  slow: 0.95,
  hero: 1.4,
  section: 1.2,
};

export const STAGGER = {
  tight: 0.035,
  list: 0.07,
  cards: 0.09,
  chars: 0.018,
};

/** Standard scroll-reveal trigger config. */
export const revealTrigger = (el, extra = {}) => ({
  trigger: el,
  start: 'top 82%',
  once: true,
  ...extra,
});

gsap.defaults({ ease: EASE.editorial, duration: DUR.standard });

/* Dev-only handles so the animation layer can be inspected (and leak-tested)
   from the console. Stripped from production builds. */
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

export { gsap, ScrollTrigger, Flip, Draggable, InertiaPlugin };
