const autoprefixer = require("autoprefixer")
const pxToRem = require("postcss-pxtorem")

module.exports = {
  plugins: [
    autoprefixer({}),
    pxToRem({
      rootValue: 16,
      unitPrecision: 5,
      propList: ["*"],
      selectorBlackList: [],
      replace: true,
      mediaQuery: true,
      minPixelValue: 0,
      exclude: "/node_modules/i",
    }),
  ],
}
