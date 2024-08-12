import * as merge from 'lodash.merge'
import EcomSearch from '@ecomplus/search-engine'

const storeSpec = 'Festcakes'

const fixCategoryIdsFilter = ({ terms }) => {
  if (
    terms &&
    terms['categories.name'] &&
    /^[0-9a-f]{24}$/.test(terms['categories.name'][0])
  ) {
    terms['categories._id'] = terms['categories.name']
    delete terms['categories.name']
  }
}

EcomSearch.dslMiddlewares.push((dsl) => {
  if (dsl.query && dsl.query.bool) {
    if (dsl.query.bool.filter) {
      dsl.query.bool.filter.forEach(fixCategoryIdsFilter)
    }
    if (dsl.query.bool.must) {
      dsl.query.bool.must.forEach((filter) => {
        if (filter.multi_match) {
          const { fields } = filter.multi_match
          if (Array.isArray(fields)) {
            fields.push('skus')
          }
        }
        fixCategoryIdsFilter(filter)
      })
    }
  }
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
