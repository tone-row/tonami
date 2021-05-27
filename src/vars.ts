const baseObject = (str = "var(-)") => {
  function Faker() {}
  Faker.prototype.toString = (fallback?: string) =>
    fallback?.toString() ? str.slice(0, -1) + ", " + fallback + ")" : str;
  return new (Faker as any)();
};

function makeProxy(base = baseObject()) {
  return new Proxy(base, {
    get(target, key) {
      if (!(key in target)) {
        target[key] = makeProxy(
          baseObject(base.toString().slice(0, -1) + "-" + (key as string) + ")")
        );
      }
      return target[key];
    },
  });
}

export const v = makeProxy();
