import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

export const dracoLoader = new DRACOLoader()
  .setDecoderPath('/media/draco/')
  .setWorkerLimit(1)
