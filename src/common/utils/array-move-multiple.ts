// AI GENERATED

/**
 * Moves multiple items from an array to a new starting index.
 *
 * @param {T[]} array The array to modify.
 * @param {number[]} indices The array of indices of the items to move.
 * @param {number} newIndex The index to move the items to.
 * @returns {T[]} A new array with the items moved.
 */
export function arrayMoveMultiple<T>(
  array: T[],
  indices: number[],
  newIndex: number,
): T[] {
  // A copy of the array of indices, sorted in ascending order.
  const sortedIndices = [...indices].sort((a, b) => a - b);

  // The items to move, in the order they appear in the original array.
  const itemsToMove = sortedIndices.map((i) => array[i]);

  // A new array with the items to be moved removed.
  const remainingItems = array.filter((_, i) => !indices.includes(i));

  // The number of items that were removed before the target newIndex.
  // This is used to calculate the correct insertion point in the remainingItems array.
  const removedBefore = sortedIndices.filter((i) => i < newIndex).length;

  // The adjusted index for insertion into the remainingItems array.
  const insertionIndex = newIndex - removedBefore;

  return [
    ...remainingItems.slice(0, insertionIndex),
    ...itemsToMove,
    ...remainingItems.slice(insertionIndex),
  ];
}
