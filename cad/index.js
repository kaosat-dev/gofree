const { rotate, translate, mirror } = require('@jscad/csg/api').transformations
const { color } = require('@jscad/csg/api').color
const { cylinder, sphere, cube } = require('@jscad/csg/api').primitives3d

const myComponent = () => {
  return cube({ size: 150 })
}

const paramDefaults = {}

const main = (params) => {
  params = Object.assign({}, paramDefaults, params)

  let results = [
    myComponent()
  ]
  // results = params.showEmitter ? results.concat(emitter(params)) : results
  return results
}

module.exports = { main }
