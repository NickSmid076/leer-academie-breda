# Leer Academie Breda: design system

The visual foundation for the learning platform of gemeente Breda. Microsoft sets the rules, AFAS sets the layout, Breda sets the identity.

- Tokens: [`tokens.css`](tokens.css)
- Shell and components: [`components.css`](components.css), [`shell.js`](shell.js)
- Icons: [`assets/icons.svg`](assets/icons.svg) (Fluent UI System Icons, regular, 24px)
- Living styleguide: [`/styleguide`](styleguide/index.html)

## 1. The blend

| Layer | Source | Decides |
|---|---|---|
| System | Microsoft style reference (`references/microsoft-style.md`) | Type, spacing, radius, elevation, flat surfaces, button types |
| Identity | Gemeente Breda huisstijl (`references/breda-huisstijl.png`, breda.nl) | The accent colour, the verbinding pattern, footer, breadcrumb, link style, search field |
| Familiarity | afas.nl / AFAS InSite (`references/afas-home.jpg`) | Page structure: grey bands with white cards, image + text tiles, stat blocks, colleague cards, assistant bubble |

**When they conflict:** accessibility wins, then Breda identity, then Microsoft, then AFAS.

Examples of that order in action:
- Microsoft has one blue accent; Breda red replaces it (identity beats system).
- Breda red on grey fails AA for small text, so links use a darker step `red-600` (accessibility beats identity).
- Microsoft uses square corners everywhere; the top bar search field is rounded because breda.nl does it (identity beats system).
- AFAS uses orange buttons and blue branding; none of that is used, only its structure.

## 2. Tokens and where every value comes from

### Colour: Breda red

**Confirmed red: `#EB002F`.** Sampled from `breda-huisstijl.png` (most common non-white colour, 612k px) and read from breda.nl's live CSS on 22 Oct 2026: the "Mijn Breda" button background and body links both compute to `rgb(235, 0, 47)`. The brief's estimate of `#E4003A` was close but not exact.

| Token | Value | Use | Contrast | Source |
|---|---|---|---|---|
| `--red-500` | `#EB002F` | Primary button, focus ring, counts, active nav line | White on it 4.59:1 | breda.nl |
| `--red-600` | `#D1002A` | Links and small red text (light) | On white 5.61, on `#F2F2F2` 5.01 | Derived: `red-500` fails on grey (4.10) |
| `--red-700` | `#C20027` | Primary hover | White on it 6.32 | Derived |
| `--red-800` | `#A80022` | Pressed, danger text (light), footer in dark | On white 7.81 | Derived |
| `--red-900` | `#8A001C` | Danger button fill | White on it 10.01 | Derived |
| `--red-300` | `#FF6B7D` | Links, focus ring, pattern cross in dark | On `#171717` 6.53, on `#262626` 5.51 | Derived for dark |
| `--red-50` / `--red-100` | `#FDECEF` / `#FBD3DB` | "Verplicht" badge background, text selection | `red-600` on `red-50` 4.92 | Derived |

### Colour: neutrals

| Token | Value | Use | Source |
|---|---|---|---|
| `--neutral-1000` | `#000000` | Headings | Microsoft |
| `--neutral-900` | `#171717` | Body text; dark page background | Microsoft |
| `--neutral-800` | `#262626` | Progress fill; dark card surface | Microsoft |
| `--neutral-500` | `#616161` | Secondary text (6.19 on white, 5.53 on grey) | Microsoft |
| `--neutral-50` | `#F2F2F2` | Grey section bands | Microsoft |
| `--neutral-0` | `#FFFFFF` | Page, cards | Microsoft |
| `--neutral-400` | `#757575` | Control borders (4.61 on white, meets 3:1 for UI) | Helper, added for WCAG 1.4.11 |
| `--neutral-150` | `#E0E0E0` | Decorative dividers, progress track | Helper |
| dark muted text | `#A6A6A6` | Secondary text in dark (7.36 on `#171717`) | Helper: `#616161` is unreadable on dark |
| dark band / border | `#1F1F1F` / `#3A3A3A` | Dark section bands and dividers | Helper |

### Colour: status

Danger is darker than the action red and always carries an icon, so "this is an error" never looks like "click here". Info is a low-saturation slate so it never competes with red.

| Role | Light text / bg | Dark text / bg | Contrast (light, dark) |
|---|---|---|---|
| Success | `#0F7B3F` / `#E6F3EB` | `#5CC08A` / `#173226` | 4.68, 6.16 |
| Warning | `#8A5A00` / `#FFF4D6` | `#E3A94A` / `#382B14` | 5.41, 6.59 |
| Danger | `#A80022` / `#FBEAEC` | `#FF8291` / `#3D1219` | 6.73, 6.82 |
| Info | `#44617A` / `#EDF1F4` | `#9DB4C8` / `#1E2A35` | 5.71, 6.81 |

All 39 text/background pairs were checked with the WCAG formula; every one passes AA.

### Typography (Microsoft)

`"Segoe UI Variable", "Segoe UI", system-ui, sans-serif`, weights **400** (text) and **600** (headings, buttons, labels). No other weights. On macOS this falls back to the system font, which is close in proportion.

| Token | Size / line height | Use |
|---|---|---|
| `--text-37` | 37 / 1.2 | Page title (h1) |
| `--text-29` | 29 / 1.2 | Section heading (h2); h1 on mobile |
| `--text-20` | 20 / 1.3 | Card and tile titles (h3); h2 on mobile |
| `--text-16` | 16 / 1.5 | Lead text, small headings |
| `--text-15` | 15 / 1.47 | Body and buttons (Microsoft default) |
| `--text-14` | 14 / 1.43 | Dense UI: tables, menus, forms |
| `--text-13` | 13 / 1.38 | Metadata, hints, badges, breadcrumb |
| `--text-11` | 11 / 1.27 | Mobile tab bar labels and count badges only |

### Spacing, layout, radius, elevation, motion

| Token | Value | Source |
|---|---|---|
| `--space-8/16/24/48/64` | 8, 16, 24, 48, 64 | Microsoft 8px grid |
| `--space-32`, `--space-4` | 32, 4 | Helpers: mobile section padding, icon gaps |
| `--page-max` | 1200px | Microsoft |
| `--radius-control` | 2px (buttons, inputs, tags) | Microsoft |
| `--radius-card` | 0px | Microsoft |
| `--radius-search` | 20px (fully rounded 40px field) | breda.nl search |
| `--shadow-card` | `rgba(0,0,0,.13) 0 3px 7px, rgba(0,0,0,.11) 0 1px 2px` | Microsoft (only shadow; also used for menus and dialogs, never nav, buttons or text) |
| `--duration-fast` / `--duration-base` | 120ms / 200ms | Operate-mode range; set to 0 under reduced motion |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | |

Ignored on purpose: the Microsoft doc's example of a 9999px pill button. It contradicts its own rules.

## 3. App shell

```
┌──────────────────────────────────────────────────────────────┐
│ ✕✕✕ Leer Academie Breda   ( Zoek een training…  ⌕ )  🔔3  SV▾│ top bar
├──────────────────────────────────────────────────────────────┤
│ Overzicht  Leeraanbod  Mijn leren  Team  Beheer               │ horizontal nav
├──────────────────────────────────────────────────────────────┤
│ Home > … > Pagina                          ╲ ╱ ╲ ╱  ✕         │ page header (grey band)
│ Paginatitel                                                    │
├──────────────────────────────────────────────────────────────┤
│ white and grey bands with white cards in 2–3 columns          │
├──────────────────────────────────────────────────────────────┤
│ red footer with links and skyline                              │
└──────────────────────────────────────────────────────────────┘
Mobile: compact top bar + bottom tab bar, assistant above the tab bar.
```

- **Top bar:** wordmark, rounded search, notifications with a red count, profile menu with the role switch (Medewerker / Manager / L&O) and theme toggle.
- **Main nav: horizontal, not a left rail.** breda.nl and AFAS both use a horizontal bar, so it's what people already know. There are at most five sections, which fit on one line at 1024px. Content keeps the full 1200px width for 3-column card grids. And the items map one to one onto the mobile bottom tab bar. Active item: semibold plus a 3px red underline.
- **Roles:** Team appears for Manager and L&O, Beheer only for L&O (`data-roles` on the nav items).
- **Mobile (< 768px):** the search moves behind an icon, the nav becomes a bottom tab bar, h1 drops to 29px.

## 4. Signature element: the verbinding pattern

Breda's huisstijl is built on one idea, *verbinding*: two lines at 45° meet and form a cross. We use it as **one** signature: loose short lines at ±45° with a single cross where they meet.

It appears in exactly two places:
1. The right side of the **page header** band.
2. **Empty states**, where it makes a blank area feel intentional.

Why this one: it's the theme Breda itself calls central, so it carries meaning instead of decoration. It stays quiet (14% black lines) so the red keeps its job as the action colour. And it scales down to small areas. The red skyline footer follows breda.nl too, but it's standard page furniture, not a second signature.

Implementation: `.verbinding` uses `assets/verbinding.svg` as a CSS mask, so the line colour comes from `--color-pattern` and works in both themes.

## 5. Dos and don'ts

**Do**
- Use red only for action and attention: the primary button, links, focus, active nav, counts of open actions, overdue progress.
- Keep one red primary button per view. Everything else is a secondary button or a link with →.
- Put white cards on grey bands, and alternate grey and white bands between sections.
- Give one key phrase in a tile title the link colour ("Rond je *verplichte training* af").
- Always pair danger colour with an icon, and never place a danger button next to a red primary button.
- Use Fluent regular icons from the sprite, at 16, 20 or 24px.
- Put the label above the field, the hint below it, and the error below with an icon.

**Don't**
- Don't add a second accent colour, gradients, glass effects, purple or emoji.
- Don't use rounded buttons or cards (2px and 0px only; the search field is the one exception).
- Don't put shadows on nav, buttons or text.
- Don't use red for decoration, section backgrounds or big headings.
- Don't put eyebrow labels above headings.
- Don't use a modal when inline feedback works; dialogs are for irreversible actions.
- Don't embed the official gemeente logo.

## 6. Components

All live in the styleguide with default, hover, focus, active, disabled and loading states where they apply:

Buttons (primary, secondary, danger, text link with →), input, search, select, checkbox, switch, card/tile (vertical and row, plus a loading skeleton), stat block, colleague card, "Ook interessant" block, tabs, badge and count, progress bar (neutral, done, overdue), avatar (initials or photo), toast, inline alert, dialog (native `<dialog>`), empty state, table, assistant bubble, breadcrumb, footer, bottom tab bar.

## 7. Leerhapje (mini-player)

A learning moment of 1 to 3 minutes that runs in the bottom-right corner while people keep working. Files: `leerhapje.css` (tokens only), `leerhapje.js` (player), `leerhapjes.js` (content). Demo trigger: the Leerhapje section on `/styleguide`.

**States**
- **Bubble:** 48px round, surface colour with a strong border, so it never competes with the red assistant button. The red count shows how many leerhapjes are waiting. A new leerhapje only ever shows up here; it never opens by itself.
- **Compact:** `--panel-w` × `--panel-h` (360 × 480), a 3px red top edge and `--shadow-overlay`. That is about 16% of a 1366 × 768 screen. On short screens the height shrinks so the panel never runs under the top bar. It's a labelled `region`, not a dialog: no backdrop and no focus trap. Esc minimises it and returns focus. Header: Zet naast je werk, Minimaliseren, Groot openen, Sluiten. Footer: Later (15 min / 1 uur / morgen) and the main action.
- **Expanded:** the `leerhapje` view in the app, at the same step, with Vorige and Verkleinen.
- **Mobile (<767px):** compact becomes a bottom sheet of 60% height above the tab bar. Swipe it down to go back to the bubble. The assistant hides while the sheet is open.
- **Floating window:** where the browser has the Document Picture-in-Picture API, "Zet naast je werk" moves the panel itself (not a copy) into an always-on-top window, so state stays in sync. Closing the window brings the panel back as the bubble. The button is hidden where the API is missing and on phones.

**Corner stack.** The assistant (56px) stays at the bottom. The leerhapje bubble and panel sit 16px above it (`--lh-stack`). Only one is open at a time: opening one minimises the other. Toasts move left of an open panel.

**Layers.** `--z-bubble` 200 < `--z-panel` 250 < `--z-menu` 300 < `--z-toast` 400.

**Content format** (`leerhapjes.js`)

```js
{ id, title, minutes, skill, course, steps: [
  { type: 'context', kind: 'mail' | 'teams' | 'letter', intro, ...scene },
  { type: 'hotspot', prompt, kind: 'mail' | 'text', parts: [{ id, label?, text, flag, feedback }] },
  { type: 'choice',  prompt, situation?, options: [{ label, correct, feedback }] },
  { type: 'result',  points, well, tip }
] }
```

**Feedback copy.** Short, kind and specific; always say why. Lead with "Goed gezien." or "Bijna.", never "Fout!". Right answers are green with a check icon. Other answers use the danger colour with an info icon and offer "Nog een keer". Feedback is announced through one polite live region.

**Delivery hook.** Call `Leerhapje.deliver(id, reason)` to put a leerhapje in the bubble. Today the styleguide button and the Home list do this. Later, an idle or between-meetings signal (Graph free/busy, Idle Detection API with consent) can call the same function.

**Progress** is stored per leerhapje in `localStorage` (`lab-lh-v1`): step, answers, found hotspots and snooze time. It survives navigation and reloads.

## 8. Accessibility notes

- Every text/background pair is AA in both themes (see tables above). UI borders and focus rings are at least 3:1.
- Focus: 2px solid ring, 2px offset, `--color-focus` (red in light, `#FF6B7D` in dark, white on the red footer).
- Reduced motion: durations drop to 0, the spinner stops rotating and the skeleton stops pulsing. State changes still happen, just instantly.
- Touch targets in the top bar, tab bar and buttons are 44px.
- Text selection, caret, scrollbar and underline offset are themed from the palette.

## 9. Known gaps

- Segoe UI isn't installed on macOS, so Mac screenshots show the system font.
- Tile photos (picsum.photos) and colleague portraits (randomuser.me) are placeholders. Replace them with real Breda photography and staff photos (with consent) before launch.
- The leerhapje content is Dutch only and isn't loaded on `index.en.html` yet.
- `index.html` and `index.en.html` use these tokens through `app.css`. `components.css` is only for the styleguide, because its class names overlap with the app's.
