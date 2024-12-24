export function sliceArrayIntoBatches<T>(
  arr: Array<T>,
  batch_size: number,
): Array<Array<T>> {
  const batches: Array<Array<T>> = [];
  for (let i = 0; i < arr.length; i += batch_size) {
    batches.push(arr.slice(i, i + batch_size));
  }
  return batches;
}
