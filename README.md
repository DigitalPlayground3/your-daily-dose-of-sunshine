# Bunny's Little Comfort House 🐰💌

A cozy 30-day comfort website: a morning letter and a night letter for every day, a comfort jar of
random notes, a hug button, and favourites. No backend, no login, no paid services.

- 30 morning letters, 30 night letters, 30 comfort notes (90 messages)
- Everything is saved in the browser only (favourites and the day she was reading)
- Works on phones, tablets and computers, with keyboard support and reduced-motion support

---

## 1. Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install        # once, to download what the site needs
npm run dev        # starts the site; open the address it prints (usually http://localhost:5173)
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Checks the code and makes the finished site in the `dist` folder |
| `npm run preview` | Shows the finished site exactly as GitHub Pages will |
| `npm test` | Runs all checks (90 messages, day selector, favourites, jar, hug button) |
| `npm run check:messages` | Only checks the messages (counts, unique titles, word counts) |

---

## 2. Put it online with GitHub Pages (free)

1. **Choose the repository name** (for example `bunnys-little-comfort-house`).
2. Open **`vite.config.ts`**, find the line `const REPO_NAME = "...";` and make it match your
   repository name *exactly* (same spelling and capital letters).
   *(Using a custom domain or a `username.github.io` repository? Set it to `""`.)*
3. Create a new repository on github.com with that name, then upload this project to it:
   ```bash
   git init
   git add .
   git commit -m "Bunny's Little Comfort House"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```
4. On GitHub, open the repository → **Settings → Pages**. Under **Build and deployment**,
   set **Source** to **GitHub Actions**.
5. Open the **Actions** tab. The "Deploy to GitHub Pages" job runs by itself (about a minute).
   When it turns green, your site is at
   `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`.

Every time you push a change to `main`, the site updates itself.

If you see a blank page after deploying, the `REPO_NAME` in `vite.config.ts` doesn't match the
repository name. Fix it and push again.

---

## 3. How to change things

| I want to… | Where |
| --- | --- |
| **Change her name** | `src/config.ts` → `SISTER_NAME`. It is used wherever a message contains `{name}`. |
| **Change the welcome text** | `src/config.ts` → `WELCOME_TITLE`, `WELCOME_SUBTITLE`, `ENTER_BUTTON_LABEL` |
| **Change the sign-off** ("With love, your sister ♡") | `src/config.ts` → `SIGN_OFF_LETTER`, `SIGN_OFF_NOTE` |
| **Edit a message** | `src/data/morningMessages.ts`, `nightMessages.ts` or `comfortMessages.ts`. Change the words inside the quotes. Use single quotes (`'like this'`) inside a message. |
| **Add a message or a day** | Copy one `{ ... }` block to the end of the list and give it the next number. For a new day, add one to **both** the morning and night files; the day selector grows by itself. Comfort notes can be added on their own. |
| **Remove a message** | Delete its `{ ... }` block. For days, renumber the days after it and keep morning and night the same length. |
| **Change colours** | `src/styles/theme.css` (the five main colours are at the top) |
| **Change fonts** | Install another font with `npm install @fontsource/NAME`, import it in `src/main.tsx`, and set it in `src/styles/theme.css` (`--font-body`, `--font-title`, `--font-hand`) |
| **Replace the bunny** | The bunny is `src/components/Bunny.tsx`. Make your own component with the same props and swap it in, or just change its colours in `theme.css` (`--bunny-fur`, `--bunny-line`). |
| **Make animations slower or faster** | `src/config.ts` → `ANIMATION_SPEED` (`1` normal, `2` twice as slow, `0.5` twice as fast) |
| **Mark which day matches today's date** | `src/config.ts` → `START_DATE`, for example `"2026-11-01"`. Leave as `null` for no date matching. |

Run `npm test` after editing messages. It will tell you if a title is missing or a message is too
short or too long.

### How the pieces fit together

- `src/data/` – all the words (never mixed into the screens)
- `src/components/MessageCard.tsx` – the one card that shows every message
- `src/screens/` – Welcome, Home, Letters, Comfort Jar, Hug panel, Favourites
- `src/styles/` – `theme.css` (colours, fonts) and `app.css` (layout and animation)

### Good to know

- **Favourites live in the browser.** They stay after a refresh on the same device and browser, but
  they don't move to another phone or computer.
- **No pressure by design.** There are no streaks or scores, and any day can be opened at any time.
  The real calendar date is shown separately from "Day N".
- **Sound** is not included, so nothing ever plays by itself.
