/**
 * Set a cookie.
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} [options] - Cookie options
 * @param {string} [options.path='/'] - Cookie path
 * @param {string} [options.domain] - Cookie domain
 * @param {number} [options.maxAge] - Max age in seconds
 * @param {boolean} [options.secure] - Secure flag
 * @param {string} [options.sameSite] - SameSite attribute (Strict, Lax, None)
 */
export function setCookie(name, value, options = {}) {
  const { path = '/', domain, maxAge, secure, sameSite } = options;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  cookie += `; path=${path}`;

  if (domain) cookie += `; domain=${domain}`;
  if (maxAge !== undefined) cookie += `; max-age=${maxAge}`;
  if (secure) cookie += '; secure';
  if (sameSite) cookie += `; samesite=${sameSite}`;

  document.cookie = cookie;
}

/**
 * Get a cookie value by name.
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export function getCookie(name) {
  const encoded = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split('; ');

  for (const cookie of cookies) {
    if (cookie.startsWith(encoded)) {
      return decodeURIComponent(cookie.slice(encoded.length));
    }
  }

  return null;
}

/**
 * Delete a cookie by name.
 * @param {string} name - Cookie name
 * @param {Object} [options] - Cookie options (path, domain must match the original)
 */
export function deleteCookie(name, options = {}) {
  setCookie(name, '', { ...options, maxAge: 0 });
}

/**
 * Get all cookies as a key-value object.
 * @returns {Object} Object with cookie names as keys and decoded values
 */
export function getAllCookies() {
  if (!document.cookie) return {};

  return document.cookie.split('; ').reduce((acc, cookie) => {
    const eqIndex = cookie.indexOf('=');
    if (eqIndex === -1) return acc;

    const name = decodeURIComponent(cookie.slice(0, eqIndex));
    const value = decodeURIComponent(cookie.slice(eqIndex + 1));
    acc[name] = value;
    return acc;
  }, {});
}
