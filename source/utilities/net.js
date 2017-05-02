
import superagent from 'superagent'
import { Observable } from 'rxjs/Rx'

const execute = (agent, token) => {
  if (token)
    agent = agent.set('Authorization', 'bearer ' + token)

  return new Promise((resolve, reject) => {
    agent.end((err, res) => {
      if (err || !res.ok) {
        reject(Object.assign({}, {
          status: res.statusCode,
          statusText: res.statusText,
          data: res.body
        }))
      } else
        resolve(res.body)
    })
  })
}

const net = {
  get: (req) => {
    let agent = superagent
      .get(req.uri)
      .query(req.params)
      .accept('json')

    return execute(agent, req.token)
  },
  del: (req) => {
    let agent = superagent
      .del(req.uri)
      .query(req.params)
      .accept('json')

    return execite(agent, req.token)
  },
  post: (req) => {
    let agent = superagent
      .post(req.uri)
      .query(req.params)
      .type(req.type || 'json')
      .send(req.data)
      .accept('json')

    return execute(agent, req.token)
  },
  put: (req) => {
    let agent = superagent
      .put(req.uri)
      .query(req.params)
      .type(req.type || 'json')
      .send(req.data)
      .accept('json')

    return execute(agent, req.token)
  },
  observable: {
    get: (req) => {
      const promise = net.get(req)
      return Observable.fromPromise(promise)
    },
    del: (req) => {
      const promise = net.del(req)
      return Observable.fromPromise(promise)
    },
    post: (req) => {
      const promise = net.post(req)
      return Observable.fromPromise(promise)
    },
    put: (req) => {
      const promise = net.put(req)
      return Observable.fromPromise(promise)
    }
  }
}

export default net
