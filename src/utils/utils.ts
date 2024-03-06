/**
 * Pop stuff from the string or array, mutating the original
 * @param src
 * @param value
 * @returns
 */
export function pop(arr: string[], value: string | RegExp): string {
  if (value instanceof RegExp) {
    // the regex version is a bit more complex, since we need to find all matching classes and remove them
    const matches = arr.filter((c) => value.test(c));
    matches.forEach((m) => {
      const index = arr.indexOf(m);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    });

    return matches.join(" ");
  }

  const index = arr.indexOf(value);
  if (index !== -1) {
    const returnValue = arr.splice(index, 1)[0];

    return returnValue;
  }
  return "";
}
