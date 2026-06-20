# FinTech Glassmorphic Portfolio Website

A high-fidelity, creative portfolio website built for **Ziyanali Saiyed** (BCA Student & Aspiring IT/FinTech Professional). This project implements a premium, high-contrast FinTech visual language with strict design token mappings, volumetric glassmorphic cards, three-tone status pills, interactive modals, a liquid theme toggle, and an inline SVG logo.

---

## 1. Project Directory Structure

```text
Portfoilio/
├── index.html               # Main entry skeleton, grid layout, shared modal base
├── README.md                # Project documentation (this file)
├── styles/
│   ├── global.css           # CSS variables, resets, core typography, custom scrollbar
│   ├── glass.css            # Frosted glass logic, glowing border gradients, capsule switch, status pills
│   ├── components.css       # Grid systems, volumetric modal overlays, dropdown headers
│   └── animations.css       # Staggers, fades, keyframes, spring dropdown springs
├── scripts/
│   ├── app.js               # Modal controllers, dynamic template injection, focus traps
│   ├── theme.js             # Capsule slider states, storage memory, theme attributes
│   └── menu.js              # Dropdown menu toggler, hover pulse hooks
└── sections/
    ├── about.html           # About me content
    ├── skills.html          # Categorized skill badges
    ├── projects.html        # Hostel & tournament cards
    ├── philosophy.html      # Three core developer rules
    ├── education.html       # BCA timeline structure
    └── bridge.html          # Centered social links (BRIDGE)
```

---

## 2. Core Aesthetics & Design Systems

The site layout adheres to a monochromatic blue gradient theme, eliminating generic or high-saturation neon colors.

### The Harmonized Color Palette
*   **Deepest Navy**: `#021024` — Primary Dark Mode Background.
*   **Deep Navy Blue**: `#052659` — Card backgrounds and dark elements.
*   **Medium Blue**: `#5483B3` — Primary Accent, active states, and glows.
*   **Light Blue**: `#7DA0CA` — Secondary Accent, borders, and hover states.
*   **Very Light Blue/Cyan**: `#C1E8FF` — Text on dark and Light Mode background.

### Liquid Glass styling (Glassmorphism)
Glass layers emulate frosted material surfaces using:
*   `backdrop-filter: blur(20px) saturate(180%)`
*   **Dark Mode**: Background `rgba(5, 38, 89, 0.6)` with `1px solid rgba(84, 131, 179, 0.3)` border.
*   **Light Mode**: Background `rgba(255, 255, 255, 0.4)` with `1px solid rgba(5, 38, 89, 0.1)` border.
*   **Inner Highlight**: `box-shadow: inset 0 1px 0 rgba(193, 232, 255, 0.1)` (adapting to scheme variables).

---

## 3. UI Component Specifications

### A. Glowing Border Cards
Main dashboard panels are constructed as glowing containers that shift visually on hover:
*   **Card 1 Glow**: Linear gradient from Medium Blue (`#5483B3`) to Light Blue (`#7DA0CA`).
*   **Card 2 Glow**: Linear gradient from Deep Navy (`#052659`) to Medium Blue (`#5483B3`).
*   **Background**: Solid `rgba(5, 38, 89, 0.6)` with backdrop blur.
*   **Clipping Mechanism**: Implemented using a dual masked pseudo-element container:
    ```css
    .glow-card::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 16px;
      padding: 1.5px;
      background: var(--glow-gradient);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      pointer-events: none;
      z-index: -1;
      opacity: 0.4;
      transition: opacity var(--transition-smooth);
    }
    ```
*   **Hover states**: Card lifts vertically by `8px` (`transform: translateY(-8px)`) and mask opacity increases from `0.4` to `0.8`.

### B. Three-Tone Status Pills
A strict color system mapped to badge priorities, avoiding random hues:
1.  **Active / Highlight**: Glass background `rgba(84, 131, 179, 0.2)`, border `#5483B3`, text `#C1E8FF`.
2.  **Neutral / Default**: Glass background `rgba(5, 38, 89, 0.25)`, border `#052659`, text `#C1E8FF`.
3.  **Success / Positive**: Glass background `rgba(193, 232, 255, 0.15)`, border `#C1E8FF`, text `#5483B3`.

### C. Liquid Glass Theme Toggle
A custom, capsule-style switch representing Dark and Light modes:
*   **Track**: Rounded capsule styled with `rgba(5, 38, 89, 0.4)` background.
*   **Knob**: Glass-morphic circle with a soft Medium Blue (`#5483B3`) inner shadow (`box-shadow: inset 0 2px 4px #5483B3`).
*   **Behavior**: Switches positions smoothly on theme toggle (`transform: translateX(73px)` in Light Mode).
*   **Icons**: Sun (Very Light Blue `#C1E8FF`) on the left, Moon (Medium Blue `#5483B3`) on the right.

### D. Stylized Brand SVG Logo
Replaces plain text brand headers with a custom vector logo that reflects the color palette:
*   A rounded background squircle (`#021024` fill) framed by a Deep Navy (`#052659`) to Medium Blue (`#5483B3`) border gradient.
*   A bold, symmetrical letter **Z** in the center styled with a Medium Blue (`#5483B3`) and Very Light Blue (`#C1E8FF`) gradient.

---

## 4. Javascript Functionality & Behaviors

The client-side behavior uses modern, vanilla ES modules to govern state changes:

### `scripts/theme.js`
*   Initializes the site theme by matching existing preferences stored in `localStorage` or falling back to the browser's system preference `(prefers-color-scheme: dark)`.
*   Toggles the `data-theme` attribute on the root `<html>` element on switch clicks.
*   Updates aria-checked state attributes (`aria-checked="true" / "false"`) for screen readers.

### `scripts/app.js`
*   Defines titles and handles content fetches for the different sections (*Skills, Projects, Philosophy, Education, BRIDGE*).
*   Maps left sidebar navigation icons to directly trigger and animate modal displays.
*   Reveals the modal overlay smoothly by toggling the `.active` class.
*   Handles accessibility details: traps layout focus inside the open modal window, dismisses views on Escape key strokes or overlay clicks, and restores key focus to the triggering sidebar item when closed.

### `scripts/menu.js`
*   Governs dropdown toggle triggers inside modal window headers.
*   Controls the hover pulse animation on the three-dot button.
*   Dismisses the dropdown when clicking outside its bounds.

---

## 5. Viewport Layout & Custom Scrollbar
*   **Grid layout**: Centered, responsive layout mapping 3 columns on desktop, 2 columns on tablet, and 1 column on mobile devices.
*   **Global Scroll**: Configured as standard vertical scrolling only if content exceeds viewport dimensions.
*   **Modal Scroll**: Lock scroll focus on background elements when modal opens. Scroll container yields to a thin, custom scrollbar (`width: 6px`) styled with a transparent track and a medium blue `#5483B3` thumb.

---

## 6. Development & Run Commands

Because ES modules (`type="module"`) are blocked on the local filesystem (`file://` protocol) due to browser security guidelines, you must serve the files via a local web server.

### Local Server Setup (No install required)
Run a lightweight live-server instantly using npm:
```bash
# Navigate to project folder (note correct spelling: Portfoilio)
cd /Users/iamziyan/Documents/Portfoilio

# Host static files and open immediately in default browser
npx -y live-server
```
The application will launch automatically at `http://127.0.0.1:8080/`.
