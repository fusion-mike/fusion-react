
import tokenize from './path-tokenizer'

const cache = []
const matchPath = (path, uri) => {
  let cached = cache.find((entry) => (
    entry.path === path
  ))

  if (!cached || cached === null) {
    const keys = []
    const pattern = tokenize(path, keys)
    cached = Object.assign({}, {
      path: path,
      keys: keys,
      pattern: pattern
    })

    cache.push(cached)
  }

  const { keys, pattern } = cached
  const matched = pattern.exec(uri)
  if (!matched)
    return null

  const params = Object.create(null)
  for (let index = 1; index < matched.length; index++) {
    params[keys[index - 1].name] = (matched[index] !== undefined)
      ? matched[index]
      : undefined
  }

  return params
}

const match = (routes, context) => (
  routes.reduce((agg, route) => {
    if (agg && agg !== null)
      return agg

    const params = matchPath(route.path, context.pathname)
    if (!params || params === null)
      return agg

    const routeContext = Object.assign({ params }, context)
    return { route, routeContext }
  }, null)
)

export default { match }
