const capitalizeLetterAdjacentUnderscores = str =>
  str.replace(/_([a-z])/g, g => g[1].toUpperCase())

module.exports = capitalizeLetterAdjacentUnderscores
