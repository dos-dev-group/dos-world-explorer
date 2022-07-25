export function spacing(n: number) {
  return n * 8;
}

export function topNavigationSizing(n: number) {
  return 48 + 8 * n;
}

export function asideNavigationSizing(n: number) {
  return 200 + 8 * n;
}

export const mqMinWidth = (bp: number) => `@media (min-width: ${bp}px)`;
export const mqMinHeight = (bp: number) => `@media (min-height: ${bp}px)`;

export const firstNaviSize = topNavigationSizing(2);
export const secondNaviSize = topNavigationSizing(0);

export const valueFontFamily = 'Lucida Console';
