import { Pen } from './pen'
window.addEventListener('load', loadImg, false);

let imgCanvas = document.querySelector('#matting-img');
let imgCtx = imgCanvas.getContext('2d');
// img example 
function loadImg() {
  let img = new Image()
  img.onload = () => {
    let w = img.width
    let h = img.height

    imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height)
    imgCanvas.width = w * 1.5
    imgCanvas.height = h * 1.2
    imgCtx.drawImage(img, 0, 0, w * 1.5, h * 1.2)

    // Use class Pen here 
    let pen = new Pen()
    pen.reset()
  }
  img.src = require('../img/tianer.jpg')
}
