let lockCount = 0;

export function lockBodyScroll(): void {
  lockCount++;
  if (lockCount === 1) {
    document.body.style.overflow = "hidden";
  }
}

export function unlockBodyScroll(force = false): void {
  if (force) {
    lockCount = 0;
  } else {
    lockCount = Math.max(0, lockCount - 1);
  }
  if (lockCount === 0) {
    document.body.style.overflow = "";
    document.body.classList.remove("scroll-locked");
  }
}
