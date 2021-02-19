import fs from "fs";
import path from "path";
import Console from "./console";

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

const abs = ["K", "M", "B", "T"];
export function abbreviate(number: number) {
  for (var i = abs.length - 1; i >= 0; i--) {
    let zero = Math.pow(1000, i) * 1000;
    if (number >= zero) {
      return Math.floor(number / zero) + abs[i];
    }
  }

  return number;
}

export function emptyDir(path: string) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          emptyDir(path + "/" + filename);
        } else {
          fs.unlinkSync(path + "/" + filename);
        }
      });
    } else {
      Console.error("No files found in the directory.");
    }
  } else {
    Console.info(`Directory path "${path}" not found, creating one...`);
    fs.mkdir(path, () => {});
  }
}
