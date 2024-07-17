import * as merge from 'lodash.merge'
import EcomSearch from '@ecomplus/search-engine'

const storeSpec = 'Fastcakes'

EcomSearch.dslMiddlewares.push((dsl) => {
  dslMiddlewares.push(dsl => {
    merge(dsl, {
      query: {
        bool: {
          filter: [{
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
          }]
        }
      }
    })
  })
})
