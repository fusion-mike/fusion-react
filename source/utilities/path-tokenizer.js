
if (!Array.prototype.isArray) {
  const toString = {}.toString

  Array.prototype.isArray = (arr) => (
    toString.call(arr) === '[object Array]'
  )
}

const baseDelimiter = '/'
const expression = new RegExp(
  '([\\/.])?(?:(?:\\:(\\w+))([?])?)', 'g')

const bindKeys = (context, keys) => {
  context.keys = keys
  return context
}

const escapeString = (s) => (
  s.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
)

const parse = (s) => {
  const tokens = []
  let path = ''
  let index = 0
  let result

  while ((result = expression.exec(s)) !== null) {
    const match = result[0]
    const prefix = result[1]
    const name = result[2]
    const modifier = result[3]
    const offset = result.index

    path += s.slice(index, offset)
    index = (offset + match.length)

    if (path) {
      tokens.push(path)
      path = ''
    }

    const delimiter = prefix || baseDelimiter
    const optional = (modifier === '?')

    tokens.push(Object.assign({}, {
      name: name,
      optional: optional,
      delimiter: delimiter,
      expression: '[^' + escapeString(delimiter) + ']+?'
    }))
  }

  if (index < s.length)
    path += s.substr(index)

  if (path)
    tokens.push(path)

  return tokens
}

const tokenize = (tokens, keys) => {
  if (!Array.isArray(keys))
    keys = []

  let path = ''
  tokens.forEach((token) => {
    if (typeof token === 'string') {
      path += escapeString(token)
      return
    }

    keys.push(token)
    const delimiter = escapeString(token.delimiter)
    const capture = '(?:' + token.expression + ')'

    path += (token.optional)
      ? '(?:' + delimiter + '(' + capture + '))?'
      : delimiter + '(' + capture + ')?'
  })

  const delimiter = escapeString(baseDelimiter)
  const delimiterAtEnd = (path.slice(-delimiter.length) === delimiter)
  if (delimiterAtEnd)
    path = path.slice(0, -delimiter.length)

  path += '(?:' + delimiter + '(?=$))?$'
  return bindKeys(new RegExp('^' + path), keys)
}

const tokenizePath = (path, keys) => {
  if (!Array.isArray(keys))
    keys = []

  const tokens = parse(path)
  return tokenize(tokens, keys)
}

export default tokenizePath
