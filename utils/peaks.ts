/**
 * Find the maximum and minimum values of a certain area of the array
 * @param {Array<number>} array
 * @param {number} start
 * @param {number} end
 */
function getMinMaxInRange(array: Float32Array, start: number, end: number) {
  let min = 0;
  let min1 = 0;
  let max = 0;
  let max1 = 0;
  let current: number;
  const step = (end - start) / 15;

  for (let i = start; i < end; i = i + step) {
    current = array[i];
    if (current < min) {
      min1 = min;
      min = current;
    } else if (current > max) {
      max1 = max;
      max = current;
    }
  }

  return [(min + min1) / 2, (max + max1) / 2];
}

/**
 * Peak-Sampling
 */
export default function GetPeaks(width: number, data: Float32Array) {
  const dataLength = data.length;
  const size = dataLength / width;
  let current = 0;
  let peaks: Array<number[]> = [];
  for (let i = 0; i < width; i++) {
    let start = ~~current;
    current = current + size;
    let end = ~~current;
    peaks[i] = getMinMaxInRange(data, start, end);
  }

  return peaks;
}
