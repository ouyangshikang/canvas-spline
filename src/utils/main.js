import { Pen } from './pen'
window.addEventListener('load', loadImg, false);

let imgCanvas = document.querySelector('#matting-img');
let imgCtx = imgCanvas.getContext('2d');
function loadImg() {
  let img = new Image()
  img.onload = () => {
    let w = img.width
    let h = img.height

    imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height)
    imgCanvas.width = w
    imgCanvas.height = h
    imgCtx.drawImage(img, 0, 0)
  }
  img.src = require('../img/logo.png')

  let pen = new Pen()
  pen.reset()
}
