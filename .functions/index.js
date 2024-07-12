const functions = require('firebase-functions')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'true'

exports.ssr = functions.https.onRequest((req, res) => {
  if (
    req.path.length > 1
    && !req.path.startsWith('/app/')
    && !req.path.startsWith('/admin/')
    && !req.path.startsWith('/blog')
    && !req.path.startsWith('/404')
  ) {
    const paths = req.path.split('/').slice(1)
    if (!paths.length < 2 || paths[0] === 'c') {
      res.status(301).set('Location', `/k${req.path}`).end()
      return
    }
    if (!paths[0].includes('k') {
      res.status(301).set('Location', req.path.replace(`/${paths[0]}/`, '/k/')).end()
      return
    }
  }
  ssr(req, res);
});
