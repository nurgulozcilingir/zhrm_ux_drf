/*!
 * sweetalert2 v11.7.3
 * Released under the MIT License.
 */
!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = t())
      : "function" == typeof define && define.amd
      ? define(t)
      : ((e =
          "undefined" != typeof globalThis ? globalThis : e || self).Sweetalert2 =
          t());
  })(this, function () {
    "use strict";
    var e = {
      awaitingPromise: new WeakMap(),
      promise: new WeakMap(),
      innerParams: new WeakMap(),
      domCache: new WeakMap(),
    };
    const t = (e) => {
        const t = {};
        for (const n in e) t[e[n]] = "swal2-" + e[n];
        return t;
      },
      n = t([
        "container",
        "shown",
        "height-auto",
        "iosfix",
        "popup",
        "modal",
        "no-backdrop",
        "no-transition",
        "toast",
        "toast-shown",
        "show",
        "hide",
        "close",
        "title",
        "html-container",
        "actions",
        "confirm",
        "deny",
        "cancel",
        "default-outline",
        "footer",
        "icon",
        "icon-content",
        "image",
        "input",
        "file",
        "range",
        "select",
        "radio",
        "checkbox",
        "label",
        "textarea",
        "inputerror",
        "input-label",
        "validation-message",
        "progress-steps",
        "active-progress-step",
        "progress-step",
        "progress-step-line",
        "loader",
        "loading",
        "styled",
        "top",
        "top-start",
        "top-end",
        "top-left",
        "top-right",
        "center",
        "center-start",
        "center-end",
        "center-left",
        "center-right",
        "bottom",
        "bottom-start",
        "bottom-end",
        "bottom-left",
        "bottom-right",
        "grow-row",
        "grow-column",
        "grow-fullscreen",
        "rtl",
        "timer-progress-bar",
        "timer-progress-bar-container",
        "scrollbar-measure",
        "icon-success",
        "icon-warning",
        "icon-info",
        "icon-question",
        "icon-error",
      ]),
      o = t(["success", "warning", "info", "question", "error"]),
      i = "SweetAlert2:",
      s = (e) => e.charAt(0).toUpperCase() + e.slice(1),
      r = (e) => {
        // console.warn(`${i} ${"object" == typeof e ? e.join(" ") : e}`);
      },
      a = (e) => {
        console.error(`${i} ${e}`);
      },
      l = [],
      c = (e, t) => {
        var n;
        (n = `"${e}" is deprecated and will be removed in the next major release. Please use "${t}" instead.`),
          l.includes(n) || (l.push(n), r(n));
      },
      u = (e) => ("function" == typeof e ? e() : e),
      d = (e) => e && "function" == typeof e.toPromise,
      p = (e) => (d(e) ? e.toPromise() : Promise.resolve(e)),
      m = (e) => e && Promise.resolve(e) === e,
      g = () => document.body.querySelector(`.${n.container}`),
      h = (e) => {
        const t = g();
        return t ? t.querySelector(e) : null;
      },
      f = (e) => h(`.${e}`),
      b = () => f(n.popup),
      y = () => f(n.icon),
      w = () => f(n.title),
      v = () => f(n["html-container"]),
      C = () => f(n.image),
      A = () => f(n["progress-steps"]),
      k = () => f(n["validation-message"]),
      B = () => h(`.${n.actions} .${n.confirm}`),
      P = () => h(`.${n.actions} .${n.cancel}`),
      x = () => h(`.${n.actions} .${n.deny}`),
      E = () => h(`.${n.loader}`),
      $ = () => f(n.actions),
      T = () => f(n.footer),
      S = () => f(n["timer-progress-bar"]),
      L = () => f(n.close),
      O = () => {
        const e = Array.from(
            b().querySelectorAll(
              '[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'
            )
          ).sort((e, t) => {
            const n = parseInt(e.getAttribute("tabindex")),
              o = parseInt(t.getAttribute("tabindex"));
            return n > o ? 1 : n < o ? -1 : 0;
          }),
          t = Array.from(
            b().querySelectorAll(
              '\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex="0"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n'
            )
          ).filter((e) => "-1" !== e.getAttribute("tabindex"));
        return ((e) => {
          const t = [];
          for (let n = 0; n < e.length; n++)
            -1 === t.indexOf(e[n]) && t.push(e[n]);
          return t;
        })(e.concat(t)).filter((e) => J(e));
      },
      j = () =>
        D(document.body, n.shown) &&
        !D(document.body, n["toast-shown"]) &&
        !D(document.body, n["no-backdrop"]),
      M = () => b() && D(b(), n.toast),
      H = { previousBodyPadding: null },
      I = (e, t) => {
        if (((e.textContent = ""), t)) {
          const n = new DOMParser().parseFromString(t, "text/html");
          Array.from(n.querySelector("head").childNodes).forEach((t) => {
            e.appendChild(t);
          }),
            Array.from(n.querySelector("body").childNodes).forEach((t) => {
              t instanceof HTMLVideoElement || t instanceof HTMLAudioElement
                ? e.appendChild(t.cloneNode(!0))
                : e.appendChild(t);
            });
        }
      },
      D = (e, t) => {
        if (!t) return !1;
        const n = t.split(/\s+/);
        for (let t = 0; t < n.length; t++)
          if (!e.classList.contains(n[t])) return !1;
        return !0;
      },
      q = (e, t, i) => {
        if (
          (((e, t) => {
            Array.from(e.classList).forEach((i) => {
              Object.values(n).includes(i) ||
                Object.values(o).includes(i) ||
                Object.values(t.showClass).includes(i) ||
                e.classList.remove(i);
            });
          })(e, t),
          t.customClass && t.customClass[i])
        ) {
          if ("string" != typeof t.customClass[i] && !t.customClass[i].forEach)
            return void r(
              `Invalid type of customClass.${i}! Expected string or iterable object, got "${typeof t
                .customClass[i]}"`
            );
          R(e, t.customClass[i]);
        }
      },
      V = (e, t) => {
        if (!t) return null;
        switch (t) {
          case "select":
          case "textarea":
          case "file":
            return e.querySelector(`.${n.popup} > .${n[t]}`);
          case "checkbox":
            return e.querySelector(`.${n.popup} > .${n.checkbox} input`);
          case "radio":
            return (
              e.querySelector(`.${n.popup} > .${n.radio} input:checked`) ||
              e.querySelector(`.${n.popup} > .${n.radio} input:first-child`)
            );
          case "range":
            return e.querySelector(`.${n.popup} > .${n.range} input`);
          default:
            return e.querySelector(`.${n.popup} > .${n.input}`);
        }
      },
      N = (e) => {
        if ((e.focus(), "file" !== e.type)) {
          const t = e.value;
          (e.value = ""), (e.value = t);
        }
      },
      F = (e, t, n) => {
        e &&
          t &&
          ("string" == typeof t && (t = t.split(/\s+/).filter(Boolean)),
          t.forEach((t) => {
            Array.isArray(e)
              ? e.forEach((e) => {
                  n ? e.classList.add(t) : e.classList.remove(t);
                })
              : n
              ? e.classList.add(t)
              : e.classList.remove(t);
          }));
      },
      R = (e, t) => {
        F(e, t, !0);
      },
      U = (e, t) => {
        F(e, t, !1);
      },
      _ = (e, t) => {
        const n = Array.from(e.children);
        for (let e = 0; e < n.length; e++) {
          const o = n[e];
          if (o instanceof HTMLElement && D(o, t)) return o;
        }
      },
      W = (e, t, n) => {
        n === `${parseInt(n)}` && (n = parseInt(n)),
          n || 0 === parseInt(n)
            ? (e.style[t] = "number" == typeof n ? `${n}px` : n)
            : e.style.removeProperty(t);
      },
      z = function (e) {
        let t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "flex";
        e.style.display = t;
      },
      K = (e) => {
        e.style.display = "none";
      },
      Y = (e, t, n, o) => {
        const i = e.querySelector(t);
        i && (i.style[n] = o);
      },
      Z = function (e, t) {
        t
          ? z(
              e,
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : "flex"
            )
          : K(e);
      },
      J = (e) =>
        !(!e || !(e.offsetWidth || e.offsetHeight || e.getClientRects().length)),
      X = (e) => !!(e.scrollHeight > e.clientHeight),
      G = (e) => {
        const t = window.getComputedStyle(e),
          n = parseFloat(t.getPropertyValue("animation-duration") || "0"),
          o = parseFloat(t.getPropertyValue("transition-duration") || "0");
        return n > 0 || o > 0;
      },
      Q = function (e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        const n = S();
        J(n) &&
          (t && ((n.style.transition = "none"), (n.style.width = "100%")),
          setTimeout(() => {
            (n.style.transition = `width ${e / 1e3}s linear`),
              (n.style.width = "0%");
          }, 10));
      },
      ee = {},
      te = (e) =>
        new Promise((t) => {
          if (!e) return t();
          const n = window.scrollX,
            o = window.scrollY;
          (ee.restoreFocusTimeout = setTimeout(() => {
            ee.previousActiveElement instanceof HTMLElement
              ? (ee.previousActiveElement.focus(),
                (ee.previousActiveElement = null))
              : document.body && document.body.focus(),
              t();
          }, 100)),
            window.scrollTo(n, o);
        }),
      ne = () => "undefined" == typeof window || "undefined" == typeof document,
      oe =
        `\n <div aria-labelledby="${n.title}" aria-describedby="${n["html-container"]}" class="${n.popup}" tabindex="-1">\n   <button type="button" class="${n.close}"></button>\n   <ul class="${n["progress-steps"]}"></ul>\n   <div class="${n.icon}"></div>\n   <img class="${n.image}" />\n   <h2 class="${n.title}" id="${n.title}"></h2>\n   <div class="${n["html-container"]}" id="${n["html-container"]}"></div>\n   <input class="${n.input}" />\n   <input type="file" class="${n.file}" />\n   <div class="${n.range}">\n     <input type="range" />\n     <output></output>\n   </div>\n   <select class="${n.select}"></select>\n   <div class="${n.radio}"></div>\n   <label for="${n.checkbox}" class="${n.checkbox}">\n     <input type="checkbox" />\n     <span class="${n.label}"></span>\n   </label>\n   <textarea class="${n.textarea}"></textarea>\n   <div class="${n["validation-message"]}" id="${n["validation-message"]}"></div>\n   <div class="${n.actions}">\n     <div class="${n.loader}"></div>\n     <button type="button" class="${n.confirm}"></button>\n     <button type="button" class="${n.deny}"></button>\n     <button type="button" class="${n.cancel}"></button>\n   </div>\n   <div class="${n.footer}"></div>\n   <div class="${n["timer-progress-bar-container"]}">\n     <div class="${n["timer-progress-bar"]}"></div>\n   </div>\n </div>\n`.replace(
          /(^|\n)\s*/g,
          ""
        ),
      ie = () => {
        ee.currentInstance.resetValidationMessage();
      },
      se = (e) => {
        const t = (() => {
          const e = g();
          return (
            !!e &&
            (e.remove(),
            U(
              [document.documentElement, document.body],
              [n["no-backdrop"], n["toast-shown"], n["has-column"]]
            ),
            !0)
          );
        })();
        if (ne()) return void a("SweetAlert2 requires document to initialize");
        const o = document.createElement("div");
        (o.className = n.container), t && R(o, n["no-transition"]), I(o, oe);
        const i =
          "string" == typeof (s = e.target) ? document.querySelector(s) : s;
        var s;
        i.appendChild(o),
          ((e) => {
            const t = b();
            t.setAttribute("role", e.toast ? "alert" : "dialog"),
              t.setAttribute("aria-live", e.toast ? "polite" : "assertive"),
              e.toast || t.setAttribute("aria-modal", "true");
          })(e),
          ((e) => {
            "rtl" === window.getComputedStyle(e).direction && R(g(), n.rtl);
          })(i),
          (() => {
            const e = b(),
              t = _(e, n.input),
              o = _(e, n.file),
              i = e.querySelector(`.${n.range} input`),
              s = e.querySelector(`.${n.range} output`),
              r = _(e, n.select),
              a = e.querySelector(`.${n.checkbox} input`),
              l = _(e, n.textarea);
            (t.oninput = ie),
              (o.onchange = ie),
              (r.onchange = ie),
              (a.onchange = ie),
              (l.oninput = ie),
              (i.oninput = () => {
                ie(), (s.value = i.value);
              }),
              (i.onchange = () => {
                ie(), (s.value = i.value);
              });
          })();
      },
      re = (e, t) => {
        e instanceof HTMLElement
          ? t.appendChild(e)
          : "object" == typeof e
          ? ae(e, t)
          : e && I(t, e);
      },
      ae = (e, t) => {
        e.jquery ? le(t, e) : I(t, e.toString());
      },
      le = (e, t) => {
        if (((e.textContent = ""), 0 in t))
          for (let n = 0; n in t; n++) e.appendChild(t[n].cloneNode(!0));
        else e.appendChild(t.cloneNode(!0));
      },
      ce = (() => {
        if (ne()) return !1;
        const e = document.createElement("div"),
          t = {
            WebkitAnimation: "webkitAnimationEnd",
            animation: "animationend",
          };
        for (const n in t)
          if (Object.prototype.hasOwnProperty.call(t, n) && void 0 !== e.style[n])
            return t[n];
        return !1;
      })(),
      ue = (e, t) => {
        const o = $(),
          i = E();
        t.showConfirmButton || t.showDenyButton || t.showCancelButton
          ? z(o)
          : K(o),
          q(o, t, "actions"),
          (function (e, t, o) {
            const i = B(),
              s = x(),
              r = P();
            de(i, "confirm", o),
              de(s, "deny", o),
              de(r, "cancel", o),
              (function (e, t, o, i) {
                if (!i.buttonsStyling) return void U([e, t, o], n.styled);
                R([e, t, o], n.styled),
                  i.confirmButtonColor &&
                    ((e.style.backgroundColor = i.confirmButtonColor),
                    R(e, n["default-outline"]));
                i.denyButtonColor &&
                  ((t.style.backgroundColor = i.denyButtonColor),
                  R(t, n["default-outline"]));
                i.cancelButtonColor &&
                  ((o.style.backgroundColor = i.cancelButtonColor),
                  R(o, n["default-outline"]));
              })(i, s, r, o),
              o.reverseButtons &&
                (o.toast
                  ? (e.insertBefore(r, i), e.insertBefore(s, i))
                  : (e.insertBefore(r, t),
                    e.insertBefore(s, t),
                    e.insertBefore(i, t)));
          })(o, i, t),
          I(i, t.loaderHtml),
          q(i, t, "loader");
      };
    function de(e, t, o) {
      Z(e, o[`show${s(t)}Button`], "inline-block"),
        I(e, o[`${t}ButtonText`]),
        e.setAttribute("aria-label", o[`${t}ButtonAriaLabel`]),
        (e.className = n[t]),
        q(e, o, `${t}Button`),
        R(e, o[`${t}ButtonClass`]);
    }
    const pe = (e, t) => {
      const o = g();
      o &&
        (!(function (e, t) {
          "string" == typeof t
            ? (e.style.background = t)
            : t || R([document.documentElement, document.body], n["no-backdrop"]);
        })(o, t.backdrop),
        (function (e, t) {
          t in n
            ? R(e, n[t])
            : (r('The "position" parameter is not valid, defaulting to "center"'),
              R(e, n.center));
        })(o, t.position),
        (function (e, t) {
          if (t && "string" == typeof t) {
            const o = `grow-${t}`;
            o in n && R(e, n[o]);
          }
        })(o, t.grow),
        q(o, t, "container"));
    };
    const me = [
        "input",
        "file",
        "range",
        "select",
        "radio",
        "checkbox",
        "textarea",
      ],
      ge = (e) => {
        if (!Ce[e.input])
          return void a(
            `Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "${e.input}"`
          );
        const t = we(e.input),
          n = Ce[e.input](t, e);
        z(t),
          e.inputAutoFocus &&
            setTimeout(() => {
              N(n);
            });
      },
      he = (e, t) => {
        const n = V(b(), e);
        if (n) {
          ((e) => {
            for (let t = 0; t < e.attributes.length; t++) {
              const n = e.attributes[t].name;
              ["type", "value", "style"].includes(n) || e.removeAttribute(n);
            }
          })(n);
          for (const e in t) n.setAttribute(e, t[e]);
        }
      },
      fe = (e) => {
        const t = we(e.input);
        "object" == typeof e.customClass && R(t, e.customClass.input);
      },
      be = (e, t) => {
        (e.placeholder && !t.inputPlaceholder) ||
          (e.placeholder = t.inputPlaceholder);
      },
      ye = (e, t, o) => {
        if (o.inputLabel) {
          e.id = n.input;
          const i = document.createElement("label"),
            s = n["input-label"];
          i.setAttribute("for", e.id),
            (i.className = s),
            "object" == typeof o.customClass && R(i, o.customClass.inputLabel),
            (i.innerText = o.inputLabel),
            t.insertAdjacentElement("beforebegin", i);
        }
      },
      we = (e) => _(b(), n[e] || n.input),
      ve = (e, t) => {
        ["string", "number"].includes(typeof t)
          ? (e.value = `${t}`)
          : m(t) ||
            r(
              `Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof t}"`
            );
      },
      Ce = {};
    (Ce.text =
      Ce.email =
      Ce.password =
      Ce.number =
      Ce.tel =
      Ce.url =
        (e, t) => (
          ve(e, t.inputValue), ye(e, e, t), be(e, t), (e.type = t.input), e
        )),
      (Ce.file = (e, t) => (ye(e, e, t), be(e, t), e)),
      (Ce.range = (e, t) => {
        const n = e.querySelector("input"),
          o = e.querySelector("output");
        return (
          ve(n, t.inputValue),
          (n.type = t.input),
          ve(o, t.inputValue),
          ye(n, e, t),
          e
        );
      }),
      (Ce.select = (e, t) => {
        if (((e.textContent = ""), t.inputPlaceholder)) {
          const n = document.createElement("option");
          I(n, t.inputPlaceholder),
            (n.value = ""),
            (n.disabled = !0),
            (n.selected = !0),
            e.appendChild(n);
        }
        return ye(e, e, t), e;
      }),
      (Ce.radio = (e) => ((e.textContent = ""), e)),
      (Ce.checkbox = (e, t) => {
        const o = V(b(), "checkbox");
        (o.value = "1"), (o.id = n.checkbox), (o.checked = Boolean(t.inputValue));
        const i = e.querySelector("span");
        return I(i, t.inputPlaceholder), o;
      }),
      (Ce.textarea = (e, t) => {
        ve(e, t.inputValue), be(e, t), ye(e, e, t);
        return (
          setTimeout(() => {
            if ("MutationObserver" in window) {
              const t = parseInt(window.getComputedStyle(b()).width);
              new MutationObserver(() => {
                const n =
                  e.offsetWidth +
                  ((o = e),
                  parseInt(window.getComputedStyle(o).marginLeft) +
                    parseInt(window.getComputedStyle(o).marginRight));
                var o;
                b().style.width = n > t ? `${n}px` : null;
              }).observe(e, { attributes: !0, attributeFilter: ["style"] });
            }
          }),
          e
        );
      });
    const Ae = (t, o) => {
        const i = v();
        q(i, o, "htmlContainer"),
          o.html
            ? (re(o.html, i), z(i, "block"))
            : o.text
            ? ((i.textContent = o.text), z(i, "block"))
            : K(i),
          ((t, o) => {
            const i = b(),
              s = e.innerParams.get(t),
              r = !s || o.input !== s.input;
            me.forEach((e) => {
              const t = _(i, n[e]);
              he(e, o.inputAttributes), (t.className = n[e]), r && K(t);
            }),
              o.input && (r && ge(o), fe(o));
          })(t, o);
      },
      ke = (e, t) => {
        for (const n in o) t.icon !== n && U(e, o[n]);
        R(e, o[t.icon]), xe(e, t), Be(), q(e, t, "icon");
      },
      Be = () => {
        const e = b(),
          t = window.getComputedStyle(e).getPropertyValue("background-color"),
          n = e.querySelectorAll(
            "[class^=swal2-success-circular-line], .swal2-success-fix"
          );
        for (let e = 0; e < n.length; e++) n[e].style.backgroundColor = t;
      },
      Pe = (e, t) => {
        let n,
          o = e.innerHTML;
        if (t.iconHtml) n = Ee(t.iconHtml);
        else if ("success" === t.icon)
          (n =
            '\n  <div class="swal2-success-circular-line-left"></div>\n  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n  <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n  <div class="swal2-success-circular-line-right"></div>\n'),
            (o = o.replace(/ style=".*?"/g, ""));
        else if ("error" === t.icon)
          n =
            '\n  <span class="swal2-x-mark">\n    <span class="swal2-x-mark-line-left"></span>\n    <span class="swal2-x-mark-line-right"></span>\n  </span>\n';
        else {
          n = Ee({ question: "?", warning: "!", info: "i" }[t.icon]);
        }
        o.trim() !== n.trim() && I(e, n);
      },
      xe = (e, t) => {
        if (t.iconColor) {
          (e.style.color = t.iconColor), (e.style.borderColor = t.iconColor);
          for (const n of [
            ".swal2-success-line-tip",
            ".swal2-success-line-long",
            ".swal2-x-mark-line-left",
            ".swal2-x-mark-line-right",
          ])
            Y(e, n, "backgroundColor", t.iconColor);
          Y(e, ".swal2-success-ring", "borderColor", t.iconColor);
        }
      },
      Ee = (e) => `<div class="${n["icon-content"]}">${e}</div>`,
      $e = (e, t) => {
        (e.className = `${n.popup} ${J(e) ? t.showClass.popup : ""}`),
          t.toast
            ? (R([document.documentElement, document.body], n["toast-shown"]),
              R(e, n.toast))
            : R(e, n.modal),
          q(e, t, "popup"),
          "string" == typeof t.customClass && R(e, t.customClass),
          t.icon && R(e, n[`icon-${t.icon}`]);
      },
      Te = (e) => {
        const t = document.createElement("li");
        return R(t, n["progress-step"]), I(t, e), t;
      },
      Se = (e) => {
        const t = document.createElement("li");
        return (
          R(t, n["progress-step-line"]),
          e.progressStepsDistance && W(t, "width", e.progressStepsDistance),
          t
        );
      },
      Le = (t, i) => {
        ((e, t) => {
          const n = g(),
            o = b();
          t.toast
            ? (W(n, "width", t.width),
              (o.style.width = "100%"),
              o.insertBefore(E(), y()))
            : W(o, "width", t.width),
            W(o, "padding", t.padding),
            t.color && (o.style.color = t.color),
            t.background && (o.style.background = t.background),
            K(k()),
            $e(o, t);
        })(0, i),
          pe(0, i),
          ((e, t) => {
            const o = A();
            t.progressSteps && 0 !== t.progressSteps.length
              ? (z(o),
                (o.textContent = ""),
                t.currentProgressStep >= t.progressSteps.length &&
                  r(
                    "Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"
                  ),
                t.progressSteps.forEach((e, i) => {
                  const s = Te(e);
                  if (
                    (o.appendChild(s),
                    i === t.currentProgressStep &&
                      R(s, n["active-progress-step"]),
                    i !== t.progressSteps.length - 1)
                  ) {
                    const e = Se(t);
                    o.appendChild(e);
                  }
                }))
              : K(o);
          })(0, i),
          ((t, n) => {
            const i = e.innerParams.get(t),
              s = y();
            if (i && n.icon === i.icon) return Pe(s, n), void ke(s, n);
            if (n.icon || n.iconHtml) {
              if (n.icon && -1 === Object.keys(o).indexOf(n.icon))
                return (
                  a(
                    `Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${n.icon}"`
                  ),
                  void K(s)
                );
              z(s), Pe(s, n), ke(s, n), R(s, n.showClass.icon);
            } else K(s);
          })(t, i),
          ((e, t) => {
            const o = C();
            t.imageUrl
              ? (z(o, ""),
                o.setAttribute("src", t.imageUrl),
                o.setAttribute("alt", t.imageAlt),
                W(o, "width", t.imageWidth),
                W(o, "height", t.imageHeight),
                (o.className = n.image),
                q(o, t, "image"))
              : K(o);
          })(0, i),
          ((e, t) => {
            const n = w();
            Z(n, t.title || t.titleText, "block"),
              t.title && re(t.title, n),
              t.titleText && (n.innerText = t.titleText),
              q(n, t, "title");
          })(0, i),
          ((e, t) => {
            const n = L();
            I(n, t.closeButtonHtml),
              q(n, t, "closeButton"),
              Z(n, t.showCloseButton),
              n.setAttribute("aria-label", t.closeButtonAriaLabel);
          })(0, i),
          Ae(t, i),
          ue(0, i),
          ((e, t) => {
            const n = T();
            Z(n, t.footer), t.footer && re(t.footer, n), q(n, t, "footer");
          })(0, i),
          "function" == typeof i.didRender && i.didRender(b());
      };
    function Oe() {
      const t = e.innerParams.get(this);
      if (!t) return;
      const o = e.domCache.get(this);
      K(o.loader),
        M() ? t.icon && z(y()) : je(o),
        U([o.popup, o.actions], n.loading),
        o.popup.removeAttribute("aria-busy"),
        o.popup.removeAttribute("data-loading"),
        (o.confirmButton.disabled = !1),
        (o.denyButton.disabled = !1),
        (o.cancelButton.disabled = !1);
    }
    const je = (e) => {
      const t = e.popup.getElementsByClassName(
        e.loader.getAttribute("data-button-to-replace")
      );
      t.length
        ? z(t[0], "inline-block")
        : J(B()) || J(x()) || J(P()) || K(e.actions);
    };
    const Me = () => B() && B().click(),
      He = Object.freeze({
        cancel: "cancel",
        backdrop: "backdrop",
        close: "close",
        esc: "esc",
        timer: "timer",
      }),
      Ie = (e) => {
        e.keydownTarget &&
          e.keydownHandlerAdded &&
          (e.keydownTarget.removeEventListener("keydown", e.keydownHandler, {
            capture: e.keydownListenerCapture,
          }),
          (e.keydownHandlerAdded = !1));
      },
      De = (e, t) => {
        const n = O();
        if (n.length)
          return (
            (e += t) === n.length ? (e = 0) : -1 === e && (e = n.length - 1),
            void n[e].focus()
          );
        b().focus();
      },
      qe = ["ArrowRight", "ArrowDown"],
      Ve = ["ArrowLeft", "ArrowUp"],
      Ne = (t, n, o) => {
        const i = e.innerParams.get(t);
        i &&
          (n.isComposing ||
            229 === n.keyCode ||
            (i.stopKeydownPropagation && n.stopPropagation(),
            "Enter" === n.key
              ? Fe(t, n, i)
              : "Tab" === n.key
              ? Re(n)
              : [...qe, ...Ve].includes(n.key)
              ? Ue(n.key)
              : "Escape" === n.key && _e(n, i, o)));
      },
      Fe = (e, t, n) => {
        if (
          u(n.allowEnterKey) &&
          t.target &&
          e.getInput() &&
          t.target instanceof HTMLElement &&
          t.target.outerHTML === e.getInput().outerHTML
        ) {
          if (["textarea", "file"].includes(n.input)) return;
          Me(), t.preventDefault();
        }
      },
      Re = (e) => {
        const t = e.target,
          n = O();
        let o = -1;
        for (let e = 0; e < n.length; e++)
          if (t === n[e]) {
            o = e;
            break;
          }
        e.shiftKey ? De(o, -1) : De(o, 1),
          e.stopPropagation(),
          e.preventDefault();
      },
      Ue = (e) => {
        const t = [B(), x(), P()];
        if (
          document.activeElement instanceof HTMLElement &&
          !t.includes(document.activeElement)
        )
          return;
        const n = qe.includes(e)
          ? "nextElementSibling"
          : "previousElementSibling";
        let o = document.activeElement;
        for (let e = 0; e < $().children.length; e++) {
          if (((o = o[n]), !o)) return;
          if (o instanceof HTMLButtonElement && J(o)) break;
        }
        o instanceof HTMLButtonElement && o.focus();
      },
      _e = (e, t, n) => {
        u(t.allowEscapeKey) && (e.preventDefault(), n(He.esc));
      };
    var We = {
      swalPromiseResolve: new WeakMap(),
      swalPromiseReject: new WeakMap(),
    };
    const ze = () => {
        Array.from(document.body.children).forEach((e) => {
          e.hasAttribute("data-previous-aria-hidden")
            ? (e.setAttribute(
                "aria-hidden",
                e.getAttribute("data-previous-aria-hidden")
              ),
              e.removeAttribute("data-previous-aria-hidden"))
            : e.removeAttribute("aria-hidden");
        });
      },
      Ke = () => {
        const e = navigator.userAgent,
          t = !!e.match(/iPad/i) || !!e.match(/iPhone/i),
          n = !!e.match(/WebKit/i);
        if (t && n && !e.match(/CriOS/i)) {
          const e = 44;
          b().scrollHeight > window.innerHeight - e &&
            (g().style.paddingBottom = `${e}px`);
        }
      },
      Ye = () => {
        const e = g();
        let t;
        (e.ontouchstart = (e) => {
          t = Ze(e);
        }),
          (e.ontouchmove = (e) => {
            t && (e.preventDefault(), e.stopPropagation());
          });
      },
      Ze = (e) => {
        const t = e.target,
          n = g();
        return (
          !Je(e) &&
          !Xe(e) &&
          (t === n ||
            (!X(n) &&
              t instanceof HTMLElement &&
              "INPUT" !== t.tagName &&
              "TEXTAREA" !== t.tagName &&
              (!X(v()) || !v().contains(t))))
        );
      },
      Je = (e) =>
        e.touches && e.touches.length && "stylus" === e.touches[0].touchType,
      Xe = (e) => e.touches && e.touches.length > 1,
      Ge = () => {
        if (D(document.body, n.iosfix)) {
          const e = parseInt(document.body.style.top, 10);
          U(document.body, n.iosfix),
            (document.body.style.top = ""),
            (document.body.scrollTop = -1 * e);
        }
      },
      Qe = () => {
        null === H.previousBodyPadding &&
          document.body.scrollHeight > window.innerHeight &&
          ((H.previousBodyPadding = parseInt(
            window
              .getComputedStyle(document.body)
              .getPropertyValue("padding-right")
          )),
          (document.body.style.paddingRight = `${
            H.previousBodyPadding +
            (() => {
              const e = document.createElement("div");
              (e.className = n["scrollbar-measure"]),
                document.body.appendChild(e);
              const t = e.getBoundingClientRect().width - e.clientWidth;
              return document.body.removeChild(e), t;
            })()
          }px`));
      },
      et = () => {
        null !== H.previousBodyPadding &&
          ((document.body.style.paddingRight = `${H.previousBodyPadding}px`),
          (H.previousBodyPadding = null));
      };
    function tt(e, t, o, i) {
      M() ? lt(e, i) : (te(o).then(() => lt(e, i)), Ie(ee));
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        ? (t.setAttribute("style", "display:none !important"),
          t.removeAttribute("class"),
          (t.innerHTML = ""))
        : t.remove(),
        j() && (et(), Ge(), ze()),
        U(
          [document.documentElement, document.body],
          [n.shown, n["height-auto"], n["no-backdrop"], n["toast-shown"]]
        );
    }
    function nt(e) {
      e = st(e);
      const t = We.swalPromiseResolve.get(this),
        n = ot(this);
      this.isAwaitingPromise() ? e.isDismissed || (it(this), t(e)) : n && t(e);
    }
    const ot = (t) => {
      const n = b();
      if (!n) return !1;
      const o = e.innerParams.get(t);
      if (!o || D(n, o.hideClass.popup)) return !1;
      U(n, o.showClass.popup), R(n, o.hideClass.popup);
      const i = g();
      return (
        U(i, o.showClass.backdrop), R(i, o.hideClass.backdrop), rt(t, n, o), !0
      );
    };
    const it = (t) => {
        t.isAwaitingPromise() &&
          (e.awaitingPromise.delete(t), e.innerParams.get(t) || t._destroy());
      },
      st = (e) =>
        void 0 === e
          ? { isConfirmed: !1, isDenied: !1, isDismissed: !0 }
          : Object.assign({ isConfirmed: !1, isDenied: !1, isDismissed: !1 }, e),
      rt = (e, t, n) => {
        const o = g(),
          i = ce && G(t);
        "function" == typeof n.willClose && n.willClose(t),
          i
            ? at(e, t, o, n.returnFocus, n.didClose)
            : tt(e, o, n.returnFocus, n.didClose);
      },
      at = (e, t, n, o, i) => {
        (ee.swalCloseEventFinishedCallback = tt.bind(null, e, n, o, i)),
          t.addEventListener(ce, function (e) {
            e.target === t &&
              (ee.swalCloseEventFinishedCallback(),
              delete ee.swalCloseEventFinishedCallback);
          });
      },
      lt = (e, t) => {
        setTimeout(() => {
          "function" == typeof t && t.bind(e.params)(), e._destroy();
        });
      };
    function ct(t, n, o) {
      const i = e.domCache.get(t);
      n.forEach((e) => {
        i[e].disabled = o;
      });
    }
    function ut(e, t) {
      if (e)
        if ("radio" === e.type) {
          const n = e.parentNode.parentNode.querySelectorAll("input");
          for (let e = 0; e < n.length; e++) n[e].disabled = t;
        } else e.disabled = t;
    }
    const dt = {
        title: "",
        titleText: "",
        text: "",
        html: "",
        footer: "",
        icon: void 0,
        iconColor: void 0,
        iconHtml: void 0,
        template: void 0,
        toast: !1,
        showClass: {
          popup: "swal2-show",
          backdrop: "swal2-backdrop-show",
          icon: "swal2-icon-show",
        },
        hideClass: {
          popup: "swal2-hide",
          backdrop: "swal2-backdrop-hide",
          icon: "swal2-icon-hide",
        },
        customClass: {},
        target: "body",
        color: void 0,
        backdrop: !0,
        heightAuto: !0,
        allowOutsideClick: !0,
        allowEscapeKey: !0,
        allowEnterKey: !0,
        stopKeydownPropagation: !0,
        keydownListenerCapture: !1,
        showConfirmButton: !0,
        showDenyButton: !1,
        showCancelButton: !1,
        preConfirm: void 0,
        preDeny: void 0,
        confirmButtonText: "OK",
        confirmButtonAriaLabel: "",
        confirmButtonColor: void 0,
        denyButtonText: "No",
        denyButtonAriaLabel: "",
        denyButtonColor: void 0,
        cancelButtonText: "Cancel",
        cancelButtonAriaLabel: "",
        cancelButtonColor: void 0,
        buttonsStyling: !0,
        reverseButtons: !1,
        focusConfirm: !0,
        focusDeny: !1,
        focusCancel: !1,
        returnFocus: !0,
        showCloseButton: !1,
        closeButtonHtml: "&times;",
        closeButtonAriaLabel: "Close this dialog",
        loaderHtml: "",
        showLoaderOnConfirm: !1,
        showLoaderOnDeny: !1,
        imageUrl: void 0,
        imageWidth: void 0,
        imageHeight: void 0,
        imageAlt: "",
        timer: void 0,
        timerProgressBar: !1,
        width: void 0,
        padding: void 0,
        background: void 0,
        input: void 0,
        inputPlaceholder: "",
        inputLabel: "",
        inputValue: "",
        inputOptions: {},
        inputAutoFocus: !0,
        inputAutoTrim: !0,
        inputAttributes: {},
        inputValidator: void 0,
        returnInputValueOnDeny: !1,
        validationMessage: void 0,
        grow: !1,
        position: "center",
        progressSteps: [],
        currentProgressStep: void 0,
        progressStepsDistance: void 0,
        willOpen: void 0,
        didOpen: void 0,
        didRender: void 0,
        willClose: void 0,
        didClose: void 0,
        didDestroy: void 0,
        scrollbarPadding: !0,
      },
      pt = [
        "allowEscapeKey",
        "allowOutsideClick",
        "background",
        "buttonsStyling",
        "cancelButtonAriaLabel",
        "cancelButtonColor",
        "cancelButtonText",
        "closeButtonAriaLabel",
        "closeButtonHtml",
        "color",
        "confirmButtonAriaLabel",
        "confirmButtonColor",
        "confirmButtonText",
        "currentProgressStep",
        "customClass",
        "denyButtonAriaLabel",
        "denyButtonColor",
        "denyButtonText",
        "didClose",
        "didDestroy",
        "footer",
        "hideClass",
        "html",
        "icon",
        "iconColor",
        "iconHtml",
        "imageAlt",
        "imageHeight",
        "imageUrl",
        "imageWidth",
        "preConfirm",
        "preDeny",
        "progressSteps",
        "returnFocus",
        "reverseButtons",
        "showCancelButton",
        "showCloseButton",
        "showConfirmButton",
        "showDenyButton",
        "text",
        "title",
        "titleText",
        "willClose",
      ],
      mt = {},
      gt = [
        "allowOutsideClick",
        "allowEnterKey",
        "backdrop",
        "focusConfirm",
        "focusDeny",
        "focusCancel",
        "returnFocus",
        "heightAuto",
        "keydownListenerCapture",
      ],
      ht = (e) => Object.prototype.hasOwnProperty.call(dt, e),
      ft = (e) => -1 !== pt.indexOf(e),
      bt = (e) => mt[e],
      yt = (e) => {
        ht(e) || r(`Unknown parameter "${e}"`);
      },
      wt = (e) => {
        gt.includes(e) && r(`The parameter "${e}" is incompatible with toasts`);
      },
      vt = (e) => {
        bt(e) && c(e, bt(e));
      };
    const Ct = (e) => {
      const t = {};
      return (
        Object.keys(e).forEach((n) => {
          ft(n) ? (t[n] = e[n]) : r(`Invalid parameter to update: ${n}`);
        }),
        t
      );
    };
    const At = (e) => {
        kt(e),
          delete e.params,
          delete ee.keydownHandler,
          delete ee.keydownTarget,
          delete ee.currentInstance;
      },
      kt = (t) => {
        t.isAwaitingPromise()
          ? (Bt(e, t), e.awaitingPromise.set(t, !0))
          : (Bt(We, t), Bt(e, t));
      },
      Bt = (e, t) => {
        for (const n in e) e[n].delete(t);
      };
    var Pt = Object.freeze({
      __proto__: null,
      _destroy: function () {
        const t = e.domCache.get(this),
          n = e.innerParams.get(this);
        n
          ? (t.popup &&
              ee.swalCloseEventFinishedCallback &&
              (ee.swalCloseEventFinishedCallback(),
              delete ee.swalCloseEventFinishedCallback),
            "function" == typeof n.didDestroy && n.didDestroy(),
            At(this))
          : kt(this);
      },
      close: nt,
      closeModal: nt,
      closePopup: nt,
      closeToast: nt,
      disableButtons: function () {
        ct(this, ["confirmButton", "denyButton", "cancelButton"], !0);
      },
      disableInput: function () {
        ut(this.getInput(), !0);
      },
      disableLoading: Oe,
      enableButtons: function () {
        ct(this, ["confirmButton", "denyButton", "cancelButton"], !1);
      },
      enableInput: function () {
        ut(this.getInput(), !1);
      },
      getInput: function (t) {
        const n = e.innerParams.get(t || this),
          o = e.domCache.get(t || this);
        return o ? V(o.popup, n.input) : null;
      },
      handleAwaitingPromise: it,
      hideLoading: Oe,
      isAwaitingPromise: function () {
        return !!e.awaitingPromise.get(this);
      },
      rejectPromise: function (e) {
        const t = We.swalPromiseReject.get(this);
        it(this), t && t(e);
      },
      resetValidationMessage: function () {
        const t = e.domCache.get(this);
        t.validationMessage && K(t.validationMessage);
        const o = this.getInput();
        o &&
          (o.removeAttribute("aria-invalid"),
          o.removeAttribute("aria-describedby"),
          U(o, n.inputerror));
      },
      showValidationMessage: function (t) {
        const o = e.domCache.get(this),
          i = e.innerParams.get(this);
        I(o.validationMessage, t),
          (o.validationMessage.className = n["validation-message"]),
          i.customClass &&
            i.customClass.validationMessage &&
            R(o.validationMessage, i.customClass.validationMessage),
          z(o.validationMessage);
        const s = this.getInput();
        s &&
          (s.setAttribute("aria-invalid", !0),
          s.setAttribute("aria-describedby", n["validation-message"]),
          N(s),
          R(s, n.inputerror));
      },
      update: function (t) {
        const n = b(),
          o = e.innerParams.get(this);
        if (!n || D(n, o.hideClass.popup))
          return void r(
            "You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup."
          );
        const i = Ct(t),
          s = Object.assign({}, o, i);
        Le(this, s),
          e.innerParams.set(this, s),
          Object.defineProperties(this, {
            params: {
              value: Object.assign({}, this.params, t),
              writable: !1,
              enumerable: !0,
            },
          });
      },
    });
    const xt = (e) => {
        let t = b();
        t || new Tn(), (t = b());
        const n = E();
        M() ? K(y()) : Et(t, e),
          z(n),
          t.setAttribute("data-loading", "true"),
          t.setAttribute("aria-busy", "true"),
          t.focus();
      },
      Et = (e, t) => {
        const o = $(),
          i = E();
        !t && J(B()) && (t = B()),
          z(o),
          t && (K(t), i.setAttribute("data-button-to-replace", t.className)),
          i.parentNode.insertBefore(i, t),
          R([e, o], n.loading);
      },
      $t = (e) => (e.checked ? 1 : 0),
      Tt = (e) => (e.checked ? e.value : null),
      St = (e) =>
        e.files.length
          ? null !== e.getAttribute("multiple")
            ? e.files
            : e.files[0]
          : null,
      Lt = (e, t) => {
        const n = b(),
          o = (e) => {
            jt[t.input](n, Mt(e), t);
          };
        d(t.inputOptions) || m(t.inputOptions)
          ? (xt(B()),
            p(t.inputOptions).then((t) => {
              e.hideLoading(), o(t);
            }))
          : "object" == typeof t.inputOptions
          ? o(t.inputOptions)
          : a(
              "Unexpected type of inputOptions! Expected object, Map or Promise, got " +
                typeof t.inputOptions
            );
      },
      Ot = (e, t) => {
        const n = e.getInput();
        K(n),
          p(t.inputValue)
            .then((o) => {
              (n.value = "number" === t.input ? `${parseFloat(o) || 0}` : `${o}`),
                z(n),
                n.focus(),
                e.hideLoading();
            })
            .catch((t) => {
              a(`Error in inputValue promise: ${t}`),
                (n.value = ""),
                z(n),
                n.focus(),
                e.hideLoading();
            });
      },
      jt = {
        select: (e, t, o) => {
          const i = _(e, n.select),
            s = (e, t, n) => {
              const i = document.createElement("option");
              (i.value = n),
                I(i, t),
                (i.selected = Ht(n, o.inputValue)),
                e.appendChild(i);
            };
          t.forEach((e) => {
            const t = e[0],
              n = e[1];
            if (Array.isArray(n)) {
              const e = document.createElement("optgroup");
              (e.label = t),
                (e.disabled = !1),
                i.appendChild(e),
                n.forEach((t) => s(e, t[1], t[0]));
            } else s(i, n, t);
          }),
            i.focus();
        },
        radio: (e, t, o) => {
          const i = _(e, n.radio);
          t.forEach((e) => {
            const t = e[0],
              s = e[1],
              r = document.createElement("input"),
              a = document.createElement("label");
            (r.type = "radio"),
              (r.name = n.radio),
              (r.value = t),
              Ht(t, o.inputValue) && (r.checked = !0);
            const l = document.createElement("span");
            I(l, s),
              (l.className = n.label),
              a.appendChild(r),
              a.appendChild(l),
              i.appendChild(a);
          });
          const s = i.querySelectorAll("input");
          s.length && s[0].focus();
        },
      },
      Mt = (e) => {
        const t = [];
        return (
          "undefined" != typeof Map && e instanceof Map
            ? e.forEach((e, n) => {
                let o = e;
                "object" == typeof o && (o = Mt(o)), t.push([n, o]);
              })
            : Object.keys(e).forEach((n) => {
                let o = e[n];
                "object" == typeof o && (o = Mt(o)), t.push([n, o]);
              }),
          t
        );
      },
      Ht = (e, t) => t && t.toString() === e.toString(),
      It = (t, n) => {
        const o = e.innerParams.get(t);
        if (!o.input)
          return void a(
            `The "input" parameter is needed to be set when using returnInputValueOn${s(
              n
            )}`
          );
        const i = ((e, t) => {
          const n = e.getInput();
          if (!n) return null;
          switch (t.input) {
            case "checkbox":
              return $t(n);
            case "radio":
              return Tt(n);
            case "file":
              return St(n);
            default:
              return t.inputAutoTrim ? n.value.trim() : n.value;
          }
        })(t, o);
        o.inputValidator
          ? Dt(t, i, n)
          : t.getInput().checkValidity()
          ? "deny" === n
            ? qt(t, i)
            : Ft(t, i)
          : (t.enableButtons(), t.showValidationMessage(o.validationMessage));
      },
      Dt = (t, n, o) => {
        const i = e.innerParams.get(t);
        t.disableInput();
        Promise.resolve()
          .then(() => p(i.inputValidator(n, i.validationMessage)))
          .then((e) => {
            t.enableButtons(),
              t.enableInput(),
              e ? t.showValidationMessage(e) : "deny" === o ? qt(t, n) : Ft(t, n);
          });
      },
      qt = (t, n) => {
        const o = e.innerParams.get(t || void 0);
        if ((o.showLoaderOnDeny && xt(x()), o.preDeny)) {
          e.awaitingPromise.set(t || void 0, !0);
          Promise.resolve()
            .then(() => p(o.preDeny(n, o.validationMessage)))
            .then((e) => {
              !1 === e
                ? (t.hideLoading(), it(t))
                : t.close({ isDenied: !0, value: void 0 === e ? n : e });
            })
            .catch((e) => Nt(t || void 0, e));
        } else t.close({ isDenied: !0, value: n });
      },
      Vt = (e, t) => {
        e.close({ isConfirmed: !0, value: t });
      },
      Nt = (e, t) => {
        e.rejectPromise(t);
      },
      Ft = (t, n) => {
        const o = e.innerParams.get(t || void 0);
        if ((o.showLoaderOnConfirm && xt(), o.preConfirm)) {
          t.resetValidationMessage(), e.awaitingPromise.set(t || void 0, !0);
          Promise.resolve()
            .then(() => p(o.preConfirm(n, o.validationMessage)))
            .then((e) => {
              J(k()) || !1 === e
                ? (t.hideLoading(), it(t))
                : Vt(t, void 0 === e ? n : e);
            })
            .catch((e) => Nt(t || void 0, e));
        } else Vt(t, n);
      },
      Rt = (t, n, o) => {
        n.popup.onclick = () => {
          const n = e.innerParams.get(t);
          (n && (Ut(n) || n.timer || n.input)) || o(He.close);
        };
      },
      Ut = (e) =>
        e.showConfirmButton ||
        e.showDenyButton ||
        e.showCancelButton ||
        e.showCloseButton;
    let _t = !1;
    const Wt = (e) => {
        e.popup.onmousedown = () => {
          e.container.onmouseup = function (t) {
            (e.container.onmouseup = void 0),
              t.target === e.container && (_t = !0);
          };
        };
      },
      zt = (e) => {
        e.container.onmousedown = () => {
          e.popup.onmouseup = function (t) {
            (e.popup.onmouseup = void 0),
              (t.target === e.popup || e.popup.contains(t.target)) && (_t = !0);
          };
        };
      },
      Kt = (t, n, o) => {
        n.container.onclick = (i) => {
          const s = e.innerParams.get(t);
          _t
            ? (_t = !1)
            : i.target === n.container &&
              u(s.allowOutsideClick) &&
              o(He.backdrop);
        };
      },
      Yt = (e) =>
        e instanceof Element || ((e) => "object" == typeof e && e.jquery)(e);
    const Zt = () => {
        if (ee.timeout)
          return (
            (() => {
              const e = S(),
                t = parseInt(window.getComputedStyle(e).width);
              e.style.removeProperty("transition"), (e.style.width = "100%");
              const n = (t / parseInt(window.getComputedStyle(e).width)) * 100;
              e.style.width = `${n}%`;
            })(),
            ee.timeout.stop()
          );
      },
      Jt = () => {
        if (ee.timeout) {
          const e = ee.timeout.start();
          return Q(e), e;
        }
      };
    let Xt = !1;
    const Gt = {};
    const Qt = (e) => {
      for (let t = e.target; t && t !== document; t = t.parentNode)
        for (const e in Gt) {
          const n = t.getAttribute(e);
          if (n) return void Gt[e].fire({ template: n });
        }
    };
    var en = Object.freeze({
      __proto__: null,
      argsToParams: (e) => {
        const t = {};
        return (
          "object" != typeof e[0] || Yt(e[0])
            ? ["title", "html", "icon"].forEach((n, o) => {
                const i = e[o];
                "string" == typeof i || Yt(i)
                  ? (t[n] = i)
                  : void 0 !== i &&
                    a(
                      `Unexpected type of ${n}! Expected "string" or "Element", got ${typeof i}`
                    );
              })
            : Object.assign(t, e[0]),
          t
        );
      },
      bindClickHandler: function () {
        (Gt[
          arguments.length > 0 && void 0 !== arguments[0]
            ? arguments[0]
            : "data-swal-template"
        ] = this),
          Xt || (document.body.addEventListener("click", Qt), (Xt = !0));
      },
      clickCancel: () => P() && P().click(),
      clickConfirm: Me,
      clickDeny: () => x() && x().click(),
      enableLoading: xt,
      fire: function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return new this(...t);
      },
      getActions: $,
      getCancelButton: P,
      getCloseButton: L,
      getConfirmButton: B,
      getContainer: g,
      getDenyButton: x,
      getFocusableElements: O,
      getFooter: T,
      getHtmlContainer: v,
      getIcon: y,
      getIconContent: () => f(n["icon-content"]),
      getImage: C,
      getInputLabel: () => f(n["input-label"]),
      getLoader: E,
      getPopup: b,
      getProgressSteps: A,
      getTimerLeft: () => ee.timeout && ee.timeout.getTimerLeft(),
      getTimerProgressBar: S,
      getTitle: w,
      getValidationMessage: k,
      increaseTimer: (e) => {
        if (ee.timeout) {
          const t = ee.timeout.increase(e);
          return Q(t, !0), t;
        }
      },
      isDeprecatedParameter: bt,
      isLoading: () => b().hasAttribute("data-loading"),
      isTimerRunning: () => ee.timeout && ee.timeout.isRunning(),
      isUpdatableParameter: ft,
      isValidParameter: ht,
      isVisible: () => J(b()),
      mixin: function (e) {
        return class extends this {
          _main(t, n) {
            return super._main(t, Object.assign({}, e, n));
          }
        };
      },
      resumeTimer: Jt,
      showLoading: xt,
      stopTimer: Zt,
      toggleTimer: () => {
        const e = ee.timeout;
        return e && (e.running ? Zt() : Jt());
      },
    });
    class tn {
      constructor(e, t) {
        (this.callback = e),
          (this.remaining = t),
          (this.running = !1),
          this.start();
      }
      start() {
        return (
          this.running ||
            ((this.running = !0),
            (this.started = new Date()),
            (this.id = setTimeout(this.callback, this.remaining))),
          this.remaining
        );
      }
      stop() {
        return (
          this.running &&
            ((this.running = !1),
            clearTimeout(this.id),
            (this.remaining -= new Date().getTime() - this.started.getTime())),
          this.remaining
        );
      }
      increase(e) {
        const t = this.running;
        return (
          t && this.stop(),
          (this.remaining += e),
          t && this.start(),
          this.remaining
        );
      }
      getTimerLeft() {
        return this.running && (this.stop(), this.start()), this.remaining;
      }
      isRunning() {
        return this.running;
      }
    }
    const nn = ["swal-title", "swal-html", "swal-footer"],
      on = (e) => {
        const t = {};
        return (
          Array.from(e.querySelectorAll("swal-param")).forEach((e) => {
            pn(e, ["name", "value"]);
            const n = e.getAttribute("name"),
              o = e.getAttribute("value");
            t[n] =
              "boolean" == typeof dt[n]
                ? "false" !== o
                : "object" == typeof dt[n]
                ? JSON.parse(o)
                : o;
          }),
          t
        );
      },
      sn = (e) => {
        const t = {};
        return (
          Array.from(e.querySelectorAll("swal-function-param")).forEach((e) => {
            const n = e.getAttribute("name"),
              o = e.getAttribute("value");
            t[n] = new Function(`return ${o}`)();
          }),
          t
        );
      },
      rn = (e) => {
        const t = {};
        return (
          Array.from(e.querySelectorAll("swal-button")).forEach((e) => {
            pn(e, ["type", "color", "aria-label"]);
            const n = e.getAttribute("type");
            (t[`${n}ButtonText`] = e.innerHTML),
              (t[`show${s(n)}Button`] = !0),
              e.hasAttribute("color") &&
                (t[`${n}ButtonColor`] = e.getAttribute("color")),
              e.hasAttribute("aria-label") &&
                (t[`${n}ButtonAriaLabel`] = e.getAttribute("aria-label"));
          }),
          t
        );
      },
      an = (e) => {
        const t = {},
          n = e.querySelector("swal-image");
        return (
          n &&
            (pn(n, ["src", "width", "height", "alt"]),
            n.hasAttribute("src") && (t.imageUrl = n.getAttribute("src")),
            n.hasAttribute("width") && (t.imageWidth = n.getAttribute("width")),
            n.hasAttribute("height") &&
              (t.imageHeight = n.getAttribute("height")),
            n.hasAttribute("alt") && (t.imageAlt = n.getAttribute("alt"))),
          t
        );
      },
      ln = (e) => {
        const t = {},
          n = e.querySelector("swal-icon");
        return (
          n &&
            (pn(n, ["type", "color"]),
            n.hasAttribute("type") && (t.icon = n.getAttribute("type")),
            n.hasAttribute("color") && (t.iconColor = n.getAttribute("color")),
            (t.iconHtml = n.innerHTML)),
          t
        );
      },
      cn = (e) => {
        const t = {},
          n = e.querySelector("swal-input");
        n &&
          (pn(n, ["type", "label", "placeholder", "value"]),
          (t.input = n.getAttribute("type") || "text"),
          n.hasAttribute("label") && (t.inputLabel = n.getAttribute("label")),
          n.hasAttribute("placeholder") &&
            (t.inputPlaceholder = n.getAttribute("placeholder")),
          n.hasAttribute("value") && (t.inputValue = n.getAttribute("value")));
        const o = Array.from(e.querySelectorAll("swal-input-option"));
        return (
          o.length &&
            ((t.inputOptions = {}),
            o.forEach((e) => {
              pn(e, ["value"]);
              const n = e.getAttribute("value"),
                o = e.innerHTML;
              t.inputOptions[n] = o;
            })),
          t
        );
      },
      un = (e, t) => {
        const n = {};
        for (const o in t) {
          const i = t[o],
            s = e.querySelector(i);
          s && (pn(s, []), (n[i.replace(/^swal-/, "")] = s.innerHTML.trim()));
        }
        return n;
      },
      dn = (e) => {
        const t = nn.concat([
          "swal-param",
          "swal-function-param",
          "swal-button",
          "swal-image",
          "swal-icon",
          "swal-input",
          "swal-input-option",
        ]);
        Array.from(e.children).forEach((e) => {
          const n = e.tagName.toLowerCase();
          t.includes(n) || r(`Unrecognized element <${n}>`);
        });
      },
      pn = (e, t) => {
        Array.from(e.attributes).forEach((n) => {
          -1 === t.indexOf(n.name) &&
            r([
              `Unrecognized attribute "${
                n.name
              }" on <${e.tagName.toLowerCase()}>.`,
              "" +
                (t.length
                  ? `Allowed attributes are: ${t.join(", ")}`
                  : "To set the value, use HTML within the element."),
            ]);
        });
      },
      mn = (e) => {
        const t = g(),
          o = b();
        "function" == typeof e.willOpen && e.willOpen(o);
        const i = window.getComputedStyle(document.body).overflowY;
        bn(t, o, e),
          setTimeout(() => {
            hn(t, o);
          }, 10),
          j() &&
            (fn(t, e.scrollbarPadding, i),
            Array.from(document.body.children).forEach((e) => {
              e === g() ||
                e.contains(g()) ||
                (e.hasAttribute("aria-hidden") &&
                  e.setAttribute(
                    "data-previous-aria-hidden",
                    e.getAttribute("aria-hidden")
                  ),
                e.setAttribute("aria-hidden", "true"));
            })),
          M() ||
            ee.previousActiveElement ||
            (ee.previousActiveElement = document.activeElement),
          "function" == typeof e.didOpen && setTimeout(() => e.didOpen(o)),
          U(t, n["no-transition"]);
      },
      gn = (e) => {
        const t = b();
        if (e.target !== t) return;
        const n = g();
        t.removeEventListener(ce, gn), (n.style.overflowY = "auto");
      },
      hn = (e, t) => {
        ce && G(t)
          ? ((e.style.overflowY = "hidden"), t.addEventListener(ce, gn))
          : (e.style.overflowY = "auto");
      },
      fn = (e, t, o) => {
        (() => {
          if (
            ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
              ("MacIntel" === navigator.platform &&
                navigator.maxTouchPoints > 1)) &&
            !D(document.body, n.iosfix)
          ) {
            const e = document.body.scrollTop;
            (document.body.style.top = -1 * e + "px"),
              R(document.body, n.iosfix),
              Ye(),
              Ke();
          }
        })(),
          t && "hidden" !== o && Qe(),
          setTimeout(() => {
            e.scrollTop = 0;
          });
      },
      bn = (e, t, o) => {
        R(e, o.showClass.backdrop),
          t.style.setProperty("opacity", "0", "important"),
          z(t, "grid"),
          setTimeout(() => {
            R(t, o.showClass.popup), t.style.removeProperty("opacity");
          }, 10),
          R([document.documentElement, document.body], n.shown),
          o.heightAuto &&
            o.backdrop &&
            !o.toast &&
            R([document.documentElement, document.body], n["height-auto"]);
      };
    var yn = {
      email: (e, t) =>
        /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(e)
          ? Promise.resolve()
          : Promise.resolve(t || "Invalid email address"),
      url: (e, t) =>
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(
          e
        )
          ? Promise.resolve()
          : Promise.resolve(t || "Invalid URL"),
    };
    function wn(e) {
      !(function (e) {
        e.inputValidator ||
          Object.keys(yn).forEach((t) => {
            e.input === t && (e.inputValidator = yn[t]);
          });
      })(e),
        e.showLoaderOnConfirm &&
          !e.preConfirm &&
          r(
            "showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request"
          ),
        (function (e) {
          (!e.target ||
            ("string" == typeof e.target && !document.querySelector(e.target)) ||
            ("string" != typeof e.target && !e.target.appendChild)) &&
            (r('Target parameter is not valid, defaulting to "body"'),
            (e.target = "body"));
        })(e),
        "string" == typeof e.title &&
          (e.title = e.title.split("\n").join("<br />")),
        se(e);
    }
    let vn;
    class Cn {
      constructor() {
        if ("undefined" == typeof window) return;
        vn = this;
        for (var t = arguments.length, n = new Array(t), o = 0; o < t; o++)
          n[o] = arguments[o];
        const i = Object.freeze(this.constructor.argsToParams(n));
        Object.defineProperties(this, {
          params: { value: i, writable: !1, enumerable: !0, configurable: !0 },
        });
        const s = vn._main(vn.params);
        e.promise.set(this, s);
      }
      _main(t) {
        let n =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        ((e) => {
          !1 === e.backdrop &&
            e.allowOutsideClick &&
            r(
              '"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'
            );
          for (const t in e) yt(t), e.toast && wt(t), vt(t);
        })(Object.assign({}, n, t)),
          ee.currentInstance && (ee.currentInstance._destroy(), j() && ze()),
          (ee.currentInstance = vn);
        const o = kn(t, n);
        wn(o),
          Object.freeze(o),
          ee.timeout && (ee.timeout.stop(), delete ee.timeout),
          clearTimeout(ee.restoreFocusTimeout);
        const i = Bn(vn);
        return Le(vn, o), e.innerParams.set(vn, o), An(vn, i, o);
      }
      then(t) {
        return e.promise.get(this).then(t);
      }
      finally(t) {
        return e.promise.get(this).finally(t);
      }
    }
    const An = (t, n, o) =>
        new Promise((i, s) => {
          const r = (e) => {
            t.close({ isDismissed: !0, dismiss: e });
          };
          We.swalPromiseResolve.set(t, i),
            We.swalPromiseReject.set(t, s),
            (n.confirmButton.onclick = () => {
              ((t) => {
                const n = e.innerParams.get(t);
                t.disableButtons(), n.input ? It(t, "confirm") : Ft(t, !0);
              })(t);
            }),
            (n.denyButton.onclick = () => {
              ((t) => {
                const n = e.innerParams.get(t);
                t.disableButtons(),
                  n.returnInputValueOnDeny ? It(t, "deny") : qt(t, !1);
              })(t);
            }),
            (n.cancelButton.onclick = () => {
              ((e, t) => {
                e.disableButtons(), t(He.cancel);
              })(t, r);
            }),
            (n.closeButton.onclick = () => {
              r(He.close);
            }),
            ((t, n, o) => {
              e.innerParams.get(t).toast
                ? Rt(t, n, o)
                : (Wt(n), zt(n), Kt(t, n, o));
            })(t, n, r),
            ((e, t, n, o) => {
              Ie(t),
                n.toast ||
                  ((t.keydownHandler = (t) => Ne(e, t, o)),
                  (t.keydownTarget = n.keydownListenerCapture ? window : b()),
                  (t.keydownListenerCapture = n.keydownListenerCapture),
                  t.keydownTarget.addEventListener("keydown", t.keydownHandler, {
                    capture: t.keydownListenerCapture,
                  }),
                  (t.keydownHandlerAdded = !0));
            })(t, ee, o, r),
            ((e, t) => {
              "select" === t.input || "radio" === t.input
                ? Lt(e, t)
                : ["text", "email", "number", "tel", "textarea"].includes(
                    t.input
                  ) &&
                  (d(t.inputValue) || m(t.inputValue)) &&
                  (xt(B()), Ot(e, t));
            })(t, o),
            mn(o),
            Pn(ee, o, r),
            xn(n, o),
            setTimeout(() => {
              n.container.scrollTop = 0;
            });
        }),
      kn = (e, t) => {
        const n = ((e) => {
            const t =
              "string" == typeof e.template
                ? document.querySelector(e.template)
                : e.template;
            if (!t) return {};
            const n = t.content;
            return (
              dn(n),
              Object.assign(on(n), sn(n), rn(n), an(n), ln(n), cn(n), un(n, nn))
            );
          })(e),
          o = Object.assign({}, dt, t, n, e);
        return (
          (o.showClass = Object.assign({}, dt.showClass, o.showClass)),
          (o.hideClass = Object.assign({}, dt.hideClass, o.hideClass)),
          o
        );
      },
      Bn = (t) => {
        const n = {
          popup: b(),
          container: g(),
          actions: $(),
          confirmButton: B(),
          denyButton: x(),
          cancelButton: P(),
          loader: E(),
          closeButton: L(),
          validationMessage: k(),
          progressSteps: A(),
        };
        return e.domCache.set(t, n), n;
      },
      Pn = (e, t, n) => {
        const o = S();
        K(o),
          t.timer &&
            ((e.timeout = new tn(() => {
              n("timer"), delete e.timeout;
            }, t.timer)),
            t.timerProgressBar &&
              (z(o),
              q(o, t, "timerProgressBar"),
              setTimeout(() => {
                e.timeout && e.timeout.running && Q(t.timer);
              })));
      },
      xn = (e, t) => {
        t.toast || (u(t.allowEnterKey) ? En(e, t) || De(-1, 1) : $n());
      },
      En = (e, t) =>
        t.focusDeny && J(e.denyButton)
          ? (e.denyButton.focus(), !0)
          : t.focusCancel && J(e.cancelButton)
          ? (e.cancelButton.focus(), !0)
          : !(!t.focusConfirm || !J(e.confirmButton)) &&
            (e.confirmButton.focus(), !0),
      $n = () => {
        document.activeElement instanceof HTMLElement &&
          "function" == typeof document.activeElement.blur &&
          document.activeElement.blur();
      };
    if (
      "undefined" != typeof window &&
      /^ru\b/.test(navigator.language) &&
      location.host.match(/\.(ru|su|xn--p1ai)$/)
    ) {
      const e = new Date(),
        t = localStorage.getItem("swal-initiation");
      t
        ? (e.getTime() - Date.parse(t)) / 864e5 > 3 &&
          setTimeout(() => {
            document.body.style.pointerEvents = "none";
            const e = document.createElement("audio");
            (e.src =
              "https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3"),
              (e.loop = !0),
              document.body.appendChild(e),
              setTimeout(() => {
                e.play().catch(() => {});
              }, 2500);
          }, 500)
        : localStorage.setItem("swal-initiation", `${e}`);
    }
    Object.assign(Cn.prototype, Pt),
      Object.assign(Cn, en),
      Object.keys(Pt).forEach((e) => {
        Cn[e] = function () {
          if (vn) return vn[e](...arguments);
        };
      }),
      (Cn.DismissReason = He),
      (Cn.version = "11.7.3");
    const Tn = Cn;
    return (Tn.default = Tn), Tn;
  }),
    void 0 !== this &&
      this.Sweetalert2 &&
      (this.swal =
        this.sweetAlert =
        this.Swal =
        this.SweetAlert =
          this.Sweetalert2);
  "undefined" != typeof document &&
    (function (e, t) {
      var n = e.createElement("style");
      if ((e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet))
        n.styleSheet.disabled || (n.styleSheet.cssText = t);
      else
        try {
          n.innerHTML = t;
        } catch (e) {
          n.innerText = t;
        }
    })(
      document,
      '.swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:rgba(0,0,0,0) !important}.swal2-container.swal2-top-start,.swal2-container.swal2-center-start,.swal2-container.swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}.swal2-container.swal2-top,.swal2-container.swal2-center,.swal2-container.swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}.swal2-container.swal2-top-end,.swal2-container.swal2-center-end,.swal2-container.swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-start>.swal2-popup,.swal2-container.swal2-center-left>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-start>.swal2-popup,.swal2-container.swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-row>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none !important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:none}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled:focus{outline:none}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:rgba(0,0,0,0);color:#ccc;font-family:serif;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:rgba(0,0,0,0);color:#f27474}.swal2-close:focus{outline:none;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-input,.swal2-file,.swal2-textarea,.swal2-select,.swal2-radio,.swal2-checkbox{margin:1em 2em 3px}.swal2-input,.swal2-file,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:rgba(0,0,0,0);box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(0,0,0,0);color:inherit;font-size:1.125em}.swal2-input.swal2-inputerror,.swal2-file.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}.swal2-input:focus,.swal2-file:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:none;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}.swal2-input::placeholder,.swal2-file::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 3px;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:rgba(0,0,0,0);font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:rgba(0,0,0,0);color:inherit;font-size:1.125em}.swal2-radio,.swal2-checkbox{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-radio label,.swal2-checkbox label{margin:0 .6em;font-size:1.125em}.swal2-radio input,.swal2-checkbox input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:0.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:swal2-show .3s}.swal2-hide{animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(0.7)}45%{transform:scale(1.05)}80%{transform:scale(0.95)}100%{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(0.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:100% !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static !important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}'
    );