const { rotate, translate, mirror, scale } = require('@jscad/csg/api').transformations
const { union, difference } = require('@jscad/csg/api').booleanOps
const { color } = require('@jscad/csg/api').color
const { cylinder, sphere, cube } = require('@jscad/csg/api').primitives3d

const paramDefaults = {}

const key = (size = [8, 5, 2]) => {
  return translate(size.map(x => x * -0.5),
    [
      rotate([0, 25, 0],
        difference(
          cube({ size }),
          translate(size.map(x => x * 0.5), sphere({ r: size[2] * 0.9 }))
        )
      )
    ]
  )
}

const main = (params) => {
  params = Object.assign({}, paramDefaults, params)

  let results = [
    key(),
    translate([0, 12, 0], key([4, 2, 1]))
  ]
  // results = params.xxx ? results.concat(comp(params)) : results
  return results
}

module.exports = { main }
