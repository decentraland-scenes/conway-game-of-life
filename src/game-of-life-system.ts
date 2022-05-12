import { Board } from './board'
import { Cell } from './cell'
import {
  countNeighbor,
  DEAD,
  getNextGenerationState,
  LIVE,
  setCellAlive,
  setCellDead,
} from './game-of-life'

const updateGameOfLife = (boardEntity: IEntity) => {
  const group = engine.getComponentGroup(Cell, Transform)

  const entities = group.entities.filter(
    (entity) => entity.getParent() === boardEntity,
  )

  const board: Board = boardEntity.getComponent(Board)

  // Count neighbors
  for (let entity of entities) {
    const cell = entity.getComponent(Cell)
    cell.neighbors = countNeighbor(entity)
  }

  // Calculate next generation
  const entitiesToBeAlive: IEntity[] = []
  const entitiesToBeDead: IEntity[] = []

  for (let y = 0; y < board.width; y++) {
    for (let x = 0; x < board.height; x++) {
      const entity = board.grid[x][y]!
      const cell = entity.getComponent(Cell)
      const currentState = cell.alive
      const nextState = getNextGenerationState(cell.neighbors, currentState)

      if (currentState === DEAD && nextState === LIVE) {
        entitiesToBeAlive.push(entity)
      } else if (currentState === LIVE && nextState === DEAD) {
        entitiesToBeDead.push(entity)
      }
    }
  }

  // Update board
  for (let entity of entitiesToBeDead) {
    setCellDead(entity)
  }

  for (let entity of entitiesToBeAlive) {
    setCellAlive(entity)
  }
}

export const gameOfLifeSystem = {
  update: (dt: number) => {
    const group = engine.getComponentGroup(Board)
    for (const entity of group.entities) {
      updateGameOfLife(entity)

      const transform = entity.getComponent(Transform)

      // mutate the rotation
      transform.rotate(Vector3.Up(), dt * 10)
    }
  },
}
