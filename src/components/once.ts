export const once = (fn: (...args: any[]) => any) => {
  let called = false;
  let result = null;
  return (...args) => {
    if (called) {
      return result;
    }
    result = fn(...args);
    called = true;
  };
};
