import { Board } from './board'
import { gliderBoard, mwssBoard, mapHeight, mapWidth } from './constants'
import {
  createCell,
  LIVE,
  setCellAlive,
} from './game-of-life'
import { gameOfLifeSystem } from './game-of-life-system'

const createBoard = (
  initialBoard: Array<Array<0 | 1>>,
  width: number,
  height: number,
  position: Vector3,
  scale: Vector3,
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
      scale,
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
      const entity = createCell(boardEntity, x, y)
      if (initialBoard[x][y] === LIVE) {
        setCellAlive(entity)
      }
    }
  }
}

engine.addSystem(gameOfLifeSystem)

createBoard(
  gliderBoard,
  mapWidth,
  mapHeight,
  new Vector3(8.0, 4.0, 8.0),
  new Vector3(8.0, 8.0, 0.1),
)

createBoard(
  mwssBoard,
  mapWidth,
  mapHeight,
  new Vector3(8.0, 4.0, 6.0),
  new Vector3(8.0, 8.0, 0.1),
)