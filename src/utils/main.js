import { Pen } from './pen'
window.addEventListener('load', loadImg, false);

let imgCanvas = document.querySelector('#matting-img');
let imgCtx = imgCanvas.getContext('2d');
function loadImg() {
  let img = new Image()
  img.onload = () => {
    let w = img.width * 2
    let h = img.height * 2

    imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height)
    imgCanvas.width = w
    imgCanvas.height = h
    imgCtx.drawImage(img, 0, 0, w, h)

    let pen = new Pen()
    pen.reset()
  }
  img.src = require('../img/logo.png')
}
