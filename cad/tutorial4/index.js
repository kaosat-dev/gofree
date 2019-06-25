const { rotate, translate, mirror, scale, hull, chain_hull, contract } = require('@jscad/csg/api').transformations
const { union, difference } = require('@jscad/csg/api').booleanOps
const { color } = require('@jscad/csg/api').color
const { cylinder, sphere, cube } = require('@jscad/csg/api').primitives3d
const { circle, square } = require('@jscad/csg/api').primitives2d
const { linear_extrude } = require('@jscad/csg/api').extrusions

const { flatten } = require('./arrays')

const paramDefaults = {
  keyBoard: {
    rows: 5,
    columns: 4
  }
}

const key = (size = [10, 10, 2]) => {
  return translate(size.map(x => x * -0.5),
    [
      rotate([0, 0, 0],
        difference(
          cube({ size })
          // translate(size.map(x => x * 0.5), sphere({ r: size[2] * 0.9, fn: 12 }))
        )
      )
    ]
  )
}

const keyBoard = (numRows = 5, numKeys = 6, keySize = [10, 10, 2], keyDistance = 5) => {
  const fullWidth = numKeys * keySize[0] + (numKeys - 1) * keyDistance - keySize[0]
  const keyRows = () => {
    const keys = Array(numKeys).fill(0).map((keyData, index) => {
      return color([1, 0, 0, 1], translate([index * (keySize[0] + keyDistance) - fullWidth / 2, 0, 4], key(keySize)))
    })

    return keys
  }

  const keyRowShapes = Array(numRows).fill(0).map((rowData, index) => {
    return translate([0, (keySize[1] + keyDistance) * index, 10], keyRows())
  })

  return rotate([0, 0, 0],
    ...keyRowShapes)
}

const trackball = () => {
  return color([1, 0, 0, 1], translate([-50, -50, 50], sphere({ r: 25, center: true })))
}

const palmRest = (capThickess = 4) => {
  const baseOutline = chain_hull(
    circle({ r: 28, center: true }),
    translate([-20, 0, 0], circle({ r: 25 })),
    translate([-20, 0, 0], circle({ r: 25 })),
    translate([-10, 45, 0], circle({ r: 15 })),

    translate([50, 45, 0], circle({ r: 15 })),
    //
    translate([130, 40, 0], circle({ r: 12 })),
    // lastpoint
    translate([150, 25, 0], circle({ r: 10 }))
    // translate([100, 25, 0], square({ size: [50, 50], center: true })),
    // translate([100, -25, 0], square({ size: [50, 50], center: true }))
  )

  const innerOutline = contract(2.5, 1, baseOutline)
  const baseShape = difference(baseOutline, innerOutline)

  const leftCap = translate([50, -50, 50], rotate([-90, 0, 90], linear_extrude({ height: capThickess }, baseOutline)))
  const rightCap = translate([-50 + capThickess, -50, 50], rotate([-90, 0, 90], linear_extrude({ height: capThickess }, baseOutline)))

  // return baseShape
  const bodyShape = translate([50 - capThickess, -50, 50], rotate([-90, 0, 90], linear_extrude({ height: 100 - capThickess * 2 }, baseShape)))

  return [
    difference(
      bodyShape,
      keyBoard()
    ),
    color([1, 1, 0, 1], leftCap),
    color([1, 1, 0, 1], rightCap)
  ]
}

const getParameterDefinitions = ({ previousParameterValues }) => {
  return [
    { name: 'keyboardRows', type: 'int', default: paramDefaults.keyBoard.rows, min: 1, max: 7 },
    { name: 'keyboardCols', type: 'int', default: paramDefaults.keyBoard.columns, min: 1, max: 7 },
    { name: 'keyboardShow', type: 'checkbox', checked: false, caption: 'Show keyboard' }
  ]
}

const main = (params) => {
  params = Object.assign({}, paramDefaults, params)

  let results = [
    trackball(),
    palmRest()
  ]

  const keyboardInstance = keyBoard(params.keyboardRows, params.keyboardCols, [12, 12, 2], 5)

  results = params.keyboardShow ? results.concat(keyboardInstance) : results
  return flatten(results)
}

module.exports = { main, getParameterDefinitions }
