// The home's other views, built from the same five sections:
// rack · floppies · keyboard · circuit · windows (the boxes are in index.html).
// Also: the view switcher, orbit-dragging for the views that don't turn or
// lift, typing on the keyboard view, and lighting circuit traces.
// Runs before twist.js / lift.js so they find these views' boxes too.
(() => {
  const home = document.querySelector(".home");
  if (!home) return;
  const SITE = window.SITE || { projects: [], experience: [], toolkit: [] };

  const SECTIONS = [
    { id: "projects", label: "Projects", href: "projects.html", c: "var(--c-projects)", a: "var(--gold)" },
    { id: "work", label: "Experience", href: "work.html", c: "var(--c-work)", a: "#e98b78" },
    { id: "toolkit", label: "Toolkit", href: "toolkit.html", c: "var(--c-toolkit)", a: "#c79bd0" },
    { id: "lab", label: "Lab", href: "lab.html", c: "var(--c-lab)", a: "#f0a35e" },
    { id: "contact", label: "Contact", href: "contact.html", c: "var(--c-contact)", a: "#8fb3d9" },
  ];
  const sec = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const rep = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join("");

  // One six-faced box. Links open a section; the lab is a sealed button;
  // tag "div"/"span" makes a non-interactive part (a plate, a board).
  function box({ s, cls, vars = "", note, faces = {}, tag, label, attrs = "" }) {
    const t = tag || (s ? (s.sealed ? "button" : "a") : "div");
    const open =
      t === "a" ? `href="${s.href}" aria-label="${esc(label || s.label)}"`
      : t === "button" ? `type="button" aria-label="${esc((label || s.label) + " — sealed, still in development")}" data-sealed=""`
      : `aria-hidden="true"`;
    const f = (k) => `<span class="face f-${k}">${faces[k] || ""}</span>`;
    return `<${t} class="box ${cls}" ${open} style="${vars}"${note ? ` data-note="${esc(note)}"` : ""} ${attrs}>` +
      ["front", "back", "left", "right", "top", "bottom"].map(f).join("") + `</${t}>`;
  }
  const ground = (shadow = "") => `<div class="ground" aria-hidden="true"></div><div class="shadow" aria-hidden="true" style="${shadow}"></div>`;

  // ---------------------------------------------------------------- rack
  function rack() {
    const units = [ // top to bottom
      { s: sec.projects, y: 112, u: 2, host: "prod-01", note: "uptime: since forever (probably)" },
      { s: sec.work, y: 84, u: 1, host: "hist-02", note: "maintained by: me" },
      { s: sec.toolkit, y: 56, u: 1, host: "tools-03", note: "warranty void if opened" },
      { s: sec.lab, y: 28, u: 1, host: "lab-04", note: "experimental — results may vary" },
      { s: sec.contact, y: 0, u: 1, host: "sw-01", note: "port 25 is open for you" },
    ];
    const ear = `<span class="ear"><i></i><i></i></span>`;
    return ground() + units.map(({ s, y, u, host, note }, i) => {
      const middle =
        s.id === "projects" ? `<span class="bays">${rep(4, (k) => `<i style="--dl:${k * 0.37}s"></i>`)}</span><span class="vent"></span>`
        : s.id === "contact" ? `<span class="ports">${rep(12, (k) => `<i class="${k % 3 ? "" : "on"}" style="--dl:${(k * 0.23) % 1}s"></i>`)}</span><span class="vent"></span>`
        : s.id === "lab" ? `<span class="vent"></span><span class="offline beta">AI · BETA</span>`
        : `<span class="vent"></span>`;
      const leds = `<i class="led"></i><i class="led act" style="--dl:${i * 0.3}s"></i>`;
      return box({
        s, cls: "rack", note,
        vars: `--a:${s.a};--y:${y};--h:calc(${28 * u} * var(--u));--i:${4 - i}`,
        faces: {
          front: `${ear}<span class="leds">${leds}</span>${middle}<span class="tag">${s.label.toUpperCase()}<small>${host}</small></span>${ear}`,
          top: i === 0 ? `<span class="asset">MAYANK · HOMELAB · R01</span>` : "",
        },
      });
    }).join("");
  }

  // ------------------------------------------------------------ floppies
  function floppies() {
    const disks = [
      { s: sec.projects, x: -150, z: -78, turn: -6, name: "projects_final_v2", note: "backup of a backup" },
      { s: sec.work, x: 0, z: -84, turn: 3, name: "experience.log", note: "rewind before returning" },
      { s: sec.toolkit, x: 150, z: -74, turn: 8, name: "toolkit.tar.gz", note: "contains: everything I reach for" },
      { s: sec.lab, x: -78, z: 72, turn: -4, name: "big_ideas", note: "experimental — handle with care" },
      { s: sec.contact, x: 78, z: 70, turn: 5, name: "say_hello.eml", note: "insert to reply" },
    ];
    return ground("--sw:520;--sd:340") + disks.map(({ s, x, z, turn, name, note }, i) => box({
      s, cls: "floppy", note,
      vars: `--c:${s.c};--x:${x};--z:${z};--turn:${turn}deg;--i:${i}`,
      faces: {
        top:
          `<span class="flabel"><b>${esc(name)}</b><small>${s.label.toUpperCase()} · 1.44 MB</small></span>` +
          (s.sealed ? `<span class="wpstamp">WRITE PROTECTED</span>` : "") +
          `<span class="shutter"><i></i></span><span class="fhole"></span><span class="fhole wp${s.sealed ? " open" : ""}"></span>`,
      },
    })).join("");
  }

  // ------------------------------------------------------------ keyboard
  function keyboard() {
    const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    const shift = [0, 9.5, 28.5];
    const zRow = [-57, -19, 19];
    const map = { p: sec.projects, e: sec.work, t: sec.toolkit, l: sec.lab, c: sec.contact };
    let n = 0;
    const key = (ch, x, z) => {
      const s = map[ch];
      const vars = `--x:${x};--z:${z};--i:${(n++ * 0.12).toFixed(2)}` + (s ? `;--c:${s.c}` : "");
      const top = `<b>${ch.toUpperCase()}</b>${s ? `<small>${s.label.toLowerCase()}</small>` : ""}`;
      return s
        ? box({ s, cls: "key sk", vars, faces: { top }, attrs: `data-key="${ch}"`, label: `${s.label} (press ${ch.toUpperCase()})` })
        : box({ tag: "span", cls: "key", vars, faces: { top }, attrs: `data-key="${ch}"` });
    };
    const plate = box({
      tag: "div", cls: "plate static", vars: "--i:0",
      faces: { front: `<span class="kb-leds"><i></i><i class="on"></i><i></i></span><span class="kb-name">MAYANK · KB-26</span>` },
    });
    const keys = rows.map((r, ri) => [...r].map((ch, ci) => key(ch, -171 + shift[ri] + ci * 38, zRow[ri])).join("")).join("");
    const space = box({ tag: "span", cls: "key space", vars: `--x:9;--z:57;--i:${(n * 0.12).toFixed(2)}`, faces: { top: `<small>mayank attri</small>` }, attrs: `data-key=" "` });
    return ground("--sw:520;--sd:300") + plate + keys + space;
  }

  // ------------------------------------------------------------- circuit
  function circuit() {
    const chips = [
      { s: sec.projects, sx: 90, sy: 66, part: "PRJ-01" },
      { s: sec.work, sx: 310, sy: 66, part: "EXP-02" },
      { s: sec.toolkit, sx: 74, sy: 196, part: "TLK-03" },
      { s: sec.lab, sx: 326, sy: 196, part: "AI-04" },
      { s: sec.contact, sx: 200, sy: 238, part: "TX/RX-05" },
    ];
    const CX = 200, CY = 128;
    const sgn = Math.sign;
    let svg = "";
    // traces: a short bus from the CPU to each chip, straight then 45°
    for (const { s, sx, sy } of chips) {
      const dx = sx - CX, dy = sy - CY, m = Math.min(Math.abs(dx), Math.abs(dy));
      const horiz = Math.abs(dx) >= Math.abs(dy);
      for (const o of [-6, 0, 6]) {
        const [x0, y0] = horiz ? [CX, CY + o] : [CX + o, CY];
        const [x1, y1] = horiz ? [CX + dx - sgn(dx) * m, CY + o] : [CX + o, CY + dy - sgn(dy) * m];
        const [x2, y2] = horiz ? [sx, sy + o] : [sx + o, sy];
        svg += `<path class="trace${s.sealed ? " broken" : ""}" data-for="${s.id}" d="M${x0} ${y0}L${x1} ${y1}L${x2} ${y2}"/>`;
        svg += `<circle class="via" cx="${x1}" cy="${y1}" r="2.2"/>`;
      }
      // pins along the chip's long edges
      for (let k = -28; k <= 28; k += 8) svg += `<rect class="pin" x="${sx + k - 1.5}" y="${sy - 27}" width="3" height="5"/><rect class="pin" x="${sx + k - 1.5}" y="${sy + 22}" width="3" height="5"/>`;
    }
    for (let k = -36; k <= 36; k += 8) {
      svg += `<rect class="pin" x="${CX + k - 1.5}" y="${CY - 49}" width="3" height="5"/><rect class="pin" x="${CX + k - 1.5}" y="${CY + 44}" width="3" height="5"/>`;
      svg += `<rect class="pin" x="${CX - 49}" y="${CY + k - 1.5}" width="5" height="3"/><rect class="pin" x="${CX + 44}" y="${CY + k - 1.5}" width="5" height="3"/>`;
    }
    svg += [[14, 14], [386, 14], [14, 266], [386, 266]].map(([x, y]) => `<circle class="hole" cx="${x}" cy="${y}" r="6"/>`).join("");
    svg += `<text class="silk" x="26" y="270">MAYANK-ATTRI · REV 2026 · MADE WITH HTML/CSS/JS</text>`;
    svg += chips.map(({ sx, sy }, i) => `<text class="silk" x="${sx - 35}" y="${sy - 32}">U${i + 1}</text>`).join("");

    const board = box({ tag: "div", cls: "board static", vars: "--i:0", faces: { top: `<svg class="pcb" viewBox="0 0 400 280" aria-hidden="true">${svg}</svg>` } });
    const cpu = box({ tag: "div", cls: "cpu static", vars: `--x:${CX - 200};--z:${CY - 140};--i:1`, faces: { top: `<b>MAYANK</b><small>A-26 · CPU</small>` } });
    const parts = chips.map(({ s, sx, sy, part }, i) => box({
      s, cls: "chip",
      vars: `--a:${s.a};--x:${sx - 200};--z:${sy - 140};--i:${i + 2}`,
      faces: { top: `<b>${part}</b><small>${s.label.toUpperCase()}</small>` },
      attrs: `data-chip="${s.id}"`,
    })).join("");
    return ground("--sw:520;--sd:380") + board + cpu + parts;
  }

  // ------------------------------------------------------------- windows
  function windows() {
    const cursor = `<span class="cursor"></span>`;
    const body = {
      projects:
        `<span class="p">mayank@dev</span> <span class="m">~</span> $ ls projects/\n` +
        SITE.projects.map((p) => `<span class="k">${esc(p.name)}</span>  <span class="m">${esc(p.year)}</span>`).join("\n") +
        `\n<span class="p">mayank@dev</span> <span class="m">~</span> $ ${cursor}`,
      work:
        `$ git log --oneline experience\n` +
        SITE.experience.map((j, i) => `<span class="k">${(0xa1f3c2e - i * 0x51b7).toString(16).slice(0, 7)}</span> ${esc(j.role)} @ ${esc(j.org)} <span class="m">(${esc(j.period)})</span>`).join("\n"),
      toolkit:
        `<span class="m">// package.json</span>\n{\n  <span class="k">"dependencies"</span>: {\n` +
        SITE.toolkit.flatMap((g) => g.items).slice(0, 6).map((t) => `    <span class="p">"${esc(t)}"</span>: <span class="k">"latest"</span>`).join(",\n") +
        `\n  }\n}`,
      lab:
        `$ ls ~/lab\n` +
        (SITE.lab || []).map((x) => `<span class="k">${esc(x.id)}/</span>\n  <span class="m">${esc(x.hook)}</span>`).join("\n") +
        `\n$ ${cursor}`,
      contact:
        `<span class="m">To:</span>      you\n<span class="m">From:</span>    Mayank Attri\n<span class="m">Subject:</span> let's build something\n\nHey — got an idea, a role, or a\nbug that won't die? Click to write.`,
    };
    const titles = { projects: "~/projects — zsh", work: "git log — experience", toolkit: "package.json — editor", lab: "~/lab — ideas", contact: "New message" };
    // back to front
    const order = ["contact", "lab", "toolkit", "work", "projects"];
    return ground("--sw:520;--sd:320") + order.map((id, i) => {
      const s = sec[id];
      const t = s.sealed ? "button" : "a";
      const open = t === "a" ? `href="${s.href}" aria-label="${s.label}"` : `type="button" aria-label="Lab — sealed, still in development" data-sealed=""`;
      return `<${t} class="win" ${open} style="--c:${s.c};--x:${-92 + i * 46};--y:${-115 - (4 - i) * 30};--z:${-100 + i * 50};--i:${i}">` +
        `<span class="titlebar"><i></i><i></i><i></i><span>${esc(titles[id])}</span></span>` +
        `<span class="wbody">${body[id]}</span></${t}>`;
    }).join("");
  }

  const builders = { rack, floppies, keyboard, circuit, windows };
  for (const [name, build] of Object.entries(builders)) {
    const world = home.querySelector(`.view[data-view="${name}"] .world`);
    if (world) world.innerHTML = build();
  }

  // ------------------------------------------------------------ switcher
  const tabs = [...home.querySelectorAll(".switcher [data-view]")];
  const views = [...home.querySelectorAll(".view[data-view]")];
  const names = views.map((v) => v.dataset.view);
  const store = { get() { try { return localStorage.getItem("view"); } catch { return null; } }, set(v) { try { localStorage.setItem("view", v); } catch {} } };

  function setView(name, { save = true } = {}) {
    if (!names.includes(name)) name = "boxes";
    for (const v of views) v.hidden = v.dataset.view !== name;
    for (const t of tabs) t.setAttribute("aria-selected", String(t.dataset.view === name));
    home.dataset.view = name;
    // keep the chosen tab in sight when the switcher scrolls (phones)
    const bar = tabs[0]?.parentElement, on = tabs.find((t) => t.dataset.view === name);
    if (bar && on) bar.scrollLeft = on.offsetLeft - (bar.clientWidth - on.offsetWidth) / 2;
    if (save) {
      store.set(name);
      const url = new URL(location.href);
      url.searchParams.set("view", name);
      history.replaceState(null, "", url);
    }
  }
  tabs.forEach((t) => t.addEventListener("click", () => setView(t.dataset.view)));
  setView(new URL(location.href).searchParams.get("view") || store.get() || "boxes", { save: false });

  const typing = (e) => e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.("input, textarea, select");
  addEventListener("keydown", (e) => {
    if (typing(e)) return;
    // 1–6 switch views
    if (/^[1-9]$/.test(e.key) && names[e.key - 1] && home.dataset.view !== "keyboard") setView(names[e.key - 1]);
  });

  // --------------------------------------------------- keyboard: type on it
  const kbView = home.querySelector('.view[data-view="keyboard"]');
  addEventListener("keydown", (e) => {
    if (home.dataset.view !== "keyboard" || typing(e) || e.repeat) return;
    const k = kbView.querySelector(`[data-key="${CSS.escape(e.key.toLowerCase())}"]`);
    if (!k) return;
    if (e.key === " ") e.preventDefault();
    k.classList.add("down");
  });
  addEventListener("keyup", (e) => {
    if (home.dataset.view !== "keyboard") return;
    const k = kbView.querySelector(`[data-key="${CSS.escape(e.key.toLowerCase())}"]`);
    if (!k || !k.classList.contains("down")) return;
    k.classList.remove("down");
    if (k.matches("a, button")) k.click();
    else if (e.key === " ") home.dispatchEvent(new CustomEvent("toast", { detail: "> hello, world" }));
  });
  kbView.addEventListener("click", (e) => {
    if (e.target.closest(".key.space")) home.dispatchEvent(new CustomEvent("toast", { detail: "> hello, world" }));
  });

  // ------------------------------------------------- circuit: light traces
  const pcb = home.querySelector('.view[data-view="circuit"]');
  const light = (chip, on) => pcb.querySelectorAll(`.trace[data-for="${chip.dataset.chip}"]`).forEach((p) => p.classList.toggle("live", on));
  for (const chip of pcb.querySelectorAll(".chip")) {
    chip.addEventListener("pointerenter", () => light(chip, true));
    chip.addEventListener("pointerleave", () => light(chip, false));
    chip.addEventListener("focus", () => light(chip, true));
    chip.addEventListener("blur", () => light(chip, false));
  }

  // --------------------------------------------- floppies: insert to open
  for (const disk of home.querySelectorAll(".floppy[href]")) {
    disk.addEventListener("click", (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      disk.classList.add("inserting");
      setTimeout(() => { location.href = disk.href; }, 320);
    });
  }
  addEventListener("pageshow", () => home.querySelectorAll(".inserting").forEach((d) => d.classList.remove("inserting")));

  // ------------------------------- orbit: drag to look around (no-physics views)
  let orbit = null, orbited = false;
  addEventListener("pointerdown", (e) => {
    orbited = false;
    const world = e.target.closest(".view")?.querySelector(".world[data-orbit]");
    if (!world || !e.isPrimary || e.button > 0) return;
    const cs = world.style;
    orbit = { world, id: e.pointerId, x: e.clientX, y: e.clientY, oy: parseFloat(cs.getPropertyValue("--oy")) || 0, oe: parseFloat(cs.getPropertyValue("--oe")) || 0, moving: false };
  });
  addEventListener("pointermove", (e) => {
    if (!orbit || e.pointerId !== orbit.id) return;
    const dx = e.clientX - orbit.x, dy = e.clientY - orbit.y;
    if (!orbit.moving) {
      if (Math.hypot(dx, dy) < 6) return;
      orbit.moving = true;
      orbit.world.classList.add("orbiting");
    }
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    orbit.world.style.setProperty("--oy", `${clamp(orbit.oy + dx * 0.3, -55, 55).toFixed(2)}deg`);
    orbit.world.style.setProperty("--oe", `${clamp(orbit.oe - dy * 0.2, -15, 30).toFixed(2)}deg`);
  });
  const endOrbit = (e) => {
    if (!orbit || e.pointerId !== orbit.id) return;
    if (orbit.moving) { orbited = e.type === "pointerup"; orbit.world.classList.remove("orbiting"); }
    orbit = null;
  };
  addEventListener("pointerup", endOrbit);
  addEventListener("pointercancel", endOrbit);
  addEventListener("click", (e) => {
    if (orbited && e.target.closest(".view")) { e.preventDefault(); e.stopImmediatePropagation(); }
    orbited = false;
  }, true);
  // double-click empty space: look straight again
  home.addEventListener("dblclick", (e) => {
    const world = e.target.closest(".view")?.querySelector(".world[data-orbit]");
    if (!world || e.target.closest("a, button")) return;
    world.style.removeProperty("--oy");
    world.style.removeProperty("--oe");
  });
})();
