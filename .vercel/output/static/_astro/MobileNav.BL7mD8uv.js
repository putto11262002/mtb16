import { u as K, j as l, a as Xe, c as ye } from './utils.Bc832_cf.js';
import { r as i } from './index.0yr9KlQE.js';
import {
  h as be,
  e as ie,
  P as A,
  f as Ye,
  R as $e,
  u as ze,
  c as Ze,
  a as Y,
  b as I,
  d as ne,
  D as qe,
  i as Qe,
} from './createLucideIcon.yVY9vzXv.js';
import './index.ViApDAiE.js';
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Je = [
    ['path', { d: 'M4 12h16', key: '1lakjw' }],
    ['path', { d: 'M4 18h16', key: '19g7jn' }],
    ['path', { d: 'M4 6h16', key: '1o0s65' }],
  ],
  et = be('menu', Je);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const tt = [
    ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
    ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
  ],
  nt = be('x', tt);
var $ = 'focusScope.autoFocusOnMount',
  z = 'focusScope.autoFocusOnUnmount',
  se = { bubbles: !1, cancelable: !0 },
  rt = 'FocusScope',
  xe = i.forwardRef((e, t) => {
    const { loop: n = !1, trapped: r = !1, onMountAutoFocus: o, onUnmountAutoFocus: a, ...u } = e,
      [c, y] = i.useState(null),
      g = ie(o),
      h = ie(a),
      f = i.useRef(null),
      m = K(t, (s) => y(s)),
      p = i.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    (i.useEffect(() => {
      if (r) {
        let s = function (x) {
            if (p.paused || !c) return;
            const E = x.target;
            c.contains(E) ? (f.current = E) : D(f.current, { select: !0 });
          },
          d = function (x) {
            if (p.paused || !c) return;
            const E = x.relatedTarget;
            E !== null && (c.contains(E) || D(f.current, { select: !0 }));
          },
          v = function (x) {
            if (document.activeElement === document.body)
              for (const S of x) S.removedNodes.length > 0 && D(c);
          };
        (document.addEventListener('focusin', s), document.addEventListener('focusout', d));
        const b = new MutationObserver(v);
        return (
          c && b.observe(c, { childList: !0, subtree: !0 }),
          () => {
            (document.removeEventListener('focusin', s),
              document.removeEventListener('focusout', d),
              b.disconnect());
          }
        );
      }
    }, [r, c, p.paused]),
      i.useEffect(() => {
        if (c) {
          ue.add(p);
          const s = document.activeElement;
          if (!c.contains(s)) {
            const v = new CustomEvent($, se);
            (c.addEventListener($, g),
              c.dispatchEvent(v),
              v.defaultPrevented ||
                (ot(lt(Ee(c)), { select: !0 }), document.activeElement === s && D(c)));
          }
          return () => {
            (c.removeEventListener($, g),
              setTimeout(() => {
                const v = new CustomEvent(z, se);
                (c.addEventListener(z, h),
                  c.dispatchEvent(v),
                  v.defaultPrevented || D(s ?? document.body, { select: !0 }),
                  c.removeEventListener(z, h),
                  ue.remove(p));
              }, 0));
          };
        }
      }, [c, g, h, p]));
    const C = i.useCallback(
      (s) => {
        if ((!n && !r) || p.paused) return;
        const d = s.key === 'Tab' && !s.altKey && !s.ctrlKey && !s.metaKey,
          v = document.activeElement;
        if (d && v) {
          const b = s.currentTarget,
            [x, E] = at(b);
          x && E
            ? !s.shiftKey && v === E
              ? (s.preventDefault(), n && D(x, { select: !0 }))
              : s.shiftKey && v === x && (s.preventDefault(), n && D(E, { select: !0 }))
            : v === b && s.preventDefault();
        }
      },
      [n, r, p.paused]
    );
    return l.jsx(A.div, { tabIndex: -1, ...u, ref: m, onKeyDown: C });
  });
xe.displayName = rt;
function ot(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e) if ((D(r, { select: t }), document.activeElement !== n)) return;
}
function at(e) {
  const t = Ee(e),
    n = le(t, e),
    r = le(t.reverse(), e);
  return [n, r];
}
function Ee(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (r) => {
        const o = r.tagName === 'INPUT' && r.type === 'hidden';
        return r.disabled || r.hidden || o
          ? NodeFilter.FILTER_SKIP
          : r.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function le(e, t) {
  for (const n of e) if (!ct(n, { upTo: t })) return n;
}
function ct(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === 'hidden') return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === 'none') return !0;
    e = e.parentElement;
  }
  return !1;
}
function it(e) {
  return e instanceof HTMLInputElement && 'select' in e;
}
function D(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    (e.focus({ preventScroll: !0 }), e !== n && it(e) && t && e.select());
  }
}
var ue = st();
function st() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      (t !== n && n?.pause(), (e = de(e, t)), e.unshift(t));
    },
    remove(t) {
      ((e = de(e, t)), e[0]?.resume());
    },
  };
}
function de(e, t) {
  const n = [...e],
    r = n.indexOf(t);
  return (r !== -1 && n.splice(r, 1), n);
}
function lt(e) {
  return e.filter((t) => t.tagName !== 'A');
}
var ut = 'Portal',
  Se = i.forwardRef((e, t) => {
    const { container: n, ...r } = e,
      [o, a] = i.useState(!1);
    Ye(() => a(!0), []);
    const u = n || (o && globalThis?.document?.body);
    return u ? $e.createPortal(l.jsx(A.div, { ...r, ref: t }), u) : null;
  });
Se.displayName = ut;
var Z = 0;
function dt() {
  i.useEffect(() => {
    const e = document.querySelectorAll('[data-radix-focus-guard]');
    return (
      document.body.insertAdjacentElement('afterbegin', e[0] ?? fe()),
      document.body.insertAdjacentElement('beforeend', e[1] ?? fe()),
      Z++,
      () => {
        (Z === 1 &&
          document.querySelectorAll('[data-radix-focus-guard]').forEach((t) => t.remove()),
          Z--);
      }
    );
  }, []);
}
function fe() {
  const e = document.createElement('span');
  return (
    e.setAttribute('data-radix-focus-guard', ''),
    (e.tabIndex = 0),
    (e.style.outline = 'none'),
    (e.style.opacity = '0'),
    (e.style.position = 'fixed'),
    (e.style.pointerEvents = 'none'),
    e
  );
}
var N = function () {
  return (
    (N =
      Object.assign ||
      function (t) {
        for (var n, r = 1, o = arguments.length; r < o; r++) {
          n = arguments[r];
          for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (t[a] = n[a]);
        }
        return t;
      }),
    N.apply(this, arguments)
  );
};
function Ce(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
        (n[r[o]] = e[r[o]]);
  return n;
}
function ft(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, o = t.length, a; r < o; r++)
      (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), (a[r] = t[r]));
  return e.concat(a || Array.prototype.slice.call(t));
}
var U = 'right-scroll-bar-position',
  G = 'width-before-scroll-bar',
  vt = 'with-scroll-bars-hidden',
  ht = '--removed-body-scroll-bar-size';
function q(e, t) {
  return (typeof e == 'function' ? e(t) : e && (e.current = t), e);
}
function mt(e, t) {
  var n = i.useState(function () {
    return {
      value: e,
      callback: t,
      facade: {
        get current() {
          return n.value;
        },
        set current(r) {
          var o = n.value;
          o !== r && ((n.value = r), n.callback(r, o));
        },
      },
    };
  })[0];
  return ((n.callback = t), n.facade);
}
var gt = typeof window < 'u' ? i.useLayoutEffect : i.useEffect,
  ve = new WeakMap();
function pt(e, t) {
  var n = mt(null, function (r) {
    return e.forEach(function (o) {
      return q(o, r);
    });
  });
  return (
    gt(
      function () {
        var r = ve.get(n);
        if (r) {
          var o = new Set(r),
            a = new Set(e),
            u = n.current;
          (o.forEach(function (c) {
            a.has(c) || q(c, null);
          }),
            a.forEach(function (c) {
              o.has(c) || q(c, u);
            }));
        }
        ve.set(n, e);
      },
      [e]
    ),
    n
  );
}
function yt(e) {
  return e;
}
function bt(e, t) {
  t === void 0 && (t = yt);
  var n = [],
    r = !1,
    o = {
      read: function () {
        if (r)
          throw new Error(
            'Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.'
          );
        return n.length ? n[n.length - 1] : e;
      },
      useMedium: function (a) {
        var u = t(a, r);
        return (
          n.push(u),
          function () {
            n = n.filter(function (c) {
              return c !== u;
            });
          }
        );
      },
      assignSyncMedium: function (a) {
        for (r = !0; n.length; ) {
          var u = n;
          ((n = []), u.forEach(a));
        }
        n = {
          push: function (c) {
            return a(c);
          },
          filter: function () {
            return n;
          },
        };
      },
      assignMedium: function (a) {
        r = !0;
        var u = [];
        if (n.length) {
          var c = n;
          ((n = []), c.forEach(a), (u = n));
        }
        var y = function () {
            var h = u;
            ((u = []), h.forEach(a));
          },
          g = function () {
            return Promise.resolve().then(y);
          };
        (g(),
          (n = {
            push: function (h) {
              (u.push(h), g());
            },
            filter: function (h) {
              return ((u = u.filter(h)), n);
            },
          }));
      },
    };
  return o;
}
function xt(e) {
  e === void 0 && (e = {});
  var t = bt(null);
  return ((t.options = N({ async: !0, ssr: !1 }, e)), t);
}
var we = function (e) {
  var t = e.sideCar,
    n = Ce(e, ['sideCar']);
  if (!t) throw new Error('Sidecar: please provide `sideCar` property to import the right car');
  var r = t.read();
  if (!r) throw new Error('Sidecar medium not found');
  return i.createElement(r, N({}, n));
};
we.isSideCarExport = !0;
function Et(e, t) {
  return (e.useMedium(t), we);
}
var Ne = xt(),
  Q = function () {},
  V = i.forwardRef(function (e, t) {
    var n = i.useRef(null),
      r = i.useState({ onScrollCapture: Q, onWheelCapture: Q, onTouchMoveCapture: Q }),
      o = r[0],
      a = r[1],
      u = e.forwardProps,
      c = e.children,
      y = e.className,
      g = e.removeScrollBar,
      h = e.enabled,
      f = e.shards,
      m = e.sideCar,
      p = e.noRelative,
      C = e.noIsolation,
      s = e.inert,
      d = e.allowPinchZoom,
      v = e.as,
      b = v === void 0 ? 'div' : v,
      x = e.gapMode,
      E = Ce(e, [
        'forwardProps',
        'children',
        'className',
        'removeScrollBar',
        'enabled',
        'shards',
        'sideCar',
        'noRelative',
        'noIsolation',
        'inert',
        'allowPinchZoom',
        'as',
        'gapMode',
      ]),
      S = m,
      T = pt([n, t]),
      R = N(N({}, E), o);
    return i.createElement(
      i.Fragment,
      null,
      h &&
        i.createElement(S, {
          sideCar: Ne,
          removeScrollBar: g,
          shards: f,
          noRelative: p,
          noIsolation: C,
          inert: s,
          setCallbacks: a,
          allowPinchZoom: !!d,
          lockRef: n,
          gapMode: x,
        }),
      u
        ? i.cloneElement(i.Children.only(c), N(N({}, R), { ref: T }))
        : i.createElement(b, N({}, R, { className: y, ref: T }), c)
    );
  });
V.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
V.classNames = { fullWidth: G, zeroRight: U };
var St = function () {
  if (typeof __webpack_nonce__ < 'u') return __webpack_nonce__;
};
function Ct() {
  if (!document) return null;
  var e = document.createElement('style');
  e.type = 'text/css';
  var t = St();
  return (t && e.setAttribute('nonce', t), e);
}
function wt(e, t) {
  e.styleSheet ? (e.styleSheet.cssText = t) : e.appendChild(document.createTextNode(t));
}
function Nt(e) {
  var t = document.head || document.getElementsByTagName('head')[0];
  t.appendChild(e);
}
var Rt = function () {
    var e = 0,
      t = null;
    return {
      add: function (n) {
        (e == 0 && (t = Ct()) && (wt(t, n), Nt(t)), e++);
      },
      remove: function () {
        (e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null)));
      },
    };
  },
  Dt = function () {
    var e = Rt();
    return function (t, n) {
      i.useEffect(
        function () {
          return (
            e.add(t),
            function () {
              e.remove();
            }
          );
        },
        [t && n]
      );
    };
  },
  Re = function () {
    var e = Dt(),
      t = function (n) {
        var r = n.styles,
          o = n.dynamic;
        return (e(r, o), null);
      };
    return t;
  },
  Pt = { left: 0, top: 0, right: 0, gap: 0 },
  J = function (e) {
    return parseInt(e || '', 10) || 0;
  },
  At = function (e) {
    var t = window.getComputedStyle(document.body),
      n = t[e === 'padding' ? 'paddingLeft' : 'marginLeft'],
      r = t[e === 'padding' ? 'paddingTop' : 'marginTop'],
      o = t[e === 'padding' ? 'paddingRight' : 'marginRight'];
    return [J(n), J(r), J(o)];
  },
  Tt = function (e) {
    if ((e === void 0 && (e = 'margin'), typeof window > 'u')) return Pt;
    var t = At(e),
      n = document.documentElement.clientWidth,
      r = window.innerWidth;
    return { left: t[0], top: t[1], right: t[2], gap: Math.max(0, r - n + t[2] - t[0]) };
  },
  jt = Re(),
  k = 'data-scroll-locked',
  Mt = function (e, t, n, r) {
    var o = e.left,
      a = e.top,
      u = e.right,
      c = e.gap;
    return (
      n === void 0 && (n = 'margin'),
      `
  .`
        .concat(
          vt,
          ` {
   overflow: hidden `
        )
        .concat(
          r,
          `;
   padding-right: `
        )
        .concat(c, 'px ')
        .concat(
          r,
          `;
  }
  body[`
        )
        .concat(
          k,
          `] {
    overflow: hidden `
        )
        .concat(
          r,
          `;
    overscroll-behavior: contain;
    `
        )
        .concat(
          [
            t && 'position: relative '.concat(r, ';'),
            n === 'margin' &&
              `
    padding-left: `
                .concat(
                  o,
                  `px;
    padding-top: `
                )
                .concat(
                  a,
                  `px;
    padding-right: `
                )
                .concat(
                  u,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `
                )
                .concat(c, 'px ')
                .concat(
                  r,
                  `;
    `
                ),
            n === 'padding' && 'padding-right: '.concat(c, 'px ').concat(r, ';'),
          ]
            .filter(Boolean)
            .join(''),
          `
  }
  
  .`
        )
        .concat(
          U,
          ` {
    right: `
        )
        .concat(c, 'px ')
        .concat(
          r,
          `;
  }
  
  .`
        )
        .concat(
          G,
          ` {
    margin-right: `
        )
        .concat(c, 'px ')
        .concat(
          r,
          `;
  }
  
  .`
        )
        .concat(U, ' .')
        .concat(
          U,
          ` {
    right: 0 `
        )
        .concat(
          r,
          `;
  }
  
  .`
        )
        .concat(G, ' .')
        .concat(
          G,
          ` {
    margin-right: 0 `
        )
        .concat(
          r,
          `;
  }
  
  body[`
        )
        .concat(
          k,
          `] {
    `
        )
        .concat(ht, ': ')
        .concat(
          c,
          `px;
  }
`
        )
    );
  },
  he = function () {
    var e = parseInt(document.body.getAttribute(k) || '0', 10);
    return isFinite(e) ? e : 0;
  },
  Ot = function () {
    i.useEffect(function () {
      return (
        document.body.setAttribute(k, (he() + 1).toString()),
        function () {
          var e = he() - 1;
          e <= 0 ? document.body.removeAttribute(k) : document.body.setAttribute(k, e.toString());
        }
      );
    }, []);
  },
  kt = function (e) {
    var t = e.noRelative,
      n = e.noImportant,
      r = e.gapMode,
      o = r === void 0 ? 'margin' : r;
    Ot();
    var a = i.useMemo(
      function () {
        return Tt(o);
      },
      [o]
    );
    return i.createElement(jt, { styles: Mt(a, !t, o, n ? '' : '!important') });
  },
  te = !1;
if (typeof window < 'u')
  try {
    var F = Object.defineProperty({}, 'passive', {
      get: function () {
        return ((te = !0), !0);
      },
    });
    (window.addEventListener('test', F, F), window.removeEventListener('test', F, F));
  } catch {
    te = !1;
  }
var j = te ? { passive: !1 } : !1,
  It = function (e) {
    return e.tagName === 'TEXTAREA';
  },
  De = function (e, t) {
    if (!(e instanceof Element)) return !1;
    var n = window.getComputedStyle(e);
    return n[t] !== 'hidden' && !(n.overflowY === n.overflowX && !It(e) && n[t] === 'visible');
  },
  _t = function (e) {
    return De(e, 'overflowY');
  },
  Ft = function (e) {
    return De(e, 'overflowX');
  },
  me = function (e, t) {
    var n = t.ownerDocument,
      r = t;
    do {
      typeof ShadowRoot < 'u' && r instanceof ShadowRoot && (r = r.host);
      var o = Pe(e, r);
      if (o) {
        var a = Ae(e, r),
          u = a[1],
          c = a[2];
        if (u > c) return !0;
      }
      r = r.parentNode;
    } while (r && r !== n.body);
    return !1;
  },
  Lt = function (e) {
    var t = e.scrollTop,
      n = e.scrollHeight,
      r = e.clientHeight;
    return [t, n, r];
  },
  Wt = function (e) {
    var t = e.scrollLeft,
      n = e.scrollWidth,
      r = e.clientWidth;
    return [t, n, r];
  },
  Pe = function (e, t) {
    return e === 'v' ? _t(t) : Ft(t);
  },
  Ae = function (e, t) {
    return e === 'v' ? Lt(t) : Wt(t);
  },
  Bt = function (e, t) {
    return e === 'h' && t === 'rtl' ? -1 : 1;
  },
  Ut = function (e, t, n, r, o) {
    var a = Bt(e, window.getComputedStyle(t).direction),
      u = a * r,
      c = n.target,
      y = t.contains(c),
      g = !1,
      h = u > 0,
      f = 0,
      m = 0;
    do {
      if (!c) break;
      var p = Ae(e, c),
        C = p[0],
        s = p[1],
        d = p[2],
        v = s - d - a * C;
      (C || v) && Pe(e, c) && ((f += v), (m += C));
      var b = c.parentNode;
      c = b && b.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? b.host : b;
    } while ((!y && c !== document.body) || (y && (t.contains(c) || t === c)));
    return (((h && Math.abs(f) < 1) || (!h && Math.abs(m) < 1)) && (g = !0), g);
  },
  L = function (e) {
    return 'changedTouches' in e
      ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      : [0, 0];
  },
  ge = function (e) {
    return [e.deltaX, e.deltaY];
  },
  pe = function (e) {
    return e && 'current' in e ? e.current : e;
  },
  Gt = function (e, t) {
    return e[0] === t[0] && e[1] === t[1];
  },
  Ht = function (e) {
    return `
  .block-interactivity-`
      .concat(
        e,
        ` {pointer-events: none;}
  .allow-interactivity-`
      )
      .concat(
        e,
        ` {pointer-events: all;}
`
      );
  },
  Kt = 0,
  M = [];
function Vt(e) {
  var t = i.useRef([]),
    n = i.useRef([0, 0]),
    r = i.useRef(),
    o = i.useState(Kt++)[0],
    a = i.useState(Re)[0],
    u = i.useRef(e);
  (i.useEffect(
    function () {
      u.current = e;
    },
    [e]
  ),
    i.useEffect(
      function () {
        if (e.inert) {
          document.body.classList.add('block-interactivity-'.concat(o));
          var s = ft([e.lockRef.current], (e.shards || []).map(pe), !0).filter(Boolean);
          return (
            s.forEach(function (d) {
              return d.classList.add('allow-interactivity-'.concat(o));
            }),
            function () {
              (document.body.classList.remove('block-interactivity-'.concat(o)),
                s.forEach(function (d) {
                  return d.classList.remove('allow-interactivity-'.concat(o));
                }));
            }
          );
        }
      },
      [e.inert, e.lockRef.current, e.shards]
    ));
  var c = i.useCallback(function (s, d) {
      if (('touches' in s && s.touches.length === 2) || (s.type === 'wheel' && s.ctrlKey))
        return !u.current.allowPinchZoom;
      var v = L(s),
        b = n.current,
        x = 'deltaX' in s ? s.deltaX : b[0] - v[0],
        E = 'deltaY' in s ? s.deltaY : b[1] - v[1],
        S,
        T = s.target,
        R = Math.abs(x) > Math.abs(E) ? 'h' : 'v';
      if ('touches' in s && R === 'h' && T.type === 'range') return !1;
      var _ = me(R, T);
      if (!_) return !0;
      if ((_ ? (S = R) : ((S = R === 'v' ? 'h' : 'v'), (_ = me(R, T))), !_)) return !1;
      if ((!r.current && 'changedTouches' in s && (x || E) && (r.current = S), !S)) return !0;
      var ce = r.current || S;
      return Ut(ce, d, s, ce === 'h' ? x : E);
    }, []),
    y = i.useCallback(function (s) {
      var d = s;
      if (!(!M.length || M[M.length - 1] !== a)) {
        var v = 'deltaY' in d ? ge(d) : L(d),
          b = t.current.filter(function (S) {
            return (
              S.name === d.type &&
              (S.target === d.target || d.target === S.shadowParent) &&
              Gt(S.delta, v)
            );
          })[0];
        if (b && b.should) {
          d.cancelable && d.preventDefault();
          return;
        }
        if (!b) {
          var x = (u.current.shards || [])
              .map(pe)
              .filter(Boolean)
              .filter(function (S) {
                return S.contains(d.target);
              }),
            E = x.length > 0 ? c(d, x[0]) : !u.current.noIsolation;
          E && d.cancelable && d.preventDefault();
        }
      }
    }, []),
    g = i.useCallback(function (s, d, v, b) {
      var x = { name: s, delta: d, target: v, should: b, shadowParent: Xt(v) };
      (t.current.push(x),
        setTimeout(function () {
          t.current = t.current.filter(function (E) {
            return E !== x;
          });
        }, 1));
    }, []),
    h = i.useCallback(function (s) {
      ((n.current = L(s)), (r.current = void 0));
    }, []),
    f = i.useCallback(function (s) {
      g(s.type, ge(s), s.target, c(s, e.lockRef.current));
    }, []),
    m = i.useCallback(function (s) {
      g(s.type, L(s), s.target, c(s, e.lockRef.current));
    }, []);
  i.useEffect(function () {
    return (
      M.push(a),
      e.setCallbacks({ onScrollCapture: f, onWheelCapture: f, onTouchMoveCapture: m }),
      document.addEventListener('wheel', y, j),
      document.addEventListener('touchmove', y, j),
      document.addEventListener('touchstart', h, j),
      function () {
        ((M = M.filter(function (s) {
          return s !== a;
        })),
          document.removeEventListener('wheel', y, j),
          document.removeEventListener('touchmove', y, j),
          document.removeEventListener('touchstart', h, j));
      }
    );
  }, []);
  var p = e.removeScrollBar,
    C = e.inert;
  return i.createElement(
    i.Fragment,
    null,
    C ? i.createElement(a, { styles: Ht(o) }) : null,
    p ? i.createElement(kt, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function Xt(e) {
  for (var t = null; e !== null; )
    (e instanceof ShadowRoot && ((t = e.host), (e = e.host)), (e = e.parentNode));
  return t;
}
const Yt = Et(Ne, Vt);
var Te = i.forwardRef(function (e, t) {
  return i.createElement(V, N({}, e, { ref: t, sideCar: Yt }));
});
Te.classNames = V.classNames;
var $t = function (e) {
    if (typeof document > 'u') return null;
    var t = Array.isArray(e) ? e[0] : e;
    return t.ownerDocument.body;
  },
  O = new WeakMap(),
  W = new WeakMap(),
  B = {},
  ee = 0,
  je = function (e) {
    return e && (e.host || je(e.parentNode));
  },
  zt = function (e, t) {
    return t
      .map(function (n) {
        if (e.contains(n)) return n;
        var r = je(n);
        return r && e.contains(r)
          ? r
          : (console.error('aria-hidden', n, 'in not contained inside', e, '. Doing nothing'),
            null);
      })
      .filter(function (n) {
        return !!n;
      });
  },
  Zt = function (e, t, n, r) {
    var o = zt(t, Array.isArray(e) ? e : [e]);
    B[n] || (B[n] = new WeakMap());
    var a = B[n],
      u = [],
      c = new Set(),
      y = new Set(o),
      g = function (f) {
        !f || c.has(f) || (c.add(f), g(f.parentNode));
      };
    o.forEach(g);
    var h = function (f) {
      !f ||
        y.has(f) ||
        Array.prototype.forEach.call(f.children, function (m) {
          if (c.has(m)) h(m);
          else
            try {
              var p = m.getAttribute(r),
                C = p !== null && p !== 'false',
                s = (O.get(m) || 0) + 1,
                d = (a.get(m) || 0) + 1;
              (O.set(m, s),
                a.set(m, d),
                u.push(m),
                s === 1 && C && W.set(m, !0),
                d === 1 && m.setAttribute(n, 'true'),
                C || m.setAttribute(r, 'true'));
            } catch (v) {
              console.error('aria-hidden: cannot operate on ', m, v);
            }
        });
    };
    return (
      h(t),
      c.clear(),
      ee++,
      function () {
        (u.forEach(function (f) {
          var m = O.get(f) - 1,
            p = a.get(f) - 1;
          (O.set(f, m),
            a.set(f, p),
            m || (W.has(f) || f.removeAttribute(r), W.delete(f)),
            p || f.removeAttribute(n));
        }),
          ee--,
          ee || ((O = new WeakMap()), (O = new WeakMap()), (W = new WeakMap()), (B = {})));
      }
    );
  },
  qt = function (e, t, n) {
    n === void 0 && (n = 'data-aria-hidden');
    var r = Array.from(Array.isArray(e) ? e : [e]),
      o = $t(e);
    return o
      ? (r.push.apply(r, Array.from(o.querySelectorAll('[aria-live], script'))),
        Zt(r, o, n, 'aria-hidden'))
      : function () {
          return null;
        };
  },
  X = 'Dialog',
  [Me, Nn] = Ze(X),
  [Qt, w] = Me(X),
  Oe = (e) => {
    const {
        __scopeDialog: t,
        children: n,
        open: r,
        defaultOpen: o,
        onOpenChange: a,
        modal: u = !0,
      } = e,
      c = i.useRef(null),
      y = i.useRef(null),
      [g, h] = ze({ prop: r, defaultProp: o ?? !1, onChange: a, caller: X });
    return l.jsx(Qt, {
      scope: t,
      triggerRef: c,
      contentRef: y,
      contentId: Y(),
      titleId: Y(),
      descriptionId: Y(),
      open: g,
      onOpenChange: h,
      onOpenToggle: i.useCallback(() => h((f) => !f), [h]),
      modal: u,
      children: n,
    });
  };
Oe.displayName = X;
var ke = 'DialogTrigger',
  Ie = i.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = w(ke, n),
      a = K(t, o.triggerRef);
    return l.jsx(A.button, {
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': o.open,
      'aria-controls': o.contentId,
      'data-state': ae(o.open),
      ...r,
      ref: a,
      onClick: I(e.onClick, o.onOpenToggle),
    });
  });
Ie.displayName = ke;
var re = 'DialogPortal',
  [Jt, _e] = Me(re, { forceMount: void 0 }),
  Fe = (e) => {
    const { __scopeDialog: t, forceMount: n, children: r, container: o } = e,
      a = w(re, t);
    return l.jsx(Jt, {
      scope: t,
      forceMount: n,
      children: i.Children.map(r, (u) =>
        l.jsx(ne, {
          present: n || a.open,
          children: l.jsx(Se, { asChild: !0, container: o, children: u }),
        })
      ),
    });
  };
Fe.displayName = re;
var H = 'DialogOverlay',
  Le = i.forwardRef((e, t) => {
    const n = _e(H, e.__scopeDialog),
      { forceMount: r = n.forceMount, ...o } = e,
      a = w(H, e.__scopeDialog);
    return a.modal
      ? l.jsx(ne, { present: r || a.open, children: l.jsx(tn, { ...o, ref: t }) })
      : null;
  });
Le.displayName = H;
var en = Xe('DialogOverlay.RemoveScroll'),
  tn = i.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = w(H, n);
    return l.jsx(Te, {
      as: en,
      allowPinchZoom: !0,
      shards: [o.contentRef],
      children: l.jsx(A.div, {
        'data-state': ae(o.open),
        ...r,
        ref: t,
        style: { pointerEvents: 'auto', ...r.style },
      }),
    });
  }),
  P = 'DialogContent',
  We = i.forwardRef((e, t) => {
    const n = _e(P, e.__scopeDialog),
      { forceMount: r = n.forceMount, ...o } = e,
      a = w(P, e.__scopeDialog);
    return l.jsx(ne, {
      present: r || a.open,
      children: a.modal ? l.jsx(nn, { ...o, ref: t }) : l.jsx(rn, { ...o, ref: t }),
    });
  });
We.displayName = P;
var nn = i.forwardRef((e, t) => {
    const n = w(P, e.__scopeDialog),
      r = i.useRef(null),
      o = K(t, n.contentRef, r);
    return (
      i.useEffect(() => {
        const a = r.current;
        if (a) return qt(a);
      }, []),
      l.jsx(Be, {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: I(e.onCloseAutoFocus, (a) => {
          (a.preventDefault(), n.triggerRef.current?.focus());
        }),
        onPointerDownOutside: I(e.onPointerDownOutside, (a) => {
          const u = a.detail.originalEvent,
            c = u.button === 0 && u.ctrlKey === !0;
          (u.button === 2 || c) && a.preventDefault();
        }),
        onFocusOutside: I(e.onFocusOutside, (a) => a.preventDefault()),
      })
    );
  }),
  rn = i.forwardRef((e, t) => {
    const n = w(P, e.__scopeDialog),
      r = i.useRef(!1),
      o = i.useRef(!1);
    return l.jsx(Be, {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      onCloseAutoFocus: (a) => {
        (e.onCloseAutoFocus?.(a),
          a.defaultPrevented || (r.current || n.triggerRef.current?.focus(), a.preventDefault()),
          (r.current = !1),
          (o.current = !1));
      },
      onInteractOutside: (a) => {
        (e.onInteractOutside?.(a),
          a.defaultPrevented ||
            ((r.current = !0), a.detail.originalEvent.type === 'pointerdown' && (o.current = !0)));
        const u = a.target;
        (n.triggerRef.current?.contains(u) && a.preventDefault(),
          a.detail.originalEvent.type === 'focusin' && o.current && a.preventDefault());
      },
    });
  }),
  Be = i.forwardRef((e, t) => {
    const { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: o, onCloseAutoFocus: a, ...u } = e,
      c = w(P, n),
      y = i.useRef(null),
      g = K(t, y);
    return (
      dt(),
      l.jsxs(l.Fragment, {
        children: [
          l.jsx(xe, {
            asChild: !0,
            loop: !0,
            trapped: r,
            onMountAutoFocus: o,
            onUnmountAutoFocus: a,
            children: l.jsx(qe, {
              role: 'dialog',
              id: c.contentId,
              'aria-describedby': c.descriptionId,
              'aria-labelledby': c.titleId,
              'data-state': ae(c.open),
              ...u,
              ref: g,
              onDismiss: () => c.onOpenChange(!1),
            }),
          }),
          l.jsxs(l.Fragment, {
            children: [
              l.jsx(cn, { titleId: c.titleId }),
              l.jsx(ln, { contentRef: y, descriptionId: c.descriptionId }),
            ],
          }),
        ],
      })
    );
  }),
  oe = 'DialogTitle',
  on = i.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = w(oe, n);
    return l.jsx(A.h2, { id: o.titleId, ...r, ref: t });
  });
on.displayName = oe;
var Ue = 'DialogDescription',
  an = i.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = w(Ue, n);
    return l.jsx(A.p, { id: o.descriptionId, ...r, ref: t });
  });
an.displayName = Ue;
var Ge = 'DialogClose',
  He = i.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = w(Ge, n);
    return l.jsx(A.button, {
      type: 'button',
      ...r,
      ref: t,
      onClick: I(e.onClick, () => o.onOpenChange(!1)),
    });
  });
He.displayName = Ge;
function ae(e) {
  return e ? 'open' : 'closed';
}
var Ke = 'DialogTitleWarning',
  [Rn, Ve] = Qe(Ke, { contentName: P, titleName: oe, docsSlug: 'dialog' }),
  cn = ({ titleId: e }) => {
    const t = Ve(Ke),
      n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
    return (
      i.useEffect(() => {
        e && (document.getElementById(e) || console.error(n));
      }, [n, e]),
      null
    );
  },
  sn = 'DialogDescriptionWarning',
  ln = ({ contentRef: e, descriptionId: t }) => {
    const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Ve(sn).contentName}}.`;
    return (
      i.useEffect(() => {
        const o = e.current?.getAttribute('aria-describedby');
        t && o && (document.getElementById(t) || console.warn(r));
      }, [r, e, t]),
      null
    );
  },
  un = Oe,
  dn = Ie,
  fn = Fe,
  vn = Le,
  hn = We,
  mn = He;
function gn({ ...e }) {
  return l.jsx(un, { 'data-slot': 'sheet', ...e });
}
function pn({ ...e }) {
  return l.jsx(dn, { 'data-slot': 'sheet-trigger', ...e });
}
function yn({ ...e }) {
  return l.jsx(fn, { 'data-slot': 'sheet-portal', ...e });
}
function bn({ className: e, ...t }) {
  return l.jsx(vn, {
    'data-slot': 'sheet-overlay',
    className: ye(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
      e
    ),
    ...t,
  });
}
function xn({ className: e, children: t, side: n = 'right', ...r }) {
  return l.jsxs(yn, {
    children: [
      l.jsx(bn, {}),
      l.jsxs(hn, {
        'data-slot': 'sheet-content',
        className: ye(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
          n === 'right' &&
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
          n === 'left' &&
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
          n === 'top' &&
            'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
          n === 'bottom' &&
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
          e
        ),
        ...r,
        children: [
          t,
          l.jsxs(mn, {
            className:
              'ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none',
            children: [
              l.jsx(nt, { className: 'size-4' }),
              l.jsx('span', { className: 'sr-only', children: 'Close' }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Dn() {
  return l.jsxs(gn, {
    children: [
      l.jsx(pn, {
        asChild: !0,
        children: l.jsxs('button', {
          className: 'md:hidden text-foreground',
          children: [
            l.jsx(et, { className: 'h-6 w-6' }),
            l.jsx('span', { className: 'sr-only', children: 'เปิดเมนู' }),
          ],
        }),
      }),
      l.jsx(xn, {
        side: 'right',
        className: 'w-[300px] sm:w-[400px] bg-background',
        children: l.jsxs('div', {
          className: 'flex flex-col space-y-4 py-4',
          children: [
            l.jsx('a', {
              href: '/',
              className: 'text-2xl font-bold text-foreground',
              children: 'MBT 16',
            }),
            l.jsxs('nav', {
              className: 'flex flex-col space-y-4 mt-8',
              children: [
                l.jsx('a', {
                  href: '/news',
                  className:
                    'text-foreground hover:text-accent-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors bg-transparent',
                  children: 'ข่าวสาร',
                }),
                l.jsx('a', {
                  href: '/announcements',
                  className:
                    'text-foreground hover:text-accent-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors bg-transparent',
                  children: 'ประกาศ',
                }),
                l.jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    l.jsx('div', {
                      className: 'text-foreground font-medium py-2 px-4',
                      children: 'เกี่ยวกับเรา',
                    }),
                    l.jsxs('div', {
                      className: 'flex flex-col pl-4 space-y-2',
                      children: [
                        l.jsx('a', {
                          href: '/about-us',
                          className:
                            'text-foreground hover:text-accent-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors bg-transparent',
                          children: 'ประวัติหน่วย',
                        }),
                        l.jsx('a', {
                          href: '/about-us/leadership',
                          className:
                            'text-foreground hover:text-accent-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors bg-transparent',
                          children: 'ผู้บัญชาการและผู้นำ',
                        }),
                      ],
                    }),
                  ],
                }),
                l.jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    l.jsx('div', {
                      className: 'text-foreground font-medium py-2 px-4',
                      children: 'ไดเรกทอรี',
                    }),
                    l.jsxs('div', {
                      className: 'flex flex-col pl-4 space-y-2',
                      children: [
                        l.jsx('a', {
                          href: '/directory/internal',
                          className:
                            'text-foreground hover:text-accent-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors bg-transparent',
                          children: 'หน่วยย่อยและแผนกภายใน',
                        }),
                        l.jsx('a', {
                          href: '/directory/external',
                          className:
                            'text-foreground hover:text-accent-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors bg-transparent',
                          children: 'เครือข่ายภายนอกและความร่วมมือ',
                        }),
                      ],
                    }),
                  ],
                }),
                l.jsx('a', {
                  href: '/document-library',
                  className:
                    'text-foreground hover:text-accent-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors bg-transparent',
                  children: 'คลังเอกสาร',
                }),
                l.jsx('a', {
                  href: '/contact',
                  className:
                    'text-foreground hover:text-accent-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors bg-transparent',
                  children: 'ติดต่อ',
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
export { Dn as default };
