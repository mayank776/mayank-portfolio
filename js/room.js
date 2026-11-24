// Fills an inner page from window.SITE (js/data.js).
(() => {
  const S = window.SITE;
  const room = document.body.dataset.room;
  const root = document.getElementById("content");

  function el(tag, props = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "style") n.setAttribute("style", v);
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    for (const c of kids.flat()) {
      if (c == null || c === false) continue;
      n.append(c.nodeType ? c : String(c));
    }
    return n;
  }
  const ext = (href) => (/^https?:/.test(href) ? { href, target: "_blank", rel: "noopener" } : { href });

  const render = {
    projects() {
      root.append(
        el("div", { class: "cards" },
          S.projects.map((p) =>
            el("article", { class: "card" },
              el("div", { class: "card-top" },
                el("span", { class: "chip" + (/progress|wip|beta/i.test(p.status) ? " wip" : "") }, p.status),
                el("span", {}, p.year)),
              el("h2", {}, p.name),
              el("p", {}, p.blurb),
              el("ul", { class: "tags" }, p.tags.map((t) => el("li", {}, t))),
              el("div", { class: "card-links" }, (p.links || []).map((l) => el("a", ext(l.href), l.label + " ↗")))
            )
          )
        )
      );
    },

    work() {
      root.append(
        el("ol", { class: "jobs" },
          S.experience.map((j) =>
            el("li", { class: "job" },
              el("div", { class: "period" }, j.period),
              el("div", {},
                el("h2", {}, j.role),
                el("div", { class: "org" }, "@ " + j.org),
                j.note && el("p", { class: "nda" }, j.note),
                el("ul", {}, j.points.map((p) => el("li", {}, p))))
            )
          )
        )
      );
      if (S.education) {
        root.append(
          el("section", { class: "edu" },
            el("h2", {}, "Education"),
            el("p", {}, S.education.degree),
            el("p", { class: "org" }, `${S.education.school} · ${S.education.period}`))
        );
      }
    },

    // The Lab: one tab per idea; inside, step through short cards.
    // Keys: ← → move between steps, 1–9 jump to an idea. The idea is kept in the URL (#id).
    lab() {
      const topics = S.lab || [];
      if (!topics.length) return;
      const pad = (n) => String(n).padStart(2, "0");
      let t = Math.max(0, topics.findIndex((x) => "#" + x.id === location.hash));
      let step = 0;

      const tabs = topics.map((x, i) =>
        el("button", {
          type: "button", role: "tab", class: "topic-tab", style: `--tc:${x.color}`, id: "tab-" + x.id,
          onclick: () => pick(i),
        },
          el("span", { class: "tt-num" }, pad(i + 1)),
          el("span", { class: "tt-title" }, x.title),
          el("span", { class: "tt-hook" }, x.hook),
          el("span", { class: "tt-count" }, `${x.steps.length} steps →`)));
      const panel = el("article", { class: "topic", role: "tabpanel", "aria-live": "polite" });
      root.append(el("div", { class: "topic-tabs", role: "tablist", "aria-label": "Ideas" }, tabs), panel);

      function pick(i, keepStep) {
        t = i;
        if (!keepStep) step = 0;
        tabs.forEach((b, j) => { b.setAttribute("aria-selected", String(j === i)); b.tabIndex = j === i ? 0 : -1; });
        history.replaceState(null, "", "#" + topics[i].id);
        draw();
      }

      function draw() {
        const x = topics[t], s = x.steps[step], n = x.steps.length;
        panel.style.setProperty("--tc", x.color);
        panel.setAttribute("aria-labelledby", "tab-" + x.id);
        panel.replaceChildren(
          el("header", { class: "topic-head" },
            el("p", { class: "topic-src" }, "from ", el("a", ext(x.source.href), x.source.title), ` · ${x.source.by}`),
            el("h2", {}, x.title),
            el("p", { class: "topic-hook" }, x.hook)),
          el("ol", { class: "rail" }, x.steps.map((st, i) =>
            el("li", {},
              el("button", {
                type: "button", class: "rail-step" + (i < step ? " seen" : ""), "aria-current": i === step ? "step" : null,
                onclick: () => { step = i; draw(); },
              }, el("b", {}, pad(i + 1)), el("span", {}, st.name))))),
          el("div", { class: "step-card" },
            el("div", { class: "sc-meta" },
              el("span", {}, `STEP ${pad(step + 1)} / ${pad(n)}`),
              el("span", { class: "sc-bar", "aria-hidden": "true" }, el("i", { style: `width:${((step + 1) / n) * 100}%` }))),
            el("h3", {}, s.name),
            el("p", {}, s.blurb),
            el("ul", { class: "tags" }, s.tags.map((tag) => el("li", {}, tag))),
            el("div", { class: "sc-nav" },
              el("button", { type: "button", class: "sc-btn", disabled: step === 0 ? "" : null, onclick: () => go(-1) }, "← prev"),
              step < n - 1
                ? el("button", { type: "button", class: "sc-btn primary", onclick: () => go(1) }, "next →")
                : el("button", { type: "button", class: "sc-btn primary", onclick: () => panel.querySelector(".vision").scrollIntoView({ behavior: "smooth", block: "center" }) }, "the bigger picture ↓"))),
          x.try && el("div", { class: "try" },
            el("span", {}, "try it"),
            el("code", {}, "$ " + x.try),
            el("button", {
              type: "button", class: "copy",
              onclick: (e) => {
                navigator.clipboard?.writeText(x.try).then(
                  () => { e.target.textContent = "copied ✓"; setTimeout(() => (e.target.textContent = "copy"), 1600); },
                  () => {});
              },
            }, "copy")),
          el("section", { class: "vision" },
            el("h2", {}, "the bigger picture"),
            el("p", {}, x.vision),
            el("a", { class: "watch", ...ext(x.source.href) }, `${x.source.cta || "Learn more"} ↗`))
        );
      }

      function go(d) {
        const n = topics[t].steps.length;
        step = Math.min(n - 1, Math.max(0, step + d));
        draw();
      }

      addEventListener("keydown", (e) => {
        if (e.target.closest("input, textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        else if (/^[1-9]$/.test(e.key) && topics[+e.key - 1]) pick(+e.key - 1);
      });
      addEventListener("hashchange", () => {
        const i = topics.findIndex((x) => "#" + x.id === location.hash);
        if (i >= 0 && i !== t) pick(i);
      });

      pick(t);
    },

    toolkit() {
      let i = 0;
      const tilt = () => `--r:${[-2, 1.5, -1, 2, 0.5, -1.5][i++ % 6]}deg`;
      root.append(
        el("div", { class: "groups" },
          S.toolkit.map((g) =>
            el("section", { class: "group" },
              el("h2", {}, g.group),
              el("ul", { class: "stickers" }, g.items.map((t) => el("li", { style: tilt() }, t))))
          )
        )
      );
    },

    contact() {
      const name = el("input", { id: "c-name", autocomplete: "name", placeholder: "Your name" });
      const msg = el("textarea", { id: "c-msg", placeholder: "What are we building?" });
      root.append(
        el("div", { class: "letter" },
          el("h2", {}, "Let’s build something."),
          el("p", {}, "Have a product idea, an integration that keeps breaking, or a role you think I’d fit? Write to me — I reply to everything."),
          el("a", { class: "mail-btn", href: "mailto:" + S.email }, S.email),
          el("ul", { class: "details", "aria-label": "Contact details" },
            [
              S.phone && { k: "Phone", v: S.phone, href: "tel:" + S.phone.replace(/[^\d+]/g, "") },
              { k: "Email", v: S.email, href: "mailto:" + S.email },
              ...S.links.map((l) => ({ k: l.label, v: l.handle || l.href.replace(/^https?:\/\/(www\.)?/, ""), href: l.href })),
            ].filter(Boolean).map((d) => el("li", {}, el("span", {}, d.k), el("a", ext(d.href), d.v)))),
          el("form", {
              class: "compose",
              onsubmit: (e) => {
                e.preventDefault();
                const subject = encodeURIComponent("Hello from " + (name.value.trim() || "your website"));
                const body = encodeURIComponent(msg.value);
                location.href = `mailto:${S.email}?subject=${subject}&body=${body}`;
              },
            },
            el("label", { for: "c-name" }, "from:"), name,
            el("label", { for: "c-msg" }, "message:"), msg,
            el("button", { type: "submit" }, "Send via email →"))
        )
      );
    },
  };

  render[room]?.();

  // Esc closes the box and goes back to the stack.
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !e.target.closest("input, textarea")) location.href = "index.html";
  });
})();
