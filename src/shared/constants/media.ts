const pxToRem = (pixels: number) => {
  return pixels / 16
}

const MATCH_MEDIA = {
  laptop: window.matchMedia(`(width <= ${pxToRem(1400.98)}rem)`),
}

export { MATCH_MEDIA, pxToRem }
