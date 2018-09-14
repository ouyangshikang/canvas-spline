const pointStyle = {
  control_point_radius: 4,
  control_point_color: '#005cf9'
}
export class ControlPoint {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
  }
  
  /* 画控制点 */
  draw(ratio) {
    ratio = ratio || 1
    this.ctx.beginPath()
    this.ctx.arc(this.x * ratio, this.y * ratio, pointStyle.control_point_radius, 0, Math.PI * 2, false)
  }
  print(ratio) {
    this.draw(ratio)
    this.ctx.save()
    this.ctx.strokeStyle = pointStyle.control_point_color
    this.ctx.fillStyle = pointStyle.control_point_color
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