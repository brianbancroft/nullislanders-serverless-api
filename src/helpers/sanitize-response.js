module.exports = obj => {
  if (obj.password) delete obj.password
  if (obj.validateToken) delete obj.validateToken
  return obj
}
