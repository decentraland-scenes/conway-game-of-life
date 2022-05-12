import { Board } from './board'
import { Cell } from './cell'

export const DEAD = 0
export const LIVE = 1

const FEW = 2
const MANY = 3
const PLENTY = 3

const isLive = (c: number) => c !== DEAD
const isUnderPopulated = (n: number) => n < FEW
const isOverPopulated = (n: number) => n > MANY
const canReproduce = (n: number) => n === PLENTY
const willContinue = (n: number) => !isUnderPopulated(n) && !isOverPopulated(n)

export const getNextGenerationState = (
  neighbours: number,
  state: number,
): number => {
  if (isLive(state)) {
    if (isUnderPopulated(neighbours)) {
      return DEAD
    } else if (isOverPopulated(neighbours)) {
      return DEAD
    } else if (willContinue(neighbours)) {
      return LIVE
    }
  } else if (canReproduce(neighbours)) {
    return LIVE
  }

  return DEAD
}

export const createCell = (parent: IEntity, x: number, y: number) => {
  const entity = new Entity()

  const board = parent.getComponent(Board)

  board.grid[x][y] = entity

  const position = new Vector3(
    x / board.width - 0.5,
    y / board.height - 0.5,
    0.0,
  )

  const transform = new Transform({
    position,
    scale: new Vector3(1.0 / board.width, 1.0 / board.height, 0.9),
  })
  entity.addComponent(transform)

  entity.addComponent(new Cell(x, y))

  entity.setParent(parent)
  engine.addEntity(entity)

  return entity
}

export const setCellAlive = (entity: IEntity) => {
  const boxShape = new BoxShape()
  boxShape.withCollisions = false
  entity.addComponent(boxShape)
  entity.getComponent(Cell).alive = LIVE
}

export const setCellDead = (entity: IEntity) => {
  entity.removeComponent(BoxShape)
  entity.getComponent(Cell).alive = DEAD
}

type Coord = { x: number; y: number }
const neighborCoordinates = (x: number, y: number): Coord[] => [
  { x: x - 1, y: y - 1 },
  { x: x, y: y - 1 },
  { x: x + 1, y: y - 1 },
  { x: x - 1, y: y },
  { x: x + 1, y: y },
  { x: x - 1, y: y + 1 },
  { x: x, y: y + 1 },
  { x: x + 1, y: y + 1 },
]

const neighborMirror = (board: Board, x: number, y: number): Coord[] => {
  return neighborCoordinates(x, y).map((coord) => {
    if (coord.x < 0) {
      coord.x += board.width
    } else if (coord.x >= board.width) {
      coord.x -= board.width
    }

    if (coord.y < 0) {
      coord.y += board.height
    } else if (coord.y >= board.height) {
      coord.y -= board.height
    }

    return coord
  })
}

export const countNeighbor = (entity: IEntity) => {
  const board = entity.getParent()!.getComponent(Board)
  const cell = entity.getComponent(Cell)

  const coords = neighborMirror(board, cell.x, cell.y)
  return coords.filter(
    (coord: Coord) =>
      board.grid[coord.x][coord.y]?.getComponent(Cell).alive !== DEAD,
  ).length
}
