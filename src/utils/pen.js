export class Pen {
  constructor (name = 'pen', id = 'matting-pen') {
    this.name = name
    this.canvas = document.querySelector('#'+ id)
    this.ctx = this.canvas.getContext('2d')
    this.stroke_color = '#000' // 线条颜色
  }
  reset () {
    this.paths = []
    console.log('paths')
  }
}