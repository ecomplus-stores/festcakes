import * as merge from 'lodash.merge'
import EcomSearch from '@ecomplus/search-engine'

const storeSpec = 'Fastcakes'

EcomSearch.dslMiddlewares.push((dsl) => {
  const storeFilter = {
    nested: {
      path: 'specs',
      query: {
        bool: {
          filter: [{
            term: { 'specs.grid': 'store' }
          }, {
            terms: { 'specs.text': [storeSpec] }
          }]
        }
      }
    }
  }
  const { filter } = (dsl.query && dsl.query.bool) || {}
  if (filter) {
    filter.push(storeFilter)
    return
  }
  merge(dsl, {
    query: {
      bool: { filter: [storeFilter] }
    }
  })
})
