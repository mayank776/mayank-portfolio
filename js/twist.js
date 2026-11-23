// Twist: press and drag a box sideways and it turns under your pointer.
// Boxes stacked above it ride along, each a moment behind the one beneath,
// so dragging the bottom box turns the whole stack. Let go and it settles on
// the nearest face (a flick spins it further first). A tap still opens the
// box; a drag never does. Focusing a box by keyboard turns it back to face you.
(() => {
  const worlds = [...document.querySelectorAll(".world[data-twist]")];
  if (!worlds.length) return;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const boxes = worlds.flatMap((w) => [...w.querySelectorAll(":scope > .box")]); // each world top to bottom
  const SLOP = 6;        // px a press may wander and still count as a tap
  const FLICK = 0.3;     // seconds of travel a flick carries past the release
  const SETTLE = { k: 170, c: 20 };          // spring to the resting face
  const RIDE = { k: 520, c: 36, drag: 4 };   // spring that keeps riders on

  // Wrap each box's faces in a spinner, so the spin is separate from the
  // box's own resting turn and hover pull (which keep their CSS transitions).
  const state = new Map();
  for (const box of boxes) {
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    spinner.append(...box.querySelectorAll(":scope > .face"));
    box.append(spinner);
    box.setAttribute("draggable", "false");
    // Give the hidden faces something to show once turned.
    const back = box.querySelector(".f-back");
    if (back && !back.textContent.trim()) back.textContent = (box.getAttribute("aria-label") || "").split(" —")[0];
    const left = box.querySelector(".f-left"), right = box.querySelector(".f-right");
    if (left && right && !right.innerHTML.trim()) right.innerHTML = left.innerHTML;
    state.set(box, { el: spinner, angle: 0, vel: 0, rest: 0 });
  }

  const settling = new Set();
  const riding = new Map(); // rider -> { beneath, offset }, bottom-most first
  let grip = null, dragged = false, frame = 0, last = 0;

  const show = (s) => s.el.style.setProperty("--spin", `${s.angle.toFixed(3)}deg`);
  const face = (a) => Math.round(a / 90) * 90;
  const run = () => { frame ||= requestAnimationFrame(step); };
  const above = (box) => {
    const w = box.parentElement;
    if (w.dataset.stacked !== "true") return []; // spread out: nothing rests on it
    const all = [...w.querySelectorAll(":scope > .box")];
    return all.slice(0, all.indexOf(box)).reverse();
  };

  // Hand the boxes above to this one: each rides on the one beneath it,
  // keeping whichever face it currently shows.
  function carry(box) {
    riding.delete(box);
    settling.delete(box);
    let beneath = box;
    for (const rider of above(box)) {
      riding.delete(rider);
      settling.delete(rider);
      const r = state.get(rider), b = state.get(beneath);
      let offset = r.angle - b.angle;
      offset = face(offset - 360 * Math.round(offset / 360));
      riding.set(rider, { beneath, offset });
      beneath = rider;
    }
  }

  addEventListener("pointerdown", (e) => {
    dragged = false;
    const box = e.target.closest(".world[data-twist] > .box");
    if (!box || !e.isPrimary || e.button > 0) return;
    grip = {
      box, id: e.pointerId, x: e.clientX, y: e.clientY,
      turning: false, from: 0, trail: [],
      radius: box.querySelector(".f-left").offsetWidth / 2, // the front follows the pointer
    };
  });

  addEventListener("pointermove", (e) => {
    if (!grip || e.pointerId !== grip.id) return;
    const s = state.get(grip.box);
    if (!grip.turning) {
      const dx = e.clientX - grip.x, dy = e.clientY - grip.y;
      if (Math.abs(dy) > SLOP && Math.abs(dy) >= Math.abs(dx)) { grip = null; return; } // a scroll, not a turn
      if (Math.abs(dx) <= SLOP) return;
      grip.turning = true;
      grip.x = e.clientX;
      grip.from = s.angle; // catch it mid-settle without a jump
      try { grip.box.setPointerCapture(e.pointerId); } catch {}
      grip.box.classList.add("held");
      carry(grip.box);
    }
    s.angle = grip.from + ((e.clientX - grip.x) / grip.radius) * (180 / Math.PI);
    s.vel = 0;
    grip.trail.push([e.timeStamp, s.angle]);
    while (e.timeStamp - grip.trail[0][0] > 100) grip.trail.shift();
    show(s);
    run();
  });

  function release(e) {
    if (!grip || e.pointerId !== grip.id) return;
    const { box, turning, trail } = grip;
    grip = null;
    box.classList.remove("held");
    if (!turning) return;
    dragged = e.type === "pointerup";
    const s = state.get(box);
    const [t0, a0] = trail[0], [t1, a1] = trail.at(-1);
    const moving = !calm && t1 > t0 && e.timeStamp - t1 < 80;
    s.vel = moving ? ((a1 - a0) / (t1 - t0)) * 1000 : 0;
    const reach = Math.max(-540, Math.min(540, s.vel * FLICK));
    s.rest = face(s.angle + reach);
    settling.add(box);
    run();
  }
  addEventListener("pointerup", release);
  addEventListener("pointercancel", release);

  // A drag never opens the box (or pokes the sealed lab).
  addEventListener("click", (e) => {
    if (dragged && e.target.closest(".world")) { e.preventDefault(); e.stopImmediatePropagation(); }
    dragged = false;
  }, true);
  document.addEventListener("dragstart", (e) => e.preventDefault());

  // Reached by keyboard: turn back to face the viewer.
  document.addEventListener("focusin", (e) => {
    const box = e.target.closest(".world[data-twist] > .box");
    if (!box || !box.matches(":focus-visible")) return;
    const s = state.get(box);
    riding.delete(box);
    s.rest = Math.round(s.angle / 360) * 360;
    settling.add(box);
    run();
  });

  function spring(s, target, { k, c, drag = 0 }, dt) {
    const a = k * (target - s.angle) - c * s.vel - drag * s.vel;
    s.vel += a * dt;
    s.angle += s.vel * dt;
    return Math.abs(target - s.angle) < 0.05 && Math.abs(s.vel) < 0.5;
  }

  function step(now) {
    frame = 0;
    const dt = Math.min(0.032, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    let busy = !!grip?.turning;

    for (const box of settling) {
      const s = state.get(box);
      if (calm || spring(s, s.rest, SETTLE, dt)) {
        s.angle = s.rest; s.vel = 0;
        settling.delete(box);
      } else busy = true;
      show(s);
    }
    for (const [rider, { beneath, offset }] of riding) {
      const s = state.get(rider), target = state.get(beneath).angle + offset;
      if (calm) { s.angle = target; s.vel = 0; }
      else if (!spring(s, target, RIDE, dt)) busy = true;
      else { s.angle = target; s.vel = 0; }
      show(s);
    }

    if (busy) run();
    else last = 0;
  }
})();
