import { u as L, j as t, a as ne, b as _e, c as S } from './utils.Bc832_cf.js';
import { r as s, R as D } from './index.0yr9KlQE.js';
import {
  c as ce,
  P as j,
  u as ue,
  a as le,
  b as E,
  d as $,
  e as A,
  D as Pe,
  f as U,
  g as oe,
  R as Se,
  h as ke,
} from './createLucideIcon.yVY9vzXv.js';
import { c as De } from './index.FFCTQ3sn.js';
import './index.ViApDAiE.js';
var Ae = s.createContext(void 0);
function Le(e) {
  const n = s.useContext(Ae);
  return e || n || 'ltr';
}
function de(e) {
  const n = e + 'CollectionProvider',
    [o, a] = ce(n),
    [i, r] = o(n, { collectionRef: { current: null }, itemMap: new Map() }),
    c = (m) => {
      const { scope: g, children: b } = m,
        y = D.useRef(null),
        d = D.useRef(new Map()).current;
      return t.jsx(i, { scope: g, itemMap: d, collectionRef: y, children: b });
    };
  c.displayName = n;
  const f = e + 'CollectionSlot',
    l = ne(f),
    N = D.forwardRef((m, g) => {
      const { scope: b, children: y } = m,
        d = r(f, b),
        v = L(g, d.collectionRef);
      return t.jsx(l, { ref: v, children: y });
    });
  N.displayName = f;
  const u = e + 'CollectionItemSlot',
    x = 'data-radix-collection-item',
    M = ne(u),
    C = D.forwardRef((m, g) => {
      const { scope: b, children: y, ...d } = m,
        v = D.useRef(null),
        p = L(g, v),
        h = r(u, b);
      return (
        D.useEffect(() => (h.itemMap.set(v, { ref: v, ...d }), () => void h.itemMap.delete(v))),
        t.jsx(M, { [x]: '', ref: p, children: y })
      );
    });
  C.displayName = u;
  function w(m) {
    const g = r(e + 'CollectionConsumer', m);
    return D.useCallback(() => {
      const y = g.collectionRef.current;
      if (!y) return [];
      const d = Array.from(y.querySelectorAll(`[${x}]`));
      return Array.from(g.itemMap.values()).sort(
        (h, T) => d.indexOf(h.ref.current) - d.indexOf(T.ref.current)
      );
    }, [g.collectionRef, g.itemMap]);
  }
  return [{ Provider: c, Slot: N, ItemSlot: C }, w, a];
}
function Oe(e) {
  const n = s.useRef({ value: e, previous: e });
  return s.useMemo(
    () => (
      n.current.value !== e && ((n.current.previous = n.current.value), (n.current.value = e)),
      n.current.previous
    ),
    [e]
  );
}
var Fe = Object.freeze({
    position: 'absolute',
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    wordWrap: 'normal',
  }),
  Ve = 'VisuallyHidden',
  fe = s.forwardRef((e, n) => t.jsx(j.span, { ...e, ref: n, style: { ...Fe, ...e.style } }));
fe.displayName = Ve;
var Ke = fe,
  O = 'NavigationMenu',
  [X, ve, ze] = de(O),
  [H, $e, Ge] = de(O),
  [J, bt] = ce(O, [ze, Ge]),
  [Ue, I] = J(O),
  [He, We] = J(O),
  me = s.forwardRef((e, n) => {
    const {
        __scopeNavigationMenu: o,
        value: a,
        onValueChange: i,
        defaultValue: r,
        delayDuration: c = 200,
        skipDelayDuration: f = 300,
        orientation: l = 'horizontal',
        dir: N,
        ...u
      } = e,
      [x, M] = s.useState(null),
      C = L(n, (R) => M(R)),
      w = Le(N),
      m = s.useRef(0),
      g = s.useRef(0),
      b = s.useRef(0),
      [y, d] = s.useState(!0),
      [v, p] = ue({
        prop: a,
        onChange: (R) => {
          const _ = R !== '',
            G = f > 0;
          (_
            ? (window.clearTimeout(b.current), G && d(!1))
            : (window.clearTimeout(b.current), (b.current = window.setTimeout(() => d(!0), f))),
            i?.(R));
        },
        defaultProp: r ?? '',
        caller: O,
      }),
      h = s.useCallback(() => {
        (window.clearTimeout(g.current), (g.current = window.setTimeout(() => p(''), 150)));
      }, [p]),
      T = s.useCallback(
        (R) => {
          (window.clearTimeout(g.current), p(R));
        },
        [p]
      ),
      k = s.useCallback(
        (R) => {
          v === R
            ? window.clearTimeout(g.current)
            : (m.current = window.setTimeout(() => {
                (window.clearTimeout(g.current), p(R));
              }, c));
        },
        [v, p, c]
      );
    return (
      s.useEffect(
        () => () => {
          (window.clearTimeout(m.current),
            window.clearTimeout(g.current),
            window.clearTimeout(b.current));
        },
        []
      ),
      t.jsx(ge, {
        scope: o,
        isRootMenu: !0,
        value: v,
        dir: w,
        orientation: l,
        rootNavigationMenu: x,
        onTriggerEnter: (R) => {
          (window.clearTimeout(m.current), y ? k(R) : T(R));
        },
        onTriggerLeave: () => {
          (window.clearTimeout(m.current), h());
        },
        onContentEnter: () => window.clearTimeout(g.current),
        onContentLeave: h,
        onItemSelect: (R) => {
          p((_) => (_ === R ? '' : R));
        },
        onItemDismiss: () => p(''),
        children: t.jsx(j.nav, {
          'aria-label': 'Main',
          'data-orientation': l,
          dir: w,
          ...u,
          ref: C,
        }),
      })
    );
  });
me.displayName = O;
var W = 'NavigationMenuSub',
  Be = s.forwardRef((e, n) => {
    const {
        __scopeNavigationMenu: o,
        value: a,
        onValueChange: i,
        defaultValue: r,
        orientation: c = 'horizontal',
        ...f
      } = e,
      l = I(W, o),
      [N, u] = ue({ prop: a, onChange: i, defaultProp: r ?? '', caller: W });
    return t.jsx(ge, {
      scope: o,
      isRootMenu: !1,
      value: N,
      dir: l.dir,
      orientation: c,
      rootNavigationMenu: l.rootNavigationMenu,
      onTriggerEnter: (x) => u(x),
      onItemSelect: (x) => u(x),
      onItemDismiss: () => u(''),
      children: t.jsx(j.div, { 'data-orientation': c, ...f, ref: n }),
    });
  });
Be.displayName = W;
var ge = (e) => {
    const {
        scope: n,
        isRootMenu: o,
        rootNavigationMenu: a,
        dir: i,
        orientation: r,
        children: c,
        value: f,
        onItemSelect: l,
        onItemDismiss: N,
        onTriggerEnter: u,
        onTriggerLeave: x,
        onContentEnter: M,
        onContentLeave: C,
      } = e,
      [w, m] = s.useState(null),
      [g, b] = s.useState(new Map()),
      [y, d] = s.useState(null);
    return t.jsx(Ue, {
      scope: n,
      isRootMenu: o,
      rootNavigationMenu: a,
      value: f,
      previousValue: Oe(f),
      baseId: le(),
      dir: i,
      orientation: r,
      viewport: w,
      onViewportChange: m,
      indicatorTrack: y,
      onIndicatorTrackChange: d,
      onTriggerEnter: A(u),
      onTriggerLeave: A(x),
      onContentEnter: A(M),
      onContentLeave: A(C),
      onItemSelect: A(l),
      onItemDismiss: A(N),
      onViewportContentChange: s.useCallback((v, p) => {
        b((h) => (h.set(v, p), new Map(h)));
      }, []),
      onViewportContentRemove: s.useCallback((v) => {
        b((p) => (p.has(v) ? (p.delete(v), new Map(p)) : p));
      }, []),
      children: t.jsx(X.Provider, {
        scope: n,
        children: t.jsx(He, { scope: n, items: g, children: c }),
      }),
    });
  },
  pe = 'NavigationMenuList',
  xe = s.forwardRef((e, n) => {
    const { __scopeNavigationMenu: o, ...a } = e,
      i = I(pe, o),
      r = t.jsx(j.ul, { 'data-orientation': i.orientation, ...a, ref: n });
    return t.jsx(j.div, {
      style: { position: 'relative' },
      ref: i.onIndicatorTrackChange,
      children: t.jsx(X.Slot, {
        scope: o,
        children: i.isRootMenu ? t.jsx(Ee, { asChild: !0, children: r }) : r,
      }),
    });
  });
xe.displayName = pe;
var he = 'NavigationMenuItem',
  [Ye, we] = J(he),
  Ne = s.forwardRef((e, n) => {
    const { __scopeNavigationMenu: o, value: a, ...i } = e,
      r = le(),
      c = a || r || 'LEGACY_REACT_AUTO_VALUE',
      f = s.useRef(null),
      l = s.useRef(null),
      N = s.useRef(null),
      u = s.useRef(() => {}),
      x = s.useRef(!1),
      M = s.useCallback((w = 'start') => {
        if (f.current) {
          u.current();
          const m = Y(f.current);
          m.length && ee(w === 'start' ? m : m.reverse());
        }
      }, []),
      C = s.useCallback(() => {
        if (f.current) {
          const w = Y(f.current);
          w.length && (u.current = nt(w));
        }
      }, []);
    return t.jsx(Ye, {
      scope: o,
      value: c,
      triggerRef: l,
      contentRef: f,
      focusProxyRef: N,
      wasEscapeCloseRef: x,
      onEntryKeyDown: M,
      onFocusProxyEnter: M,
      onRootContentClose: C,
      onContentFocusOutside: C,
      children: t.jsx(j.li, { ...i, ref: n }),
    });
  });
Ne.displayName = he;
var B = 'NavigationMenuTrigger',
  be = s.forwardRef((e, n) => {
    const { __scopeNavigationMenu: o, disabled: a, ...i } = e,
      r = I(B, e.__scopeNavigationMenu),
      c = we(B, e.__scopeNavigationMenu),
      f = s.useRef(null),
      l = L(f, c.triggerRef, n),
      N = Ie(r.baseId, c.value),
      u = Te(r.baseId, c.value),
      x = s.useRef(!1),
      M = s.useRef(!1),
      C = c.value === r.value;
    return t.jsxs(t.Fragment, {
      children: [
        t.jsx(X.ItemSlot, {
          scope: o,
          value: c.value,
          children: t.jsx(je, {
            asChild: !0,
            children: t.jsx(j.button, {
              id: N,
              disabled: a,
              'data-disabled': a ? '' : void 0,
              'data-state': te(C),
              'aria-expanded': C,
              'aria-controls': u,
              ...i,
              ref: l,
              onPointerEnter: E(e.onPointerEnter, () => {
                ((M.current = !1), (c.wasEscapeCloseRef.current = !1));
              }),
              onPointerMove: E(
                e.onPointerMove,
                z(() => {
                  a ||
                    M.current ||
                    c.wasEscapeCloseRef.current ||
                    x.current ||
                    (r.onTriggerEnter(c.value), (x.current = !0));
                })
              ),
              onPointerLeave: E(
                e.onPointerLeave,
                z(() => {
                  a || (r.onTriggerLeave(), (x.current = !1));
                })
              ),
              onClick: E(e.onClick, () => {
                (r.onItemSelect(c.value), (M.current = C));
              }),
              onKeyDown: E(e.onKeyDown, (w) => {
                const g = {
                  horizontal: 'ArrowDown',
                  vertical: r.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight',
                }[r.orientation];
                C && w.key === g && (c.onEntryKeyDown(), w.preventDefault());
              }),
            }),
          }),
        }),
        C &&
          t.jsxs(t.Fragment, {
            children: [
              t.jsx(Ke, {
                'aria-hidden': !0,
                tabIndex: 0,
                ref: c.focusProxyRef,
                onFocus: (w) => {
                  const m = c.contentRef.current,
                    g = w.relatedTarget,
                    b = g === f.current,
                    y = m?.contains(g);
                  (b || !y) && c.onFocusProxyEnter(b ? 'start' : 'end');
                },
              }),
              r.viewport && t.jsx('span', { 'aria-owns': u }),
            ],
          }),
      ],
    });
  });
be.displayName = B;
var qe = 'NavigationMenuLink',
  re = 'navigationMenu.linkSelect',
  Ce = s.forwardRef((e, n) => {
    const { __scopeNavigationMenu: o, active: a, onSelect: i, ...r } = e;
    return t.jsx(je, {
      asChild: !0,
      children: t.jsx(j.a, {
        'data-active': a ? '' : void 0,
        'aria-current': a ? 'page' : void 0,
        ...r,
        ref: n,
        onClick: E(
          e.onClick,
          (c) => {
            const f = c.target,
              l = new CustomEvent(re, { bubbles: !0, cancelable: !0 });
            if (
              (f.addEventListener(re, (N) => i?.(N), { once: !0 }),
              oe(f, l),
              !l.defaultPrevented && !c.metaKey)
            ) {
              const N = new CustomEvent(K, { bubbles: !0, cancelable: !0 });
              oe(f, N);
            }
          },
          { checkForDefaultPrevented: !1 }
        ),
      }),
    });
  });
Ce.displayName = qe;
var Q = 'NavigationMenuIndicator',
  Xe = s.forwardRef((e, n) => {
    const { forceMount: o, ...a } = e,
      i = I(Q, e.__scopeNavigationMenu),
      r = !!i.value;
    return i.indicatorTrack
      ? Se.createPortal(
          t.jsx($, { present: o || r, children: t.jsx(Je, { ...a, ref: n }) }),
          i.indicatorTrack
        )
      : null;
  });
Xe.displayName = Q;
var Je = s.forwardRef((e, n) => {
    const { __scopeNavigationMenu: o, ...a } = e,
      i = I(Q, o),
      r = ve(o),
      [c, f] = s.useState(null),
      [l, N] = s.useState(null),
      u = i.orientation === 'horizontal',
      x = !!i.value;
    s.useEffect(() => {
      const w = r().find((m) => m.value === i.value)?.ref.current;
      w && f(w);
    }, [r, i.value]);
    const M = () => {
      c && N({ size: u ? c.offsetWidth : c.offsetHeight, offset: u ? c.offsetLeft : c.offsetTop });
    };
    return (
      q(c, M),
      q(i.indicatorTrack, M),
      l
        ? t.jsx(j.div, {
            'aria-hidden': !0,
            'data-state': x ? 'visible' : 'hidden',
            'data-orientation': i.orientation,
            ...a,
            ref: n,
            style: {
              position: 'absolute',
              ...(u
                ? { left: 0, width: l.size + 'px', transform: `translateX(${l.offset}px)` }
                : { top: 0, height: l.size + 'px', transform: `translateY(${l.offset}px)` }),
              ...a.style,
            },
          })
        : null
    );
  }),
  V = 'NavigationMenuContent',
  Me = s.forwardRef((e, n) => {
    const { forceMount: o, ...a } = e,
      i = I(V, e.__scopeNavigationMenu),
      r = we(V, e.__scopeNavigationMenu),
      c = L(r.contentRef, n),
      f = r.value === i.value,
      l = {
        value: r.value,
        triggerRef: r.triggerRef,
        focusProxyRef: r.focusProxyRef,
        wasEscapeCloseRef: r.wasEscapeCloseRef,
        onContentFocusOutside: r.onContentFocusOutside,
        onRootContentClose: r.onRootContentClose,
        ...a,
      };
    return i.viewport
      ? t.jsx(Qe, { forceMount: o, ...l, ref: c })
      : t.jsx($, {
          present: o || f,
          children: t.jsx(Re, {
            'data-state': te(f),
            ...l,
            ref: c,
            onPointerEnter: E(e.onPointerEnter, i.onContentEnter),
            onPointerLeave: E(e.onPointerLeave, z(i.onContentLeave)),
            style: { pointerEvents: !f && i.isRootMenu ? 'none' : void 0, ...l.style },
          }),
        });
  });
Me.displayName = V;
var Qe = s.forwardRef((e, n) => {
    const o = I(V, e.__scopeNavigationMenu),
      { onViewportContentChange: a, onViewportContentRemove: i } = o;
    return (
      U(() => {
        a(e.value, { ref: n, ...e });
      }, [e, n, a]),
      U(() => () => i(e.value), [e.value, i]),
      null
    );
  }),
  K = 'navigationMenu.rootContentDismiss',
  Re = s.forwardRef((e, n) => {
    const {
        __scopeNavigationMenu: o,
        value: a,
        triggerRef: i,
        focusProxyRef: r,
        wasEscapeCloseRef: c,
        onRootContentClose: f,
        onContentFocusOutside: l,
        ...N
      } = e,
      u = I(V, o),
      x = s.useRef(null),
      M = L(x, n),
      C = Ie(u.baseId, a),
      w = Te(u.baseId, a),
      m = ve(o),
      g = s.useRef(null),
      { onItemDismiss: b } = u;
    s.useEffect(() => {
      const d = x.current;
      if (u.isRootMenu && d) {
        const v = () => {
          (b(), f(), d.contains(document.activeElement) && i.current?.focus());
        };
        return (d.addEventListener(K, v), () => d.removeEventListener(K, v));
      }
    }, [u.isRootMenu, e.value, i, b, f]);
    const y = s.useMemo(() => {
      const v = m().map((_) => _.value);
      u.dir === 'rtl' && v.reverse();
      const p = v.indexOf(u.value),
        h = v.indexOf(u.previousValue),
        T = a === u.value,
        k = h === v.indexOf(a);
      if (!T && !k) return g.current;
      const R = (() => {
        if (p !== h) {
          if (T && h !== -1) return p > h ? 'from-end' : 'from-start';
          if (k && p !== -1) return p > h ? 'to-start' : 'to-end';
        }
        return null;
      })();
      return ((g.current = R), R);
    }, [u.previousValue, u.value, u.dir, m, a]);
    return t.jsx(Ee, {
      asChild: !0,
      children: t.jsx(Pe, {
        id: w,
        'aria-labelledby': C,
        'data-motion': y,
        'data-orientation': u.orientation,
        ...N,
        ref: M,
        disableOutsidePointerEvents: !1,
        onDismiss: () => {
          const d = new Event(K, { bubbles: !0, cancelable: !0 });
          x.current?.dispatchEvent(d);
        },
        onFocusOutside: E(e.onFocusOutside, (d) => {
          l();
          const v = d.target;
          u.rootNavigationMenu?.contains(v) && d.preventDefault();
        }),
        onPointerDownOutside: E(e.onPointerDownOutside, (d) => {
          const v = d.target,
            p = m().some((T) => T.ref.current?.contains(v)),
            h = u.isRootMenu && u.viewport?.contains(v);
          (p || h || !u.isRootMenu) && d.preventDefault();
        }),
        onKeyDown: E(e.onKeyDown, (d) => {
          const v = d.altKey || d.ctrlKey || d.metaKey;
          if (d.key === 'Tab' && !v) {
            const h = Y(d.currentTarget),
              T = document.activeElement,
              k = h.findIndex((G) => G === T),
              _ = d.shiftKey ? h.slice(0, k).reverse() : h.slice(k + 1, h.length);
            ee(_) ? d.preventDefault() : r.current?.focus();
          }
        }),
        onEscapeKeyDown: E(e.onEscapeKeyDown, (d) => {
          c.current = !0;
        }),
      }),
    });
  }),
  Z = 'NavigationMenuViewport',
  ye = s.forwardRef((e, n) => {
    const { forceMount: o, ...a } = e,
      r = !!I(Z, e.__scopeNavigationMenu).value;
    return t.jsx($, { present: o || r, children: t.jsx(Ze, { ...a, ref: n }) });
  });
ye.displayName = Z;
var Ze = s.forwardRef((e, n) => {
    const { __scopeNavigationMenu: o, children: a, ...i } = e,
      r = I(Z, o),
      c = L(n, r.onViewportChange),
      f = We(V, e.__scopeNavigationMenu),
      [l, N] = s.useState(null),
      [u, x] = s.useState(null),
      M = l ? l?.width + 'px' : void 0,
      C = l ? l?.height + 'px' : void 0,
      w = !!r.value,
      m = w ? r.value : r.previousValue;
    return (
      q(u, () => {
        u && N({ width: u.offsetWidth, height: u.offsetHeight });
      }),
      t.jsx(j.div, {
        'data-state': te(w),
        'data-orientation': r.orientation,
        ...i,
        ref: c,
        style: {
          pointerEvents: !w && r.isRootMenu ? 'none' : void 0,
          '--radix-navigation-menu-viewport-width': M,
          '--radix-navigation-menu-viewport-height': C,
          ...i.style,
        },
        onPointerEnter: E(e.onPointerEnter, r.onContentEnter),
        onPointerLeave: E(e.onPointerLeave, z(r.onContentLeave)),
        children: Array.from(f.items).map(([b, { ref: y, forceMount: d, ...v }]) => {
          const p = m === b;
          return t.jsx(
            $,
            {
              present: d || p,
              children: t.jsx(Re, {
                ...v,
                ref: _e(y, (h) => {
                  p && h && x(h);
                }),
              }),
            },
            b
          );
        }),
      })
    );
  }),
  et = 'FocusGroup',
  Ee = s.forwardRef((e, n) => {
    const { __scopeNavigationMenu: o, ...a } = e,
      i = I(et, o);
    return t.jsx(H.Provider, {
      scope: o,
      children: t.jsx(H.Slot, { scope: o, children: t.jsx(j.div, { dir: i.dir, ...a, ref: n }) }),
    });
  }),
  ae = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'],
  tt = 'FocusGroupItem',
  je = s.forwardRef((e, n) => {
    const { __scopeNavigationMenu: o, ...a } = e,
      i = $e(o),
      r = I(tt, o);
    return t.jsx(H.ItemSlot, {
      scope: o,
      children: t.jsx(j.button, {
        ...a,
        ref: n,
        onKeyDown: E(e.onKeyDown, (c) => {
          if (['Home', 'End', ...ae].includes(c.key)) {
            let l = i().map((x) => x.ref.current);
            if (
              ([r.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft', 'ArrowUp', 'End'].includes(c.key) &&
                l.reverse(),
              ae.includes(c.key))
            ) {
              const x = l.indexOf(c.currentTarget);
              l = l.slice(x + 1);
            }
            (setTimeout(() => ee(l)), c.preventDefault());
          }
        }),
      }),
    });
  });
function Y(e) {
  const n = [],
    o = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (a) => {
        const i = a.tagName === 'INPUT' && a.type === 'hidden';
        return a.disabled || a.hidden || i
          ? NodeFilter.FILTER_SKIP
          : a.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; o.nextNode(); ) n.push(o.currentNode);
  return n;
}
function ee(e) {
  const n = document.activeElement;
  return e.some((o) => (o === n ? !0 : (o.focus(), document.activeElement !== n)));
}
function nt(e) {
  return (
    e.forEach((n) => {
      ((n.dataset.tabindex = n.getAttribute('tabindex') || ''), n.setAttribute('tabindex', '-1'));
    }),
    () => {
      e.forEach((n) => {
        const o = n.dataset.tabindex;
        n.setAttribute('tabindex', o);
      });
    }
  );
}
function q(e, n) {
  const o = A(n);
  U(() => {
    let a = 0;
    if (e) {
      const i = new ResizeObserver(() => {
        (cancelAnimationFrame(a), (a = window.requestAnimationFrame(o)));
      });
      return (
        i.observe(e),
        () => {
          (window.cancelAnimationFrame(a), i.unobserve(e));
        }
      );
    }
  }, [e, o]);
}
function te(e) {
  return e ? 'open' : 'closed';
}
function Ie(e, n) {
  return `${e}-trigger-${n}`;
}
function Te(e, n) {
  return `${e}-content-${n}`;
}
function z(e) {
  return (n) => (n.pointerType === 'mouse' ? e(n) : void 0);
}
var ot = me,
  rt = xe,
  at = Ne,
  it = be,
  st = Ce,
  ct = Me,
  ut = ye;
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const lt = [['path', { d: 'm6 9 6 6 6-6', key: 'qrunsl' }]],
  dt = ke('chevron-down', lt);
function ft({ className: e, children: n, viewport: o = !0, ...a }) {
  return t.jsxs(ot, {
    'data-slot': 'navigation-menu',
    'data-viewport': o,
    className: S(
      'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
      e
    ),
    ...a,
    children: [n, o && t.jsx(gt, {})],
  });
}
function vt({ className: e, ...n }) {
  return t.jsx(rt, {
    'data-slot': 'navigation-menu-list',
    className: S('group flex flex-1 list-none items-center justify-center gap-1', e),
    ...n,
  });
}
function F({ className: e, ...n }) {
  return t.jsx(at, { 'data-slot': 'navigation-menu-item', className: S('relative', e), ...n });
}
const mt = De(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1'
);
function ie({ className: e, children: n, ...o }) {
  return t.jsxs(it, {
    'data-slot': 'navigation-menu-trigger',
    className: S(mt(), 'group', e),
    ...o,
    children: [
      n,
      ' ',
      t.jsx(dt, {
        className:
          'relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180',
        'aria-hidden': 'true',
      }),
    ],
  });
}
function se({ className: e, ...n }) {
  return t.jsx(ct, {
    'data-slot': 'navigation-menu-content',
    className: S(
      'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto',
      'group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
      e
    ),
    ...n,
  });
}
function gt({ className: e, ...n }) {
  return t.jsx('div', {
    className: S('absolute top-full left-0 isolate z-50 flex justify-center'),
    children: t.jsx(ut, {
      'data-slot': 'navigation-menu-viewport',
      className: S(
        'origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]',
        e
      ),
      ...n,
    }),
  });
}
function P({ className: e, ...n }) {
  return t.jsx(st, {
    'data-slot': 'navigation-menu-link',
    className: S(
      "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
      e
    ),
    ...n,
  });
}
function Ct() {
  return t.jsx(ft, {
    className: 'hidden md:block',
    children: t.jsxs(vt, {
      children: [
        t.jsx(F, {
          children: t.jsx(P, {
            href: '/news',
            className:
              'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-foreground',
            children: 'ข่าวสาร',
          }),
        }),
        t.jsx(F, {
          children: t.jsx(P, {
            href: '/announcements',
            className:
              'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-foreground',
            children: 'ประกาศ',
          }),
        }),
        t.jsxs(F, {
          children: [
            t.jsx(ie, { className: 'bg-background text-foreground', children: 'เกี่ยวกับเรา' }),
            t.jsx(se, {
              children: t.jsxs('ul', {
                className: 'grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]',
                children: [
                  t.jsx('li', {
                    children: t.jsxs(P, {
                      href: '/about-us',
                      className:
                        '[&>div]:text-sm [&>div]:font-medium block p-2 rounded-md hover:bg-accent text-foreground bg-transparent',
                      children: [
                        t.jsx('div', {
                          className: 'text-sm font-medium',
                          children: 'ประวัติหน่วย',
                        }),
                        t.jsx('p', {
                          className: 'text-sm text-muted-foreground',
                          children: 'ข้อมูลเกี่ยวกับภารกิจ ค่านิยม และประวัติศาสตร์ของหน่วย',
                        }),
                      ],
                    }),
                  }),
                  t.jsx('li', {
                    children: t.jsxs(P, {
                      href: '/about-us/leadership',
                      className:
                        '[&>div]:text-sm [&>div]:font-medium block p-2 rounded-md hover:bg-accent text-foreground bg-transparent',
                      children: [
                        t.jsx('div', {
                          className: 'text-sm font-medium',
                          children: 'ผู้บัญชาการและผู้นำ',
                        }),
                        t.jsx('p', {
                          className: 'text-sm text-muted-foreground',
                          children: 'ข้อมูลเกี่ยวกับผู้นำและผู้บัญชาการของหน่วย',
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            }),
          ],
        }),
        t.jsxs(F, {
          children: [
            t.jsx(ie, { className: 'bg-background text-foreground', children: 'ไดเรกทอรี' }),
            t.jsx(se, {
              children: t.jsxs('ul', {
                className: 'grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]',
                children: [
                  t.jsx('li', {
                    children: t.jsxs(P, {
                      href: '/directory/internal',
                      className:
                        '[&>div]:text-sm [&>div]:font-medium block p-2 rounded-md hover:bg-accent text-foreground bg-transparent',
                      children: [
                        t.jsx('div', {
                          className: 'text-sm font-medium',
                          children: 'หน่วยย่อยและแผนกภายใน',
                        }),
                        t.jsx('p', {
                          className: 'text-sm text-muted-foreground',
                          children: 'ไดเรกทอรีของหน่วยย่อยและแผนกภายใน',
                        }),
                      ],
                    }),
                  }),
                  t.jsx('li', {
                    children: t.jsxs(P, {
                      href: '/directory/external',
                      className:
                        '[&>div]:text-sm [&>div]:font-medium block p-2 rounded-md hover:bg-accent text-foreground bg-transparent',
                      children: [
                        t.jsx('div', {
                          className: 'text-sm font-medium',
                          children: 'เครือข่ายภายนอกและความร่วมมือ',
                        }),
                        t.jsx('p', {
                          className: 'text-sm text-muted-foreground',
                          children: 'ไดเรกทอรีของเครือข่ายภายนอกและความร่วมมือ',
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            }),
          ],
        }),
        t.jsx(F, {
          children: t.jsx(P, {
            href: '/document-library',
            className:
              'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-foreground',
            children: 'คลังเอกสาร',
          }),
        }),
        t.jsx(F, {
          children: t.jsx(P, {
            href: '/contact',
            className:
              'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-foreground',
            children: 'ติดต่อ',
          }),
        }),
      ],
    }),
  });
}
export { Ct as default };
