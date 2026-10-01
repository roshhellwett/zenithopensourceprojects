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

/**
 * Checks whether the current user is visiting from a mobile device or screen width.
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
      navigator.userAgent
    ) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && window.innerWidth < 1024)
  );
}

export function readMode(): ZenithMode {
  if (typeof window === "undefined") return DEFAULT_MODE;
  // Mobile users are strictly routed to Website mode
  if (isMobileDevice()) return "site";
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
    window.localStorage.setItem(MODE_KEY, isMobileDevice() ? "site" : mode);
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function pathForMode(mode: ZenithMode): "/os" | "/site" {
  if (isMobileDevice()) return "/site";
  return mode === "site" ? "/site" : "/os";
}
