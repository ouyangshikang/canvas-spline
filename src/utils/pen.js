import { ControlPoint } from './control-point'
import { Path } from './path'
import { EndPoint } from './end-point'

export class Pen {
  constructor (name = 'pen', id = 'matting-pen') {
    this.name = name
    this.canvas = document.querySelector('#'+ id)
    this.ctx = this.canvas.getContext('2d')
    this.stroke_color = '#ffc107' // 线条颜色
  }
  reset () {
    this.paths = []
    this.paths.push(new Path())

    this.dragging = false  // 是否正在拖动
    this.editCpBalance = false // 
    this.isNewEndPoint = false  // 是否新点
    this.currentEndPoint = null  // 当前点
    this.draggingControlPoint = null  // 当前控制点
    // this.zoomRatio = 1  // 缩放比例

    ControlPoint.prototype.ctx = this.ctx
    EndPoint.prototype.ctx = this.ctx
    EndPoint.prototype.canvas = this
    
    let imgCvs = document.querySelector('#matting-img')
    console.log(imgCvs.width)
    this.canvas.width = imgCvs.width
    this.canvas.height = imgCvs.height
    this.active()
  }

  positionToCanvas (x, y) {
    let bbox = this.canvas.getBoundingClientRect()
    return {
      x: x - bbox.left * (this.canvas.width  / bbox.width),
      y: y - bbox.top  * (this.canvas.height / bbox.height)
    }
  }

  onMouseDown(e) {
    console.log('mousedown', e)

    let loc = this.positionToCanvas(e.clientX, e.clientY)
    
    let relativeLoc = {x: loc.x, y: loc.y}
    let selectedPath = this.getSelectedPath()
    loc = {x: loc.x, y: loc.y}
    this.dragging = true
    this.isNewEndPoint = false
    this.draggingControlPoint = false
    this.currentEndPoint = this.isExistPoint(relativeLoc.x, relativeLoc.y)
    this.removeSelectedEndPoint()

    if(this.currentEndPoint ){
      // 如果已经存在点
      this.currentEndPoint.selected = true;

      if(this.editCpBalance && !this.draggingControlPoint) {
        let ced = this.currentEndPoint
        ced.cpBalance = true
        ced.cp0.x = ced.cp1.x = ced.x
        ced.cp0.y = ced.cp1.y = ced.y
        this.isNewEndPoint = true
      }

      if(!this.draggingControlPoint && this.currentEndPoint === this.paths[this.paths.length -1][0] && this.paths[this.paths.length -1].length > 2){
          // click first endpoint
          // close path
          this.createPath()
      }
    } else {
       this.currentEndPoint = this.createEndPoint(relativeLoc.x, relativeLoc.y)
       this.isNewEndPoint = true;
       if(this.editCpBalance && selectedPath){
          // keydown alt/option
          // add endpoint to selectedendpoint after
         selectedPath.path.addEndPoint(selectedPath.ep, this.currentEndPoint)
      }else {
        this.paths[this.paths.length - 1].push(this.currentEndPoint)
      }
    }
    this.renderer()
  }

  onMouseMove(e) {
    e.preventDefault()
    // console.log('mousemove', e)
    if(!this.dragging) {
      return
    }
    let loc = this.positionToCanvas(e.clientX, e.clientY)
    loc = {x: loc.x, y: loc.y}
    let ced = this.currentEndPoint

    this.canvas.style.cursor = 'move'

    if(this.isNewEndPoint){
        ced.cp1.x = loc.x
        ced.cp1.y = loc.y

        ced.cp0.x = ced.x * 2 - loc.x
        ced.cp0.y = ced.y * 2 - loc.y
    } else if(this.draggingControlPoint){
        // dragging  controlPoint
        console.log('dragging controlPoint')
        if(this.editCpBalance){
            ced.cpBalance = false
        }
        this.draggingControlPoint.x = loc.x
        this.draggingControlPoint.y = loc.y
        ced.calculateControlPoint(loc.x, loc.y, this.draggingControlPoint)
    } else {
        console.log('dragging endpoint')
        // dragging  endpoint
        // let offset = {
        //   x: loc.x - ced.x,
        //   y: loc.y-ced.y
        // }
        // ced.x = loc.x
        // ced.y = loc.y

        // ced.cp1.x += offset.x
        // ced.cp1.y += offset.y
        // ced.cp0.x += offset.x
        // ced.cp0.y += offset.y
    }
    this.renderer()
  }
  onMouseUp(e) {
    console.log('mouseup', e)
    this.canvas.style.cursor = 'default'
    this.dragging = false
    if(this.draggingControlPoint){
      if(this.draggingControlPoint.counterpart) {
        delete this.draggingControlPoint.counterpart.staticDistance
      }
      delete this.draggingControlPoint.counterpart
      this.draggingControlPoint = false
    }
  }
  active() {
    let that = this
    let listeners = {
      mousedown(e) { that.onMouseDown(e) },
      mousemove(e) { that.onMouseMove(e) },
      mouseup(e) { that.onMouseUp(e) }
  };
    this.canvas.addEventListener('mousedown', listeners.mousedown, false)
    this.canvas.addEventListener('mousemove', listeners.mousemove, false)
    this.canvas.addEventListener('mouseup', listeners.mouseup, false)
  }


  createPath() {
    this.paths[this.paths.length - 1].isClose = true
    this.paths.push(new Path())
  }

  getSelectedPath() {
    let i=0, j, l1, l2
    for(l1 = this.paths.length; i< l1; i++){
      for(j=0, l2 = this.paths[i].length; j < l2; j++){
        if(this.paths[i][j].selected){
          return {
            path: this.paths[i],
            ep: this.paths[i][j]
          }
        }
      }
    }
    return null
  }

  removeSelectedEndPoint() {
    this.paths.forEach((path) => {
        path.removeSelected()
    })
  }

  createEndPoint(x, y) {
    let ep = new EndPoint(x, y)
    ep.selected = true
    return ep
  }

  // deleteEndPoint() {
  //   let paths = this.paths
  //   for(let i=0, l = paths.length; i < l; i++){
  //     paths[i].deleteSelected()
  //     if(paths[i].length === 0 && (i + 1 !== l)){
  //       paths.splice(i, 1)
  //       l = paths.length
  //       i--
  //     }
  //   }
  // }

  isExistPoint(x, y) {
    let cep, i = 0, l
    for(l = this.paths.length; i< l; i++){
      cep = this.paths[i].isInPoint(x, y)
      if(cep){
        if(cep.cp instanceof ControlPoint){
            // set  controlpoint
            this.draggingControlPoint = cep.cp
        }
        return cep.ep
      }
    }
    return null
  }
  // renderer the spline
  renderer() {
    let ep, prev_ep,
        ctx = this.ctx
    // let self = this
    // let ratio = self.zoomRatio

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.paths.forEach((path) => {
      for(let i = 0, l = path.length; i < l; i++) {
        ep = path[i]
        ep.printControlPoints()
        if(i > 0) {
          // draw line
          prev_ep = path[i - 1];
          this.bezierCurveTo(prev_ep, ep, ctx)
        }
      }
      if(path.isClose){
          prev_ep = path[l - 1]
          ep = path[0]
          this.bezierCurveTo(prev_ep, ep, ctx)
      }
    })
  }

  bezierCurveTo(prev_ep, ep, ctx) {
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = this.stroke_color
    ctx.lineWidth = 2
    ctx.moveTo(prev_ep.x, prev_ep.y)
    ctx.bezierCurveTo(
        prev_ep.cp1.x, prev_ep.cp1.y,
        ep.cp0.x, ep.cp0.y,
        ep.x, ep.y
    )
    ctx.stroke()
    ctx.restore()
  }
}

