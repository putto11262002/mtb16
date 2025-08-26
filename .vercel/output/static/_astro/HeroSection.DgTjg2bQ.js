import { j as e, S as o, c as d } from './utils.Bc832_cf.js';
import './index.0yr9KlQE.js';
import { c as l } from './index.FFCTQ3sn.js';
const c = l(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);
function x({ className: r, variant: t, size: s, asChild: a = !1, ...i }) {
  const n = a ? o : 'button';
  return e.jsx(n, {
    'data-slot': 'button',
    className: d(c({ variant: t, size: s, className: r })),
    ...i,
  });
}
const m = ({ headline: r, subhead: t, imageUrl: s, imageAlt: a, ctaText: i, ctaTarget: n }) =>
  e.jsxs('div', {
    className: 'relative w-full min-h-[500px] overflow-hidden',
    children: [
      e.jsx('div', {
        className: 'absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20',
      }),
      e.jsx('img', {
        src: s,
        alt: a,
        className: 'absolute inset-0 w-full h-full object-cover mix-blend-overlay',
      }),
      e.jsxs('div', {
        className:
          'relative z-10 container mx-auto flex flex-col items-center justify-center min-h-[500px] px-4 text-center',
        children: [
          e.jsx('h1', {
            className:
              'text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
            children: r,
          }),
          e.jsx('p', {
            className: 'text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl text-foreground/90',
            children: t,
          }),
          e.jsx(x, {
            size: 'lg',
            className:
              'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105',
            children: e.jsx('a', { href: n, children: i }),
          }),
        ],
      }),
    ],
  });
export { m as default };
