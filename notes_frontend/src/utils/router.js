/**
 * PUBLIC_INTERFACE
 * getQueryParams
 * Returns the current location's query parameters as an object.
 */
export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params.entries());
}

/**
 * PUBLIC_INTERFACE
 * setQueryParams
 * Merge new params with existing and push to history without page reload.
 * @param {Record<string,string|undefined>} updates
 */
export function setQueryParams(updates) {
  const params = new URLSearchParams(window.location.search);
  Object.entries(updates).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") params.delete(k);
    else params.set(k, String(v));
  });
  const next = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, "", next);
  const ev = new Event("querychange");
  window.dispatchEvent(ev);
}
