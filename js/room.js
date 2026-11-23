// Fills an inner page from window.SITE (js/data.js).
(() => {
  const S = window.SITE;
  const room = document.body.dataset.room;
  const root = document.getElementById("content");

  function el(tag, props = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
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

    lab() {
      root.append(
        el("div", { class: "experiments" },
          (S.lab || []).map((x, i) =>
            el("article", { class: "experiment" },
              el("div", { class: "exp-id" }, `EXP-${String(i + 1).padStart(2, "0")}`),
              el("h2", {}, x.name),
              el("p", {}, x.blurb),
              el("ul", { class: "tags" }, x.stack.map((t) => el("li", {}, t))),
              x.links && el("div", { class: "card-links" }, x.links.map((l) => el("a", ext(l.href), l.label + " ↗")))
            )
          )
        )
      );
      if (S.certifications?.length) {
        root.append(
          el("section", { class: "certs" },
            el("h2", {}, "Certifications"),
            el("ul", {}, S.certifications.map((c) => el("li", {}, c))))
        );
      }
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
            el("button", { type: "submit" }, "Send via email →")),
          el("div", { class: "elsewhere" }, S.links.map((l) => el("a", ext(l.href), l.label)))
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
