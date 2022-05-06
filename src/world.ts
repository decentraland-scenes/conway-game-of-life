import { mapHeight, mapWidth } from "./constants"
import { create2DArray } from "./game-of-life"

const world = create2DArray<Entity | null>(mapWidth, mapHeight, null)

export const cellBorn = (x: number, y: number) => {
  // create the entity
  const cube = new Entity()

  // set a transform to the entity
  cube.addComponent(
    new Transform({
      position: new Vector3(x / 2.0 + 4, y / 2.0, 0.5),
      scale: new Vector3(0.5, 0.5, 0.5),
    }),
  )

  // set a shape to the entity
  cube.addComponent(new BoxShape())

  // add the entity to the engine
  engine.addEntity(cube)

  world[x][y] = cube

  return cube
}

export const cellDie = (x: number, y: number) => {
    const entity = world[x][y]
    if (entity) {
        engine.removeEntity(entity)
    }
}

export const cellLive = (x: number, y: number) => {
    const entity = world[x][y]
    if (entity) {
      //Create material and configure its fields
      const myMaterial = new Material()
      myMaterial.albedoColor = Color3.Random()
      myMaterial.metallic = 0.9
      myMaterial.roughness = 0.1

      //Assign the material to the entity
      entity.addComponentOrReplace(myMaterial)
    }
}