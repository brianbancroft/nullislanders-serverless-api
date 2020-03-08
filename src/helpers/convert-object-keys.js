// TODO: Think of a functional way to do this...
const convertObjectKeys = transformFn => object => {
  const output = {}

  for (let [key, value] of Object.entries(object)) {
    output[transformFn(key)] = value
  }

  return output
}

module.exports = convertObjectKeys
