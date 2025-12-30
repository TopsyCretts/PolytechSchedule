const pxToRem = (pixels: number) => {
  return pixels / 16
}

const MATCH_MEDIA = {
  laptopAbove: window.matchMedia(`(width > ${pxToRem(1400.98)}rem)`),
  laptop: window.matchMedia(`(width <= ${pxToRem(1400.98)}rem)`),
  tablet: window.matchMedia(`(width <= ${pxToRem(1023.98)}rem)`),
  mobile: window.matchMedia(`(width <= ${pxToRem(767.99)}rem)`),
  mobile_s: window.matchMedia(`(width <= ${pxToRem(480.98)}rem)`),
}

export { MATCH_MEDIA, pxToRem }
