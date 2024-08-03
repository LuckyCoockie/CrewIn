// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeUndefinedKey = (object: any) => {
  Object.keys(object).forEach((key) => {
    if (object[key] == undefined) delete object[key];
  });
  return object;
};
