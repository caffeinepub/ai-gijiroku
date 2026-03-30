// GSAP is loaded via CDN in index.html as window.gsap and window.ScrollTrigger
// This shim re-exports them for TypeScript module imports.

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

const gsap = window.gsap || {
  registerPlugin: () => {},
  fromTo: () => {},
  from: () => {},
  to: () => {},
  set: () => {},
  timeline: () => ({
    fromTo: () => {},
    from: () => {},
    to: () => {},
  }),
  context: (fn: () => void) => {
    try {
      fn();
    } catch (_e) {}
    return { revert: () => {} };
  },
};

export const ScrollTrigger = window.ScrollTrigger || {};
export default gsap;
