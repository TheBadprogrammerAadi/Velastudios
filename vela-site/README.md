# VELA — Website Source

A complete one-page website built with plain **HTML, CSS, and JavaScript** — no
frameworks, no build tools. Open `index.html` in any browser and it just works.

## The 3 files (and what each does)

| File | Role | Plain-English job |
|------|------|-------------------|
| `index.html` | **Structure** | The content: every heading, paragraph, link, and section, in order. |
| `styles.css` | **Appearance** | All the colours, fonts, spacing, and layout. |
| `script.js`  | **Behaviour** | The moving parts: clock, scroll fades, frosted nav, hover preview. |

> **The golden rule of web pages:** *content* (HTML), *looks* (CSS), and
> *behaviour* (JS) are kept in separate files. Change one without breaking the others.

Every file is heavily commented — read them top to bottom like a guided tour.

## How to open it

Just double-click `index.html`. That's it.
For live-reload while editing, use VS Code's **Live Server** extension (right-click `index.html` → "Open with Live Server").

## Make it yours — the quick wins

1. **Change the accent colour** — open `styles.css`, find `--accent` near the top
   (section 1), change the hex value. The whole site re-colours. Options are listed there.
2. **Edit the text** — it's all in `index.html`. Swap "Halden Roasters" etc. for your real projects.
3. **Your email** — search `index.html` for `hello@vela.studio` and replace it (2 places + the footer).
4. **Real project images** — in `styles.css` find `.preview__inner` (section 8) and replace the
   striped `background-image` with `background-image: url('images/your-photo.jpg'); background-size: cover;`.
5. **Social links** — in the footer, the `href="#"` links are placeholders. Point them at your real profiles.

## How to put it online (free)

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Drag the whole `vela-site` folder onto the page.
3. It's live in seconds at a `something.netlify.app` URL.
4. (Optional) Buy a domain (e.g. from Namecheap), then connect it in Netlify's settings.

Same idea works on **Vercel**, **Cloudflare Pages**, and **GitHub Pages**.

## Learning path (suggested order)

1. **`index.html`** — see how a page is structured with tags and `class`/`id` names.
2. **`styles.css`** — see how those classes get colours, fonts, and layout. Try changing values and refresh.
3. **`script.js`** — see the *find → listen → change* pattern that makes things interactive.

## Things to learn next

- **A working contact form** — drop in [Formspree](https://formspree.io) (no backend needed).
- **Favicon + social preview image** — add a `<link rel="icon">` and Open Graph `<meta>` tags in `<head>`.
- **Analytics** — add Google Analytics or [Plausible](https://plausible.io) to see your visitors.

Built for VELA · 2026
