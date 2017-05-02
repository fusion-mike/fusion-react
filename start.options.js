
module.exports = {
  string: ['host', 'proxyHost', 'port', 'proxy', 'proxyPort', 'api'],
  alias: {
    'port': 'p',
    'host': ['h', 'proxyHost'],
    'proxy': ['api', 'proxyPort']
  },
  default: {
    'port': 7003,
    'host': 'localhost',
    'proxy': undefined
  }
}
