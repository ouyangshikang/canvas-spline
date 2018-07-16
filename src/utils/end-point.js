import { ControlPoint } from './control-point'
const pointStyle = {
  end_point_length: 5,
  mouse_end_point_length: 10,
  end_point_color: '#5d5d5d', // 轮廓颜色
  stroke_width: 2, // 轮廓宽度
  fill_color: '#ffffff', // 填充颜色
  hover_fill_color: '#ffc107' // 选中时的填充颜色
}
export class EndPoint {
  constructor(x, y, cp0, cp1) {
    this.x = x || 0
    this.y = y || 0
    this.selected = false // endpoint被选中
    this.cp0 = cp0 || new ControlPoint(x, y)
    this.cp1 = cp1 || new ControlPoint(x, y)
    this.cpBalance = true  // 控制平衡点
  }
  // canvas() {
  //   return canvas
  // }
  // ctx() {
  //   return ctx
  // }
  draw(ratio) {
    ratio = ratio || 1
    this.ctx.beginPath()
    this.ctx.arc(this.x * ratio, this.y * ratio, pointStyle.end_point_length, 0, Math.PI * 2, false)
  }

  print(ratio) {
    ratio = ratio || 1
    this.draw(ratio)
    this.ctx.save()
    this.ctx.strokeStyle = pointStyle.end_point_color
    this.ctx.fillStyle = pointStyle.fill_color
    this.ctx.lineWidth = pointStyle.stroke_width
    if(this.selected){
      this.ctx.fillStyle = pointStyle.hover_fill_color
    }
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }
  
  // 绘制控制点
  printControlPoints(ratio) {
    ratio = ratio || 1
    this.print(ratio)
    if(!this.selected) {
      return
    }
    if(this.cp0.x !== this.x || this.cp0.y !== this.y){
      this.cp0.print(ratio)
      this.line(this.cp0.x, this.cp0.y, this.x,this.y, this.ctx, pointStyle.end_point_color)
    }
    if(this.cp1.x !== this.x || this.cp1.y !== this.y){
      this.cp1.print(ratio)
      this.line(this.cp1.x, this.cp1.y, this.x,this.y, this.ctx, pointStyle.end_point_color)
    }
  }
  // draw line
  line(x1, y1, x2, y2, ctx, color){
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.strokeStyle = color
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.restore()
  }

  isInPoint(x, y) {
    this.draw(pointStyle.mouse_end_point_length)
    if(this.ctx.isPointInPath(x, y)) {
        return this
    }
    if(this.selected){
      if(this.cp0.isInPoint(x, y)){
        return this.cp0;
      }
      if(this.cp1.isInPoint(x, y)){
        return this.cp1;
      }
    }
    return false
  }

  distanceOfPoint(controlPoint) {
    return Math.sqrt(
      Math.pow(this.x - controlPoint.x, 2) + Math.pow(this.y - controlPoint.y, 2)
    )
  }

  calculateControlPoint(x, y, controlPoint) {
    if(this.cpBalance) {
      controlPoint.counterpart = (
        controlPoint === this.cp0 ? this.cp1 : this.cp0
      )
      controlPoint.counterpart.staticDistance = controlPoint.counterpart.staticDistance
                                              ? controlPoint.counterpart.staticDistance 
                                              : this.distanceOfPoint(controlPoint.counterpart)

      let staticDistance = controlPoint.counterpart.staticDistance
      let dynamicDistance = this.distanceOfPoint(controlPoint)

      controlPoint.counterpart.x = staticDistance / dynamicDistance * (this.x - x) + this.x
      controlPoint.counterpart.y = staticDistance / dynamicDistance * (this.y - y) + this.y
      // controlPoint.counterpart will be deleted on mouseup
    }
    controlPoint.x = x
    controlPoint.y = y
  }
}