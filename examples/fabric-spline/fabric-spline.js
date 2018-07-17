let canvas = new fabric.Canvas('matting-pen')
let path = new fabric.Path('M0,0L100,100C50,50,60,60,70,70z', {
  opacity: .5, // 线条透明度
  stroke: '#000', // 颜色
  strokeLineCap: 'round', // 线头样式
  strokeWidth: 1, // 线宽
  fill: false, // 填充透明
  strokeLineJoin: 'round' // 交点样式
})
canvas.add(path)