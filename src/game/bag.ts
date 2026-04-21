import { PieceType, PIECE_TYPES } from './constants';

/** A shuffled bag of all 7 piece types */
export function createBag(): PieceType[] {
  const bag = [...PIECE_TYPES] as PieceType[];
  // Fisher-Yates shuffle
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

/**
 * Draws the next piece type from the bag.
 * Returns the type and the remaining bag (refills automatically).
 */
export function drawFromBag(bag: PieceType[]): { type: PieceType; bag: PieceType[] } {
  if (bag.length === 0) {
    const newBag = createBag();
    const type = newBag.pop()!;
    return { type, bag: newBag };
  }
  const remaining = [...bag];
  const type = remaining.pop()!;
  return { type, bag: remaining };
}

/**
 * Fills a queue up to `targetSize` pieces, drawing from the bag.
 */
export function fillQueue(
  queue: PieceType[],
  bag: PieceType[],
  targetSize: number,
): { queue: PieceType[]; bag: PieceType[] } {
  let currentBag = [...bag];
  const currentQueue = [...queue];

  while (currentQueue.length < targetSize) {
    const { type, bag: nextBag } = drawFromBag(currentBag);
    currentQueue.push(type);
    currentBag = nextBag;
  }

  return { queue: currentQueue, bag: currentBag };
}
