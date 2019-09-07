import { isEqual } from 'lodash';

export const isDefined = x => {
  return x !== null && x !== undefined;
};

export const isValidJSON = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const isValidData = data => {
  if (Array.isArray(data) && data.length) {
    const allKeys = [...new Set(data.map(d => Object.keys(d)))];
    return allKeys.every((val, i, arr) => isEqual(val, arr[0]));
  }
  return false;
};

export const isEqualPadding = (a, b) => {
  if (isDefined(a) && isDefined(b)) {
    return (
      a.top === b.top &&
      a.left === b.left &&
      a.right === b.right &&
      a.bottom === b.bottom
    );
  }

  return a === b;
};

export const isEqualData = (a, b) => {
  if (isValidData(a) && isValidData(b)) {
    return isEqual(a, b);
  }

  return false;
};

export const isEqualSpec = (a, b) => {
  if (isValidJSON(a) && isValidJSON(b)) {
    return isEqual(a, b);
  }

  return false;
};
