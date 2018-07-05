import { Stage, Layer } from 'konva'

let _id = 0

export const initStage = () => new Stage({
  container: 'container',
  width: 640,
  height: 480
})

export const initLayer = () => new Layer({})

// Generate unique id.
export function getId () {
  return _id++
}

export function getControlPoints (x0, y0, x1, y1, x2, y2, t = 0.5) {
  const d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2))
  const d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  const fa = t * d01 / (d01 + d12)
  const fb = t * d12 / (d01 + d12)
  const p1x = x1 - fa * (x2 - x0)
  const p1y = y1 - fa * (y2 - y0)
  const p2x = x1 + fb * (x2 - x0)
  const p2y = y1 + fb * (y2 - y0)
  return [
    { x: p1x, y: p1y }, { x: p2x, y: p2y }
  ]
}