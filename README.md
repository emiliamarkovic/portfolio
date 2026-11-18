# Retro Windows 98 Portfolio

A personal portfolio that looks like a Windows 95/98 desktop. Built with plain HTML, CSS and JavaScript (no build step), plus [98.css](https://jdan.github.io/98.css/) for the authentic widgets.

## Run it

Just open `index.html` in your browser. (Or run `python3 -m http.server` in this folder and visit http://localhost:8000.)

## Make it yours

Everything you need to edit is at the top of `script.js` under **1. CONTENT**:

- `profile`: your name, tagline, bio, and links
- `experience`: your jobs / research
- `projects`: each one becomes a file in the Projects folder
- `resumeText`: what shows up in `resume.txt`

Also change the `<title>` and description in `index.html`.

## Project layout

| File | What it does |
| --- | --- |
| `index.html` | Page skeleton: desktop, taskbar, start menu |
| `style.css` | Teal desktop, taskbar, and styling for each app |
| `script.js` | Window manager (open, drag, focus, minimize, close) and the apps |

## Add a new app

Write a `renderSomething()` function that returns a DOM element, then add an entry to the `apps` array in `script.js`. It gets a desktop icon and a Start menu item automatically.

## Ideas to extend it

- [ ] Flood-fill bucket tool in Paint (see the TODO in `renderPaint`)
- [ ] Download button for a real `resume.pdf`
- [ ] Minesweeper or Solitaire window
- [ ] Boot screen and startup sound
- [ ] Right-click context menu on the desktop
- [ ] Resizable windows

## Deploy with GitHub Pages

1. Push this folder to a GitHub repo.
2. Repo **Settings > Pages**, set the source to `main` branch, `/ (root)`.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.
   (Name the repo `<username>.github.io` to get the short URL.)
