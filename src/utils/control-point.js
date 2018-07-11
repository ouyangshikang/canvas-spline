export class ControlPoint {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
  }
  static CONTROL_POINT_RADIUS = 5
  static CONTROL_POINT_COLOR = '#00ffff'
  
  ctx() {
    return ctx
  }

  /* 画控制点 */
  draw(ratio) {
    ratio = ratio || 1
    this.ctx.beginPath()
    this.ctx.arc(this.x * ratio, this.y * ratio, CONTROL_POINT_RADIUS, 0, Math.PI * 2, false)
  }
  print(ratio) {
    this.draw(ratio)
    this.ctx.save()
    this.ctx.strokeStyle = CONTROL_POINT_COLOR
    this.ctx.fillStyle = CONTROL_POINT_COLOR
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.restore()
  }
  isInPoint(x, y) {
    this.draw()
    if(this.ctx.isPointInPath(x, y)) {
      return true
    }
    return false
  }
}