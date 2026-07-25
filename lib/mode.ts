/**
 * Mode persistence for OS vs Website worlds.
 *
 * Each mode lives at its own route (`/os` and `/site`) and remembers its
 * last-visited mode so `/` can redirect the returning visitor to the right
 * place without a flash.
 */

export type ZenithMode = "os" | "site";

const MODE_KEY = "zenith:mode";
export const DEFAULT_MODE: ZenithMode = "os";

export function readMode(): ZenithMode {
  if (typeof window === "undefined") return DEFAULT_MODE;
  try {
    const v = window.localStorage.getItem(MODE_KEY);
    return v === "site" || v === "os" ? v : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

export function writeMode(mode: ZenithMode): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function pathForMode(mode: ZenithMode): "/os" | "/site" {
  return mode === "site" ? "/site" : "/os";
}
