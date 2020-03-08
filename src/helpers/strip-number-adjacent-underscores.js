const stripNumberAdjecentUnderscores = str => str.replace(/_(\d)/g, g => g[1])

module.exports = stripNumberAdjecentUnderscores
