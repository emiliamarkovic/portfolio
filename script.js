/* =====================================================================
   Windows 95 portfolio
   ---------------------------------------------------------------------
   1. CONTENT   - edit this section first: your name, projects, etc.
   2. HELPERS   - tiny utilities
   3. WINDOWS   - the window manager (open, drag, focus, minimize, close)
   4. APPS      - what shows up inside each window
   5. DESKTOP   - icons, start menu, clock, shutdown
   ===================================================================== */

/* ============================ 1. CONTENT ============================ */

const profile = {
  name: "Emilia Markovic",
  tagline: "Computing student",
  bio: [
    "Hi! I'm Emilia Markovic, a third-year computing student at Queen's University.",
    "I'm really interested in the intersection of tech and biology and the future of biotech, as well as developing software that makes a real impact! I'm looking for a 12-16 month long internship, beginning May 2027.",
  ],
  links: [
    { label: "GitHub", url: "https://github.com/emiliamarkovic" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/emilia-markovic-093548345/" },
    { label: "Email", url: "emiliaa.markovic@gmail.com" },
  ],
};

const experience = [
  {
    role: "SickKids Summer Undergraduate Research Student",
    org: "Hawkins Lab, SickKids",
    dates: "May 2026 - August 2026",
    bullets: [
      "Current methods of paediatric brain tumour classification involve invasive tissue biopsy samples",
      "Liquid biopsy is a minimally invasive alternative to tissue biopsy that uses cerebrospinal fluid samples to stratify tumours",
      "However, current liquid biopsy workflows have limited performance - my goal was to improve the effectiveness of stratification of paediatric brain tumours using cerebrospinal fluid samples",
      "I independently implemented a custom DNABERT-style transformer with a multiple-instance learning classifier for four-class pediatric brain tumour classification using cerebrospinal fluid cell-free DNA",
      "I also developed EMIT, a Snakemake-based pipeline for end-to-end cfDNA fragmentomics analysis.",
      "I was selected as one of seven of over 200 research students to present my research findings at the SickKids SSuRe Symposium as an oral presenter representing the Cell and Systems Biology department, where I won the outstanding abstract merit award!"
    ],
  },
  {
    role: "Another Role",
    org: "Another Place",
    dates: "Month Year - Month Year",
    bullets: ["Replace me with something real."],
  },
];

const projects = [
  {
    name: "project-one",
    icon: "icons/project.png",
    stack: "Python, Flask",
    description: "One or two sentences on what it does and why you built it.",
    link: "https://github.com/emiliamarkovic",
  },
  {
    name: "project-two",
    icon: "icons/project.png",
    stack: "Java, JUnit",
    description: "Replace this with another project description.",
    link: "https://github.com/emiliamarkovic",
  },
  {
    name: "project-three",
    icon: "icons/project.png",
    stack: "JavaScript",
    description: "Another one. Aim for 3-6 projects.",
    link: "https://github.com/emiliamarkovic",
  },
];

// Shown inside resume.txt (Notepad). Plain text, monospace.
const resumeText = `YOUR NAME
you@example.com | github.com/emiliamarkovic | linkedin.com/in/you

EDUCATION
  University Name - B.Sc. Computer Science (expected 20XX)
  Relevant courses: Data Structures, Algorithms, Software Architecture

EXPERIENCE
  Job / Research Title - Company or Lab (Month Year - Month Year)
   * What you built or worked on
   * Another accomplishment

PROJECTS
  project-one - Python, Flask
   * One line about it
  project-two - Java, JUnit
   * One line about it

SKILLS
  Languages: Python, Java, JavaScript
  Tools: Git, Linux, ...
`;

/* ============================ 2. HELPERS ============================ */

const desktop = document.getElementById("desktop");
const iconsBox = document.getElementById("icons");
const taskButtons = document.getElementById("task-buttons");
const startMenu = document.getElementById("start-menu");
const startButton = document.getElementById("start-button");

/** Turn an HTML string into a DOM element. */
function el(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();
  return wrapper.firstElementChild;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function iconHTML(icon, size = 32) {
  const isImage = /\.(png|gif|svg)$/i.test(icon);
  return isImage
    ? `<img class="icon-img" src="${icon}" width="${size}" height="${size}" alt="">`
    : icon;
}

const isSmallScreen = () => window.innerWidth < 600;
const isTouch = () => window.matchMedia("(hover: none)").matches;

/**
 * Make an element "openable": double-click on desktop, single tap on touch
 * screens, Enter key for keyboard users.
 */
function bindOpen(node, action) {
  node.addEventListener("click", () => {
    document.querySelectorAll(".selected").forEach((n) => n.classList.remove("selected"));
    node.classList.add("selected");
    if (isTouch()) action();
  });
  node.addEventListener("dblclick", action);
  node.addEventListener("keydown", (e) => {
    if (e.key === "Enter") action();
  });
}

/* ============================ 3. WINDOWS ============================ */

// key -> { win, titleBar, taskBtn }
const openWindows = new Map();
let topZ = 10;

/**
 * Open a window, or bring it to the front if it's already open.
 * `build` is only called when the window doesn't exist yet and must return:
 *   { title, icon, width, height, content }  (content is a DOM element)
 */
function openWindow(key, build) {
  if (openWindows.has(key)) {
    focusWindow(key);
    return;
  }

  const cfg = build();
  const win = document.createElement("div");
  win.className = "window app-window";
  win.style.width = Math.min(cfg.width, window.innerWidth - 16) + "px";
  win.style.height = Math.min(cfg.height, desktop.clientHeight - 16) + "px";

  // Cascade new windows so they don't stack exactly on top of each other.
  const offset = (openWindows.size % 6) * 28;
  win.style.left = 90 + offset + "px";
  win.style.top = 20 + offset + "px";

  win.innerHTML = `
    <div class="title-bar">
      <div class="title-bar-text">${iconHTML(cfg.icon, 16)} ${cfg.title}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
      </div>
    </div>
    <div class="window-body"></div>
  `;
  win.querySelector(".window-body").appendChild(cfg.content);

  const titleBar = win.querySelector(".title-bar");
  const [minBtn, maxBtn, closeBtn] = titleBar.querySelectorAll("button");

  // Taskbar button for this window
  const taskBtn = document.createElement("button");
  taskBtn.className = "task-btn";
  taskBtn.innerHTML = `${iconHTML(cfg.icon, 16)} ${cfg.title}`;
  taskBtn.addEventListener("click", () => {
    const entry = openWindows.get(key);
    if (entry.win.classList.contains("minimized")) focusWindow(key);
    else if (taskBtn.classList.contains("active")) minimizeWindow(key);
    else focusWindow(key);
  });
  taskButtons.appendChild(taskBtn);

  openWindows.set(key, { win, titleBar, taskBtn });
  desktop.appendChild(win);

  // Window behaviour
  win.addEventListener("pointerdown", () => focusWindow(key));
  minBtn.addEventListener("click", () => minimizeWindow(key));
  maxBtn.addEventListener("click", () => win.classList.toggle("maximized"));
  titleBar.addEventListener("dblclick", (e) => {
    if (!e.target.closest("button")) win.classList.toggle("maximized");
  });
  closeBtn.addEventListener("click", () => closeWindow(key));
  makeDraggable(win, titleBar);

  if (isSmallScreen()) win.classList.add("maximized");
  focusWindow(key);
}

function focusWindow(key) {
  for (const [k, entry] of openWindows) {
    const active = k === key;
    entry.titleBar.classList.toggle("inactive", !active);
    entry.taskBtn.classList.toggle("active", active);
  }
  const entry = openWindows.get(key);
  entry.win.classList.remove("minimized");
  entry.win.style.zIndex = ++topZ; // highest z-index = on top
}

function minimizeWindow(key) {
  const entry = openWindows.get(key);
  entry.win.classList.add("minimized");
  entry.taskBtn.classList.remove("active");
}

function closeWindow(key) {
  const entry = openWindows.get(key);
  entry.win.remove();
  entry.taskBtn.remove();
  openWindows.delete(key);
}

/** Drag a window by its title bar using pointer events (mouse + touch). */
function makeDraggable(win, handle) {
  handle.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    if (win.classList.contains("maximized")) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = win.offsetLeft;
    const startTop = win.offsetTop;
    handle.setPointerCapture(e.pointerId);

    const onMove = (ev) => {
      // Keep at least part of the title bar on screen so you can't lose a window.
      const left = clamp(startLeft + ev.clientX - startX, 80 - win.offsetWidth, desktop.clientWidth - 80);
      const top = clamp(startTop + ev.clientY - startY, 0, desktop.clientHeight - 24);
      win.style.left = left + "px";
      win.style.top = top + "px";
    };
    const onUp = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  });
}

/* ============================== 4. APPS ============================== */

function renderAbout() {
  const links = profile.links
    .map((l) => `<a href="${l.url}" target="_blank" rel="noopener"><button>${l.label}</button></a>`)
    .join("");
  return el(`
    <div class="page">
      <h1>${profile.name}</h1>
      <p><i>${profile.tagline}</i></p>
      ${profile.bio.map((p) => `<p>${p}</p>`).join("")}
      <div class="links">${links}</div>
    </div>
  `);
}

function renderExperience() {
  const items = experience
    .map(
      (e) => `
      <fieldset>
        <legend>${e.dates}</legend>
        <b>${e.role}</b>, ${e.org}
        <ul>${e.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      </fieldset>`
    )
    .join("<br>");
  return el(`<div class="page"><h1>Experience</h1>${items}</div>`);
}

/** Projects: looks like an Explorer folder. Each project is a "file". */
function renderProjects() {
  const root = el(`
    <div class="explorer">
      <div class="address">Address: <input readonly value="C:\\Portfolio\\Projects" /></div>
      <div class="file-grid sunken-panel"></div>
      <div class="statusbar">${projects.length} object(s)</div>
    </div>
  `);
  const grid = root.querySelector(".file-grid");

  projects.forEach((p) => {
    const item = el(`
      <button class="file-icon">
        <span class="glyph">${iconHTML(p.icon, 64)}</span>
        <span class="label">${p.name}</span>
      </button>
    `);
    bindOpen(item, () => openProject(p));
    grid.appendChild(item);
  });
  return root;
}

/** A second-level window: details for one project. */
function openProject(p) {
  openWindow("project:" + p.name, () => ({
    title: p.name,
    icon: "icons/resume.png",
    width: 400,
    height: 260,
    content: el(`
      <div class="page">
        <h1>${p.name}</h1>
        <p><i>${p.stack}</i></p>
        <p>${p.description}</p>
        <div class="links">
          <a href="${p.link}" target="_blank" rel="noopener"><button>View on GitHub</button></a>
        </div>
      </div>
    `),
  }));
}

/** resume.txt in a Notepad-style window. */
function renderResume() {
  const root = el(`
    <div class="notepad">
      <div class="menubar"><span>File</span><span>Edit</span><span>Search</span><span>Help</span></div>
      <textarea readonly spellcheck="false"></textarea>
    </div>
  `);
  root.querySelector("textarea").value = resumeText;
  return root;
}

/** A small Paint clone: pencil, eraser, colors, brush size. */
function renderPaint() {
  const colors = [
    "#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080",
    "#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff",
  ];

  const root = el(`
    <div class="paint">
      <div class="paint-tools">
        <button data-tool="pencil" class="active">✏️ Pencil</button>
        <button data-tool="eraser">🧽 Eraser</button>
        <select class="size">
          <option value="2">Thin</option>
          <option value="5">Medium</option>
          <option value="12">Thick</option>
        </select>
        <button class="clear">New</button>
      </div>
      <div class="paint-canvas-wrap"><canvas width="520" height="320"></canvas></div>
      <div class="paint-palette"></div>
    </div>
  `);

  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  let tool = "pencil";
  let color = "#000000";
  let size = 2;
  let drawing = false;
  let last = null;

  // Mouse position -> canvas pixel position (handles CSS scaling)
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * canvas.width) / r.width,
      y: ((e.clientY - r.top) * canvas.height) / r.height,
    };
  };

  // Draw a line between two points (lines, not dots, so fast strokes have no gaps)
  const drawLine = (a, b) => {
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? size * 3 : size;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };

  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    last = pos(e);
    canvas.setPointerCapture(e.pointerId);
    drawLine(last, last);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const p = pos(e);
    drawLine(last, p);
    last = p;
  });
  const stop = () => (drawing = false);
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);

  // Tool buttons
  root.querySelectorAll("[data-tool]").forEach((btn) => {
    btn.addEventListener("click", () => {
      tool = btn.dataset.tool;
      root.querySelectorAll("[data-tool]").forEach((b) => b.classList.toggle("active", b === btn));
    });
  });
  root.querySelector(".size").addEventListener("change", (e) => (size = Number(e.target.value)));
  root.querySelector(".clear").addEventListener("click", () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  // Palette
  const palette = root.querySelector(".paint-palette");
  colors.forEach((c, i) => {
    const sw = document.createElement("button");
    sw.className = "swatch" + (i === 0 ? " active" : "");
    sw.style.background = c;
    sw.setAttribute("aria-label", "Color " + c);
    sw.addEventListener("click", () => {
      color = c;
      tool = "pencil";
      root.querySelectorAll("[data-tool]").forEach((b) => b.classList.toggle("active", b.dataset.tool === "pencil"));
      palette.querySelectorAll(".swatch").forEach((s) => s.classList.toggle("active", s === sw));
    });
    palette.appendChild(sw);
  });

  // TODO (challenge): add a flood-fill "bucket" tool. Hint: read pixels with
  // ctx.getImageData and use a stack-based fill from the clicked pixel.

  return root;
}

// The list of desktop apps. Add a new entry here to add a new icon + window.
const apps = [
  { id: "about", label: "About Me", icon: "icons/about.png", title: "About Me", width: 420, height: 300, render: renderAbout },
  { id: "projects", label: "Projects", icon: "icons/projects.png", title: "Projects", width: 480, height: 340, render: renderProjects },
  { id: "experience", label: "Experience", icon: "icons/experience.png", title: "Experience", width: 460, height: 360, render: renderExperience },
  { id: "resume", label: "resume.txt", icon: "icons/resume.png", title: "resume.txt - Notepad", width: 500, height: 380, render: renderResume },
  { id: "paint", label: "Paint", icon: "icons/paint.png", title: "untitled - Paint", width: 560, height: 440, render: renderPaint },
];

function openApp(app) {
  openWindow(app.id, () => ({
    title: app.title,
    icon: app.icon,
    width: app.width,
    height: app.height,
    content: app.render(),
  }));
}

/* ============================ 5. DESKTOP ============================ */

// Desktop icons
apps.forEach((app) => {
  const icon = el(`
    <button class="desktop-icon">
      <span class="glyph">${iconHTML(app.icon, 64)}</span>
      <span class="label">${app.label}</span>
    </button>
  `);
  bindOpen(icon, () => openApp(app));
  iconsBox.appendChild(icon);
});

// Click empty desktop to deselect icons
desktop.addEventListener("pointerdown", (e) => {
  if (e.target === desktop) document.querySelectorAll(".selected").forEach((n) => n.classList.remove("selected"));
});

// Start menu
apps.forEach((app) => {
  const li = document.createElement("li");
  li.innerHTML = `${iconHTML(app.icon, 16)}  ${app.label}`;
  li.addEventListener("click", () => {
    openApp(app);
    startMenu.hidden = true;
  });
  startMenu.appendChild(li);
});
startMenu.appendChild(Object.assign(document.createElement("li"), { className: "divider" }));
const shutdownItem = document.createElement("li");
shutdownItem.textContent = "⏻  Shut Down...";
shutdownItem.addEventListener("click", shutDown);
startMenu.appendChild(shutdownItem);

startButton.addEventListener("click", (e) => {
  e.stopPropagation();
  startMenu.hidden = !startMenu.hidden;
});
document.addEventListener("pointerdown", (e) => {
  if (!startMenu.contains(e.target) && e.target !== startButton) startMenu.hidden = true;
});

// Clock
const clock = document.getElementById("clock");
function updateClock() {
  clock.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
updateClock();
setInterval(updateClock, 15000);

// Shut down: black screen, click to "restart"
function shutDown() {
  startMenu.hidden = true;
  const screen = el(`<div class="shutdown"><p>It's now safe to turn off<br>your computer.<br><br><small>(click to restart)</small></p></div>`);
  screen.addEventListener("click", () => location.reload());
  document.body.appendChild(screen);
}

// Start with the About window open
openApp(apps[0]);
