# Mayank Attri — portfolio

Plain HTML + CSS + vanilla JS (same approach as the site it's modelled on: no framework, no build step).
The home page is a stack of CSS‑3D boxes; each box opens a section.

## Edit content
Everything on the inner pages comes from `js/data.js` — projects, experience, lab, toolkit, email and links.
Live site: https://mayank-portfolio-dun.vercel.app
The Lab page (`lab.html`) lists the `lab` entries and certifications from the same file.

Home-page box labels live in `index.html`; box colours/heights/turns in `css/home.css` (`.b-*` rules).

## Run locally
```
python -m http.server 5178
```
then open http://localhost:5178

## Deploy
Any static host works: drag the folder into Netlify / Cloudflare Pages, or push to GitHub Pages / Vercel.

## Views
The home page has six switchable 3D views of the same five sections (switcher at the top, or keys 1–6).
The choice is remembered and shareable via `?view=`.

| View | Interactions |
|---|---|
| Boxes | drag sideways to turn, drag up to lift (boxes above ride along) |
| Rack | same as boxes; hover pulls a unit out like a drawer |
| Floppies | turn / flip up; tap "inserts" the disk |
| Keyboard | click keys or type P · E · T · L · C on your real keyboard; space says hello |
| Circuit | hover a chip to light its traces |
| Windows | hover fans the windows out; drag to look around |

Boxes are hand-written in `index.html`; the other five are built in `js/views.js`, styled in `css/views.css`.
Rotate/lift live in `js/twist.js` / `js/lift.js` and apply to any `.world` with `data-twist` / `data-lift`.

## Little extras
- Hover a box to pull it out.
- Double-click the ground or press **T** to square the stack.
- **Esc** on any inner page goes back to the stack.
- Follows the system light/dark setting.
