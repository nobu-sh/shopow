export function scrollToHash(hash: string, defaultFraction = 1/10) {
  if (hash.startsWith("#")) hash = hash.slice(1);
  if (!hash) return;

  const el = document.querySelector<HTMLElement>(`[data-hash="${hash}"]`);
  if (!el) return;

  // Parse scroll-origin
  const origin = el.getAttribute("data-scroll-origin") ?? "top";
  let originOffset = 0;
  const rect = el.getBoundingClientRect();

  switch (origin) {
    case "center":
      originOffset = rect.height / 2;
      break;
    case "end":
      originOffset = rect.height;
      break;
    case "top":
    default:
      originOffset = 0;
      break;
  }

  // Parse scroll-position
  let fraction = defaultFraction;
  const posAttr = el.getAttribute("data-scroll-position");
  if (posAttr) {
    const [num, denom] = posAttr.split("/").map(Number);
    if (num && denom && denom !== 0) {
      fraction = num / denom;
    }
  }

  const scrollY = window.scrollY + rect.top + originOffset - window.innerHeight * fraction;
  window.scrollTo({ top: scrollY, behavior: "smooth" });
}
