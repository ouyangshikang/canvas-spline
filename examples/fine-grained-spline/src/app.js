import { FlexLine } from './flex-line'
import { initStage, initLayer } from './utils'

export class App {
  stage = initStage()
  layer = initLayer()

  constructor () {
    window.app = this
    this.bindStageEvents()
    this.stage.add(this.layer)
  }

  get pointerPosition () {
    return this.stage.getPointerPosition()
  }

  addToLayer = (shape) => {
    this.layer.add(shape)
  }

  draw = () => this.layer.draw()

  bindStageEvents = () => {
    this.stage.on('click', () => {
      const { x, y } = this.pointerPosition
      // TODO keep references to flex lines.
      const flexLine = new FlexLine(this)
      flexLine.addPoint(x, y)
    })
  }
}