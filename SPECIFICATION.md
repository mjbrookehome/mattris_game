# Mattris — Game Specification

## Overview

A single-player, single-level Mattris playable in the browser. No authentication required. The game runs entirely client-side with optional local score persistence.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend framework | **React 18** (Vite) | Fast dev setup, component model suits game UI |
| Game loop / state | **Zustand** | Lightweight, no boilerplate, easy to test |
| Rendering | **HTML5 Canvas** (via React ref) | Performant per-frame drawing |
| Styling | **Tailwind CSS v3** | Utility-first, no CSS files to maintain |
| Testing — unit | **Vitest** | Native Vite integration, Jest-compatible API |
| Testing — component | **React Testing Library** | Mirrors user interaction |
| Testing — E2E | **Playwright** | Cross-browser, reliable keyboard event simulation |

---

## Game Rules

### Board
- Grid: **10 columns × 20 rows**
- Hidden buffer: 2 rows above the visible grid (spawn zone)
- Each cell is 32 × 32 px (scales with viewport)

### Tetrominoes
All 7 standard pieces (I, O, T, S, Z, J, L), each with a distinct colour:

| Piece | Colour |
|---|---|
| I | Cyan |
| O | Yellow |
| T | Purple |
| S | Green |
| Z | Red |
| J | Blue |
| L | Orange |

Piece selection uses the **7-bag randomiser**: all 7 pieces are shuffled into a bag; pieces are drawn in order; a new bag is generated when the previous one is exhausted.

### Spawning
- New pieces spawn centred horizontally at row 0 (top of buffer).
- If a spawned piece overlaps existing locked cells → **Game Over**.

### Movement
| Action | Key(s) |
|---|---|
| Move left | `←` / `A` |
| Move right | `→` / `D` |
| Soft drop | `↓` / `S` |
| Hard drop | `Space` |
| Rotate clockwise | `↑` / `W` / `X` |
| Rotate counter-clockwise | `Z` |
| Hold piece | `C` / `Shift` |

### Rotation
Uses the **Super Rotation System (SRS)** with standard wall-kick tables for I and non-I pieces.

### Gravity
- Pieces fall one row every **800 ms** at the start.
- Speed increases every 10 lines cleared (up to a minimum interval of 100 ms).

| Lines cleared | Drop interval |
|---|---|
| 0–9 | 800 ms |
| 10–19 | 650 ms |
| 20–29 | 500 ms |
| 30–39 | 370 ms |
| 40–49 | 250 ms |
| 50+ | 100 ms |

### Lock Delay
- A piece touching the floor or a locked cell starts a **500 ms lock timer**.
- Any successful movement or rotation resets the timer (max 15 resets per piece).
- After 15 resets or timer expiry, the piece locks immediately.

### Line Clears & Scoring
| Lines cleared at once | Points |
|---|---|
| 1 (Single) | 100 |
| 2 (Double) | 300 |
| 3 (Triple) | 500 |
| 4 (Tetris) | 800 |

Score is multiplied by the current **level** (1-indexed, increments every 10 lines).

Back-to-back Tetris bonus: subsequent Tetris clears grant **1.5× points** (rounded down).

### Hold Piece
- The player may hold the current piece once per piece drop.
- Holding swaps the current piece with the held piece (or takes from the bag if hold is empty).
- Hold is reset when the next piece spawns.

### Ghost Piece
- A translucent projection shows where the current piece will land.

### Next Queue
- Display the **next 5 pieces** in a side panel.

### Game Over
Triggered when a newly spawned piece cannot be placed. The board freezes and a "Game Over" overlay is shown with the final score and a "Play Again" button.

---

## UI Layout

```
┌────────────────────────────────────────┐
│  TETRIS                                │
├──────────┬─────────────────┬───────────┤
│  HOLD    │                 │  SCORE    │
│ [piece]  │   Game Board    │  [value]  │
│          │   10 × 20       │           │
│          │                 │  LEVEL    │
│          │                 │  [value]  │
│          │                 │           │
│          │                 │  LINES    │
│          │                 │  [value]  │
│          │                 │           │
│          │                 │  NEXT     │
│          │                 │ [5 pieces]│
└──────────┴─────────────────┴───────────┘
│  [Start / Pause]  [Restart]            │
└────────────────────────────────────────┘
```

---

## State Model (Zustand Store)

```ts
interface GameState {
  board: Cell[][];           // 22 rows × 10 cols (includes buffer)
  currentPiece: Piece | null;
  heldPiece: Piece | null;
  canHold: boolean;
  nextQueue: Piece[];        // 5 pieces
  bag: PieceType[];          // remaining pieces in current bag
  score: number;
  level: number;
  linesCleared: number;
  status: 'idle' | 'playing' | 'paused' | 'gameover';
  backToBack: boolean;
}
```

---

## Project Structure

```
game-v3/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── GameBoard.tsx        # Canvas renderer
│   │   ├── HoldPanel.tsx
│   │   ├── NextQueue.tsx
│   │   ├── ScorePanel.tsx
│   │   ├── GameOverlay.tsx      # Start / Pause / Game Over screens
│   │   └── Controls.tsx         # Button row
│   ├── store/
│   │   └── gameStore.ts         # Zustand store + actions
│   ├── game/
│   │   ├── constants.ts         # Board dimensions, colours, timing
│   │   ├── tetrominoes.ts       # Piece shapes & SRS kick tables
│   │   ├── board.ts             # Board manipulation (lock, clear lines)
│   │   ├── rotation.ts          # SRS rotation logic
│   │   ├── scoring.ts           # Score calculation
│   │   └── bag.ts               # 7-bag randomiser
│   └── hooks/
│       ├── useGameLoop.ts       # requestAnimationFrame loop
│       └── useKeyboard.ts       # Key binding handler
├── tests/
│   ├── unit/
│   │   ├── bag.test.ts
│   │   ├── board.test.ts
│   │   ├── rotation.test.ts
│   │   └── scoring.test.ts
│   ├── component/
│   │   ├── ScorePanel.test.tsx
│   │   ├── HoldPanel.test.tsx
│   │   └── GameOverlay.test.tsx
│   └── e2e/
│       ├── gameplay.spec.ts     # Full game flow
│       └── controls.spec.ts     # Keyboard input
├── package.json
└── playwright.config.ts
```

---

## Test Plan

### Unit Tests (Vitest)

#### `bag.test.ts`
- A fresh bag contains exactly 7 unique piece types.
- Drawing all 7 pieces from a bag triggers generation of a new bag.
- The randomiser never produces `undefined` values.

#### `board.test.ts`
- `lockPiece` correctly writes piece cells to the board.
- `clearLines` removes full rows and shifts remaining rows down.
- `clearLines` returns the correct count (0, 1, 2, 3, 4).
- Locking a piece that fills 4 rows simultaneously clears all 4.
- An empty board has no clearable lines.

#### `rotation.test.ts`
- Each piece rotates through all 4 states and returns to the original.
- Wall kicks allow an I-piece to rotate when adjacent to the left wall.
- Wall kicks allow an I-piece to rotate when adjacent to the right wall.
- A piece cannot rotate into an occupied cell when no kick resolves the collision.

#### `scoring.test.ts`
- Single = 100 × level.
- Double = 300 × level.
- Triple = 500 × level.
- Tetris = 800 × level.
- Back-to-back Tetris = floor(800 × 1.5) × level.
- Non-Tetris clear resets the back-to-back flag.
- Soft drop adds 1 point per row.
- Hard drop adds 2 points per row dropped.

### Component Tests (React Testing Library + Vitest)

#### `ScorePanel.test.tsx`
- Renders score, level, and lines values correctly from props.
- Updates displayed value when props change.

#### `HoldPanel.test.tsx`
- Shows "empty" state when no piece is held.
- Renders the correct piece shape when a piece is held.
- Applies a dimmed style when `canHold` is false.

#### `GameOverlay.test.tsx`
- Shows "Press Start" overlay when status is `idle`.
- Shows "Paused" overlay when status is `paused`.
- Shows final score and "Play Again" button when status is `gameover`.
- "Play Again" button calls the restart action.
- No overlay is visible when status is `playing`.

### E2E Tests (Playwright)

#### `gameplay.spec.ts`
- Page loads and displays the idle overlay.
- Pressing Enter starts the game and hides the overlay.
- Score increments after a line is cleared (injected board state).
- Game Over overlay appears after a top-out condition (injected board state).
- Clicking "Play Again" resets the board and score to zero.

#### `controls.spec.ts`
- `ArrowLeft` moves the active piece one column to the left.
- `ArrowRight` moves the active piece one column to the right.
- `ArrowDown` accelerates the piece downward (soft drop).
- `Space` instantly drops the piece to the lowest valid position.
- `ArrowUp` rotates the piece clockwise.
- `KeyZ` rotates the piece counter-clockwise.
- `KeyC` holds the current piece and swaps with held piece.
- `Escape` / `KeyP` toggles pause.

---

## Non-Functional Requirements

- First Contentful Paint < 1 s on a mid-range device.
- Game loop runs at 60 fps with no frame drops during normal play.
- No network requests required at runtime.
- Highest score persisted to `localStorage` (key: `tetris_highscore`).
- Fully keyboard-accessible; no mouse required to play.
- Responsive: playable at viewport widths from 360 px to 1920 px.

---

## Out of Scope

- Multiplayer
- User accounts / authentication
- Server-side leaderboards
- Sound (nice-to-have, but not specified)
- Mobile touch controls
