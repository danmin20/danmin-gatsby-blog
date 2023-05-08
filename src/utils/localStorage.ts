export const getValueFromLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return;
  const value = window.localStorage.getItem(key);
  return JSON.parse(value || 'null');
};

export const setValueToLocalStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};
