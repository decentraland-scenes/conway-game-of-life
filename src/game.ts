import { Board } from './board'
import { Cell } from './cell'
import { gliderBoard, mwssBoard, mapHeight, mapWidth } from './constants'
import {
  countNeighbor,
  createCell,
  DEAD,
  getEntityByCellPos,
  getNextGenerationState,
  LIVE,
} from './game-of-life'

const createBoard = (
  initialBoard: Array<Array<number>>,
  width: number,
  height: number,
  position: Vector3,
  scale: Vector3
) => {
  const boardEntity = new Entity()
  const board = new Board(width, height)

  boardEntity.addComponent(board)

  const boxShape = new BoxShape()
  boxShape.withCollisions = false
  boardEntity.addComponent(boxShape)

  boardEntity.addComponent(
    new Transform({
      position,
      scale
    }),
  )

  const material = new Material()
  material.albedoColor = Color4.Blue()
  material.albedoColor.a = 0.3
  material.metallic = 0.9
  material.roughness = 0.1
  material.transparencyMode = TransparencyMode.ALPHA_BLEND
  boardEntity.addComponent(material)

  engine.addEntity(boardEntity)

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      if (initialBoard[x][y] === LIVE) createCell(boardEntity, x, y)
    }
  }
}

const updateGameOfLife = (boardEntity: IEntity) => {
  const group = engine.getComponentGroup(Cell, BoxShape, Transform)

  const entities = group.entities.filter(
    (entity) => entity.getParent() === boardEntity,
  )

  const board: Board = boardEntity.getComponent(Board)
  const entitiesToCreate = []
  const entitiesToDelete: IEntity[] = []
  for (let y = 0; y < board.width; y++) {
    for (let x = 0; x < board.height; x++) {
      const count = countNeighbor(entities, x, y)

      const entity = getEntityByCellPos(entities, x, y)
      const currentState = entity ? LIVE : DEAD
      const nextState = getNextGenerationState(count, currentState)

      if (currentState === DEAD && nextState === LIVE) {
        entitiesToCreate.push({ x, y })
      } else if (currentState === LIVE && nextState === DEAD && entity) {
        entitiesToDelete.push(entity)
      }
    }
  }

  for (let entity of entitiesToDelete) {
    engine.removeEntity(entity)
  }

  for (let coord of entitiesToCreate) {
    createCell(boardEntity, coord.x, coord.y)
  }
}

engine.addSystem({
  update: (dt: number) => {
    const group = engine.getComponentGroup(Board)
    for (const entity of group.entities) {
      updateGameOfLife(entity)

      const transform = entity.getComponent(Transform)

      // mutate the rotation
      transform.rotate(Vector3.Up(), dt * 10)
    }
  },
})

createBoard(gliderBoard, mapWidth, mapHeight, new Vector3(8.0, 4.0, 8.0), new Vector3(8.0, 8.0, 0.1))
createBoard(mwssBoard, mapWidth, mapHeight, new Vector3(8.0, 4.0, 6.0), new Vector3(8.0, 8.0, 0.1))