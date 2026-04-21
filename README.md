# Mattris

A single-player Tetris clone built with React 18, Zustand, and HTML5 Canvas. Runs entirely in the browser with no backend or authentication required.

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18.x |
| npm | 9.x |

## Installation

```bash
npm install
```

## Running the game

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Press **Enter** or click **Start** to begin.

## Controls

### Desktop (Keyboard)

| Action | Keys |
|---|---|
| Move left | `←` `A` |
| Move right | `→` `D` |
| Soft drop | `↓` `S` |
| Hard drop | `Space` |
| Rotate clockwise | `↑` `W` `X` |
| Rotate counter-clockwise | `Z` |
| Hold piece | `C` `Shift` |
| Pause / Resume | `Esc` `P` |

### Mobile (Touch)

On mobile and tablet devices, an on-screen control panel appears below the game board with touch-friendly buttons:

- **Left/Right arrows** - Move piece horizontally
- **Up/Down chevrons** - Rotate counter-clockwise / Soft drop
- **↻ button** - Rotate clockwise
- **HOLD button** - Hold the current piece
- **HARD DROP button** - Instantly drop piece to the bottom

All buttons are disabled until the game starts. The mobile UI is automatically shown on screens smaller than 768px (md breakpoint).

**Layout:**
```
┌─────────────────────────┐
│  ◀    ↺    ↻            │
│  ↑  ↓    HOLD           │
│  ▶                      │
├─────────────────────────┤
│  HARD DROP (Space)      │
└─────────────────────────┘
```

For best experience on mobile:
- Use landscape orientation for larger gameplay area
- Buttons are 56×56px (14×14mm) for easy thumb targeting
- Use visual feedback (button press animation) to confirm input

## Testing

### Unit & component tests (Vitest + React Testing Library)

```bash
npm run test
```

Runs all 62 tests across 8 suites covering game logic (bag randomiser, board manipulation, SRS rotation, scoring) and React components (ScorePanel, HoldPanel, GameOverlay, MobileControls).

Watch mode:

```bash
npm run test:watch
```

### End-to-end tests (Playwright)

Install browser binaries on first use:

```bash
npx playwright install
```

Run E2E tests (starts the dev server automatically):

```bash
npm run test:e2e
```

Open the Playwright UI for interactive debugging:

```bash
npm run test:e2e:ui
```

## Building for production

```bash
npm run build
```

Output is written to `dist/`. Preview the production build locally:

```bash
npm run preview
```

## Tech stack

| Layer | Library |
|---|---|
| Framework | React 18 (Vite) |
| State management | Zustand |
| Rendering | HTML5 Canvas |
| Styling | Tailwind CSS v3 |
| Unit / component tests | Vitest + React Testing Library |
| E2E tests | Playwright |
| Language | TypeScript |

## Project structure

```
src/
├── game/           # Pure game logic (no React dependencies)
│   ├── constants.ts
│   ├── tetrominoes.ts   # Piece shapes & SRS kick tables
│   ├── bag.ts           # 7-bag randomiser
│   ├── board.ts         # Board state & collision detection
│   ├── rotation.ts      # SRS rotation with wall kicks
│   └── scoring.ts       # Score & level calculations
├── store/
│   └── gameStore.ts     # Zustand store & all game actions
├── hooks/
│   ├── useGameLoop.ts   # Gravity tick via setInterval
│   └── useKeyboard.ts   # Keyboard input bindings
└── components/
    ├── GameBoard.tsx      # Canvas renderer + ghost piece
    ├── HoldPanel.tsx
    ├── NextQueue.tsx
    ├── ScorePanel.tsx
    ├── GameOverlay.tsx    # Start / Pause / Game Over screens
    ├── MobileControls.tsx # Touch-friendly button panel
    └── Controls.tsx

tests/
├── unit/            # Vitest unit tests
├── component/       # React Testing Library tests
└── e2e/             # Playwright end-to-end tests
```

## Persistence

The personal best score is saved to `localStorage` under the key `mattris_highscore`. No server, database, or account is required.
