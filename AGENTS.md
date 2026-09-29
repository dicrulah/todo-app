# AGENTS.md

This file guides AI coding agents (and humans) working on this project.

## Project overview
A simple Todo List web app built with plain HTML, CSS and JavaScript.
No frameworks, no build tools, no backend server, and no database.
All tasks are saved in the browser using localStorage.

## File structure
- `index.html` — the page structure (form, filters, task list, footer)
- `style.css` — all styling, including light and dark theme colours
- `script.js` — all app logic (add, edit, delete, filter, save, theme)

## How it works
1. The user adds a task through the form in index.html.
2. script.js validates the input, then adds the task to the `tasks` array.
3. The array is saved to localStorage after every change.
4. The `render()` function in script.js redraws the task list on screen
   any time the data changes.

## Conventions to follow
- Keep everything in these three files. Do not introduce a framework,
  bundler, or backend unless explicitly asked.
- Comment new code in plain English, one comment per section, aimed
  at a beginner reader.
- Match the existing coding style: `function` declarations, plain
  `addEventListener` calls, no arrow-function shorthand tricks.
- Keep all colours as CSS variables in `:root` in style.css, so light
  and dark mode stay easy to adjust.
- Do not add external libraries or CDN scripts unless asked.
- Test any change by opening index.html directly in a browser.

## Things not to change without asking
- The localStorage key name "tasks" (changing it would erase existing
  saved tasks for users).
- The three-file structure.

## Current features
Add, edit, delete, mark done, due dates, priority levels (low/medium/
high), filter by All/Active/Done, clear completed, dark mode, and
data saved in the browser.

## Possible next features
- Drag-and-drop reordering
- Task categories/tags
- Export/import tasks as a file
