const breakpoints = {
  xs: "480px",
  sm: "768px",
  md: "1024px",
  lg: "1168px",
  xl: "1440px",
  xxl: "1920px",
};

export const theme = Object.freeze({
  breakpoints: Object.assign(Object.values(breakpoints), breakpoints),
  mediaQueries: {
    screen: Object.entries(breakpoints).reduce(
      (rest, [name, value]) => ({ ...rest, [name]: `(min-width: ${value})` }),
      {},
    ),
    pixelRatio: {
      1.5: "(-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi)",
      2: "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
    },
  },
  fontWeights: {
    thin: 100,
    extralight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    heavy: 900,
    extrablack: 950,
  },
  shadows: {
    elevation1: "var(--theme-shadows-elevation-1)",
    elevation2: "var(--theme-shadows-elevation-2)",
    elevation3: "var(--theme-shadows-elevation-3)",
    elevation4: "var(--theme-shadows-elevation-4)",
    elevation5: "var(--theme-shadows-elevation-5)",
    elevation6: "var(--theme-shadows-elevation-6)",

    inset1: "var(--theme-shadows-inset-1)",
  },
  colors: {
    "primary-900": "var(--theme-colors-primary-900)",
    "primary-800": "var(--theme-colors-primary-800)",
    "primary-700": "var(--theme-colors-primary-700)",
    "primary-600": "var(--theme-colors-primary-600)",
    "primary-500": "var(--theme-colors-primary-500)",
    "primary-400": "var(--theme-colors-primary-400)",
    "primary-300": "var(--theme-colors-primary-300)",
    "primary-200": "var(--theme-colors-primary-200)",
    "primary-100": "var(--theme-colors-primary-100)",
    "primary-050": "var(--theme-colors-primary-050)",

    "blue-900": "var(--theme-colors-blue-900)",
    "blue-800": "var(--theme-colors-blue-800)",
    "blue-700": "var(--theme-colors-blue-700)",
    "blue-600": "var(--theme-colors-blue-600)",
    "blue-500": "var(--theme-colors-blue-500)",
    "blue-400": "var(--theme-colors-blue-400)",
    "blue-300": "var(--theme-colors-blue-300)",
    "blue-200": "var(--theme-colors-blue-200)",
    "blue-100": "var(--theme-colors-blue-100)",
    "blue-050": "var(--theme-colors-blue-050)",

    "green-900": "var(--theme-colors-green-900)",
    "green-800": "var(--theme-colors-green-800)",
    "green-700": "var(--theme-colors-green-700)",
    "green-600": "var(--theme-colors-green-600)",
    "green-500": "var(--theme-colors-green-500)",
    "green-400": "var(--theme-colors-green-400)",
    "green-300": "var(--theme-colors-green-300)",
    "green-200": "var(--theme-colors-green-200)",
    "green-100": "var(--theme-colors-green-100)",
    "green-050": "var(--theme-colors-green-050)",

    "yellow-900": "var(--theme-colors-yellow-900)",
    "yellow-800": "var(--theme-colors-yellow-800)",
    "yellow-700": "var(--theme-colors-yellow-700)",
    "yellow-600": "var(--theme-colors-yellow-600)",
    "yellow-500": "var(--theme-colors-yellow-500)",
    "yellow-400": "var(--theme-colors-yellow-400)",
    "yellow-300": "var(--theme-colors-yellow-300)",
    "yellow-200": "var(--theme-colors-yellow-200)",
    "yellow-100": "var(--theme-colors-yellow-100)",
    "yellow-050": "var(--theme-colors-yellow-050)",

    "cyan-900": "var(--theme-colors-cyan-900)",
    "cyan-800": "var(--theme-colors-cyan-800)",
    "cyan-700": "var(--theme-colors-cyan-700)",
    "cyan-600": "var(--theme-colors-cyan-600)",
    "cyan-500": "var(--theme-colors-cyan-500)",
    "cyan-400": "var(--theme-colors-cyan-400)",
    "cyan-300": "var(--theme-colors-cyan-300)",
    "cyan-200": "var(--theme-colors-cyan-200)",
    "cyan-100": "var(--theme-colors-cyan-100)",
    "cyan-050": "var(--theme-colors-cyan-050)",

    "neutral-900": "var(--theme-colors-neutral-900)",
    "neutral-800": "var(--theme-colors-neutral-800)",
    "neutral-700": "var(--theme-colors-neutral-700)",
    "neutral-600": "var(--theme-colors-neutral-600)",
    "neutral-500": "var(--theme-colors-neutral-500)",
    "neutral-400": "var(--theme-colors-neutral-400)",
    "neutral-300": "var(--theme-colors-neutral-300)",
    "neutral-200": "var(--theme-colors-neutral-200)",
    "neutral-100": "var(--theme-colors-neutral-100)",
    "neutral-050": "var(--theme-colors-neutral-050)",
    "neutral-000": "var(--theme-colors-neutral-000)",

    "red-900": "var(--theme-colors-red-900)",
    "red-800": "var(--theme-colors-red-800)",
    "red-700": "var(--theme-colors-red-700)",
    "red-600": "var(--theme-colors-red-600)",
    "red-500": "var(--theme-colors-red-500)",
    "red-400": "var(--theme-colors-red-400)",
    "red-300": "var(--theme-colors-red-300)",
    "red-200": "var(--theme-colors-red-200)",
    "red-100": "var(--theme-colors-red-100)",
    "red-050": "var(--theme-colors-red-050)",

    white: "var(--theme-colors-white)",
  },
  space: {
    xxl: "var(--theme-spacings-xxl)",
    xxs: "var(--theme-spacings-xxs)",
    xs: "var(--theme-spacings-xs)",
    "xxl-2": "var(--theme-spacings-xxl-2)",
    s: "var(--theme-spacings-s)",
    m: "var(--theme-spacings-m)",
    "xxl-3": "var(--theme-spacings-xxl-3)",
    l: "var(--theme-spacings-l)",
    xl: "var(--theme-spacings-xl)",
    "xl-2": "var(--theme-spacings-xl-2)",
    "xxl-4": "var(--theme-spacings-xxl-4)",
    "xxl-5": "var(--theme-spacings-xxl-5)",
    "xxl-6": "var(--theme-spacings-xxl-6)",
    "xxl-7": "var(--theme-spacings-xxl-7)",
    "xxl-8": "var(--theme-spacings-xxl-8)",
    "xxl-9": "var(--theme-spacings-xxl-9)",
    "xxl-10": "var(--theme-spacings-xxl-10)",
  },
});
