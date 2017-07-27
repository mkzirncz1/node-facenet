// import { promisify } from 'util'

// import * as ndarray from 'ndarray'

// const distance  = require('ndarray-distance')
// const getPixels = require('get-pixels')
import * as nj    from 'numjs'

import { Face }   from './face'
import { Image }  from './image'
import {
  PythonFacenet,
}                 from './python-facenet'

export type FeatureVector = nj.NdArray<number>  // 128 dim

export class Facenet {
  private pythonFacenet: PythonFacenet

  constructor() {
    //
  }

  public async init(): Promise<void> {
    this.pythonFacenet = new PythonFacenet()
    await this.pythonFacenet.init()
  }

  /**
   * Alignment the image, get faces list, ordered with biggest first
   * @param image
   */
  public async align(image: Image): Promise<Face[]> {
    const data = image.data().tolist()
    const faceList = await this.pythonFacenet.align(data)
    return faceList
  }

  /**
   * Get the 128 dims embeding from image(s)
   */
  public async embedding(face: Face): Promise<FeatureVector> {
    const data = face.image()
                    .resize(160, 160)
                    .data()
                    .tolist()
    const embedding = await this.pythonFacenet.embedding(data)
    return embedding
  }

  public distance(v1: FeatureVector, v2: FeatureVector): number {
    const l2 = v1.subtract(v2)
                  .pow(2)
                  .sum()
    return nj.sqrt(l2)
            .get(0)
  }
}
