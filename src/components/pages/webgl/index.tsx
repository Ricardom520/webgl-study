import React from 'react'
import Cricle from './components/cricle'
import Triangle from './components/triangle'
import Coordinate from './components/coordinate'
import Rectangle from './components/triangle'
import Point from './components/point'
import Translate from './components/translate'
import Cube from './components/cube'
import Varying from './components/varying'
import styles from './index.module.less'

const WebGl: React.FC = () => {
  return (
    <div className={styles['webgl-container']}>
      <h1>Webgl Demo</h1>
      <div className={styles['webgl-box']}>
        {/** 点 */}
        {/* <Point /> */}
        {/** 圆形 */}
        {/* <Cricle /> */}
        {/** 三角形 */}
        {/* <Triangle /> */}
        {/** 坐标系 */}
        {/* <Coordinate/> */}
        {/** 矩形 */}
        {/* <Rectangle /> */}
        {/** 平移 */}
        {/* <Translate /> */}
        {/** 立方体 */}
        {/* <Cube /> */}
        {/** 光栅化 */}
        <Varying />
      </div>
    </div>
  )
}

export default WebGl
