export function getValueFromLocalStorage(key: string) {
  if (typeof window === 'undefined') return;
  return JSON.parse(window.localStorage.getItem(key) ?? 'null');
}

export function setValueToLocalStorage(key: string, value: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
