import { ControlPoint } from './control-point'
// path 类
export class Path{
  constructor (isClose = false) {
    // super()
    this.isClose = isClose  // 路径是否关闭

  }

  isInPoint(x, y) {
    let cep
    for(let i = 0,len = this.length; i < len; i++){
      cep = this[i].isInPoint(x, y)
      if(cep){
        return {
            ep: this[i], 
            cp : cep instanceof ControlPoint ? cep : null
        }
      }
    }
    return null
  }

  removeSelected() {
    this.forEach((ep) => {
      ep.selected = false
    })
  }

  deleteSelected() {
    for(let i = 0, len = this.length; i < len; i++){
      if(this[i].selected){
        this.splice(i, 1)
        len = this.length
        i--
      }
    }
  }

  addEndPoint(oed, ed) {
    for(let i = 0, len = this.length; i < len; i++){
      if(this[i] === oed){
          this.splice(i + 1, 0, ed);
      }
    }
  }
}
Object.setPrototypeOf(Path.prototype, Array.prototype);