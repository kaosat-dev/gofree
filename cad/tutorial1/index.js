const { rotate, translate, mirror, scale } = require('@jscad/csg/api').transformations
const { union, difference } = require('@jscad/csg/api').booleanOps
const { color } = require('@jscad/csg/api').color
const { cylinder, sphere, cube } = require('@jscad/csg/api').primitives3d
const { circle, square } = require('@jscad/csg/api').primitives2d
const { linear_extrude } = require('@jscad/csg/api').extrusions

const { flatten } = require('./arrays')

const paramDefaults = {}

const key = (size = [10, 10, 2]) => {
  return translate(size.map(x => x * -0.5),
    [
      rotate([0, 0, 0],
        difference(
          cube({ size }),
          translate(size.map(x => x * 0.5), sphere({ r: size[2] * 0.9, fn: 12 }))
        )
      )
    ]
  )
}

const keyBoard = () => {
  const numRows = 5
  const keyRows = () => {
    const numKeys = 6

    const keys = Array(numKeys).fill(0).map((keyData, index) => {
      return color([1, 0, 0, 1], translate([index * 12 - 30, 0, 4], key()))
    })

    return union(
      ...keys,
      cube({ size: [100, 10, 5], center: true })
    )
  }

  const keyRowShapes = Array(numRows).fill(0).map((rowData, index) => {
    return translate([0, 20 * index, 0], keyRows())
  })

  return rotate([0, 0, 0],
    ...keyRowShapes)
}

const trackball = () => {
  return color([1, 0, 0, 1], translate([-50, -50, 50], sphere({ r: 25, center: true })))
}

const palmRest = () => {
  const baseShape = union(
    circle({ r: 25, center: true }),
    translate([0, 25, 0], square({ size: [50, 50], center: true }))
  )

  return translate([50, -50, 50], rotate([-90, 0, 90], linear_extrude({ height: 100 }, baseShape)))
}

const main = (params) => {
  params = Object.assign({}, paramDefaults, params)

  let results = [
    trackball(),
    keyBoard(),
    palmRest()
  ]
  // results = params.xxx ? results.concat(comp(params)) : results
  return flatten(results)
}

module.exports = { main }
