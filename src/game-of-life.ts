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

  const parentTransform = parent.getComponent(Transform)
  const parentBoard = parent.getComponent(Board)

  const position = new Vector3(
    (x / parentBoard.width) - 0.5,
    (y / parentBoard.height) - 0.5,
    0.0,
  )

  const transform = new Transform({
    position,
    scale: new Vector3(1.0 / parentBoard.width, 1.0 / parentBoard.height, 0.9),
  })
  entity.addComponent(transform)

  const boxShape = new BoxShape()
  boxShape.withCollisions = false
  entity.addComponent(boxShape)

  entity.addComponent(new Cell(x, y))

  entity.setParent(parent)
  engine.addEntity(entity)
}

export const countNeighbor = (entities: IEntity[], x: number, y: number) => {
  let count = 0

  for (const entity of entities) {
    const cell = entity.getComponent(Cell)

    let diffX = Math.abs(x - cell.x)
    let diffY = Math.abs(y - cell.y)

    // Mirror
    const board = entity.getParent()?.getComponent(Board)
    if (board) {
      diffX = diffX === board.width - 1 ? 1 : diffX
      diffY = diffY === board.height - 1 ? 1 : diffY
    }

    if (
      (diffX === 1 && diffY === 1) ||
      (diffX === 0 && diffY === 1) ||
      (diffX === 1 && diffY === 0)
    ) {
      ++count
    }
  }

  return count
}

export const getEntityByCellPos = (
  entities: IEntity[],
  x: number,
  y: number,
) => {
  for (const entity of entities) {
    const cell = entity.getComponent(Cell)

    if (cell.x == x && cell.y == y) {
      return entity
    }
  }

  return null
}
