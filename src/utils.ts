export const prefixKeys = (obj: object, prefix: string) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [prefix + key, value];
    })
  );
};

export const flattenKeys = (obj: any) => {
  const entries: any = Object.entries({ ...obj }).reduce(
    (acc, [key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value).length > 0
      ) {
        const flat = prefixKeys(flattenKeys(value), key + ".");

        return {
          ...acc,
          ...flat,
        };
      } else {
        return {
          ...acc,
          [key]: value,
        };
      }
    },
    {}
  );

  return entries;
};
