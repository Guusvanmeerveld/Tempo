/**
 * Chunk an array into a new array that contains arrays with a set size
 * @param array - The array to be chunked
 * @param size - The size of the contained arrays
 * @returns Result
 */
export function chunk(array: Array<any>, size: number) {
  let chunked: Array<Array<any>> = new Array();

  for (var i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }

  return chunked;
}

/**
 * Capitalize the first character in a string
 * @param string - The string to be used
 * @returns {string} Result
 */
export function ucFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
