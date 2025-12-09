globalThis.process ??= {}; globalThis.process.env ??= {};
function formatPrice(price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(price);
}
function formatDate(timestamp, includeTime = false) {
  const date = new Date(timestamp * 1e3);
  if (includeTime) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date);
  }
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short"
  }).format(date);
}
function getFromStorage(key, defaultValue) {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export { formatDate as a, formatPrice as f, getFromStorage as g };
