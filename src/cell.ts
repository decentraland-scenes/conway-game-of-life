@Component('Cell')
export class Cell {
  x: number
  y: number
  alive: 0 | 1
  neighbors: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.alive = 0
    this.neighbors = 0
  }
}