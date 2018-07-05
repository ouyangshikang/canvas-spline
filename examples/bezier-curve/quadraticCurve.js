window.addEventListener('load', drawBezier, false);
// draw Bezier lines
function drawBezier() {
  let bezier = document.getElementById('bezier')
  let ctx = bezier.getContext('2d');
  init(bezier.className === 'quadratic')

  // global varible 
  let dragPoint = null
  let dragPointPos = null
  // define initial points
  function init(quadratic) {
    point = {
      p1: {
        x: 100,
        y: 250
      },
      p2: {
        x: 400,
        y: 250
      }
    }
    
    // quadratic or cubic
    if (quadratic) {
      point.cp1 = {
        x: 250,
        y: 100
      }
    } else {
      point.cp1 = {
        x: 150,
        y: 100
      },
      point.cp2 = {
        x: 350,
        y: 100
      }
    }

    // default style
    style = {
      curve: { // 曲线
        width: 4,
        color: '#f00'
      },
      cpline: { // 直线
        width: 2,
        color: '#000'
      },
      point: {
        radius: 5, // 半径
        width: 2,
        color: '#f00',
        fill: 'rgba(200, 200, 200, .5)',
        arc1: 0,
        arc2: 2 * Math.PI
      }
    }

    bezier.addEventListener('mousedown', dragStart, false)
    bezier.addEventListener('mousemove', dragging, false)
    bezier.addEventListener('mouseup', dragEnd, false)
    bezier.addEventListener('mouseout', dragEnd, false)

    drawing()


  }
  // drawing Bezier lines
  function drawing() {
    // clear the canvas
    ctx.clearRect(0, 0, bezier.width, bezier.height)
    // inital line style
    ctx.lineWidth = style.cpline.width
    ctx.strokeStyle = style.cpline.color

    ctx.beginPath()
    ctx.moveTo(point.p1.x, point.p1.y)
    ctx.lineTo(point.cp1.x, point.cp1.y)
    if (point.cp2) {
      ctx.moveTo(point.p2.x, point.p2.y)
      ctx.lineTo(point.cp2.x, point.cp2.y)
    } else {
      ctx.lineTo(point.p2.x, point.p2.y)
    }
    ctx.stroke()

    // init line style
    ctx.lineWidth = style.curve.width
    ctx.strokeStyle = style.curve.color

    ctx.beginPath()
    ctx.moveTo(point.p1.x, point.p1.y)
    if (point.cp2) {
        // 绘制三次曲线
        ctx.bezierCurveTo(point.cp1.x, point.cp1.y, point.cp2.x, point.cp2.y, point.p2.x, point.p2.y)
    } else {
        // 绘制二次曲线
        ctx.quadraticCurveTo(point.cp1.x, point.cp1.y, point.p2.x, point.p2.y)
    }
    ctx.stroke()

    for(let p in point) {
      ctx.lineWidth = style.point.width
      ctx.strokeStyle = style.point.color
      ctx.fillStyle = style.point.fill
      ctx.beginPath()
      const arc1 = style.point.arc1
      const arc2 = style.point.arc2
      const radius = style.point.radius
      ctx.arc(point[p].x, point[p].y, radius, arc1, arc2, true)
      ctx.stroke()
    }
  }

  function dragStart(e) {
    console.log('dragStart position:', mousePos(e))
    let pos = mousePos(e)
    let dx, dy
    for (let p in point) {
      dx = point[p].x - pos.x;
      dy = point[p].y - pos.y;

      if ((dx * dx) + (dy * dy) < style.point.radius * style.point.radius) {
          dragPoint = p
          dragPointPos = pos
          bezier.style.cursor = 'move'
          return
      }
    }
  }

  function dragging(e) {
    if (dragPoint) {
      let pos = mousePos(e)
      point[dragPoint].x += pos.x - dragPointPos.x
      point[dragPoint].y += pos.y - dragPointPos.y
      dragPointPos = pos
      drawing()
    }
  }

  function dragEnd(e) {
    dragPoint = null
    bezier.style.cursor = 'default'
    drawing()
  }
  // mouse position
  function mousePos(event) {
    event = event ? event : window.envent 
    return {
      x: event.pageX - bezier.offsetLeft,
      y: event.pageY - bezier.offsetTop
    }
  }
}