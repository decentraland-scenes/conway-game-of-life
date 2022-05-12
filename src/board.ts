@Component('Board')
export class Board {
  width: number
  height: number
  grid: Array<Array<IEntity | null>>
  constructor(width: number, height: number) {
    this.width = width
    this.height = height

    this.grid = new Array<Array<IEntity | null>>(width)
    for (let x = 0; x < width; x++) {
      this.grid[x] = new Array<IEntity | null>(height)
      for (let y = 0; y < height; y++) {
        this.grid[x][y] = null
      }
    }
  }
}
