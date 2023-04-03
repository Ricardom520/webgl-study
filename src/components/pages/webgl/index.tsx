import React from 'react'
import Cricle from './components/cricle'
import Triangle from './components/triangle'
import Coordinate from './components/coordinate'
import Rectangle from './components/triangle'
import Point from './components/point'
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
        <Coordinate/>
        {/** 矩形 */}
        {/* <Rectangle /> */}
      </div>
    </div>
  )
}

export default WebGl
