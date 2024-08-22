export function nub<T>(array: T[]): T[] {
  const set = new Set<T>();
  return array.filter(x => {
    if (set.has(x)) return false;
    set.add(x);
    return true;
  });
}

export function nubBy<T, K>(array: T[], by: (t: T) => K): T[] {
  const set = new Set<K>();
  return array.filter(x => {
    const k = by(x);
    if (set.has(k)) return false;
    set.add(k);
    return true;
  });
}
