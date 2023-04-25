import React from 'react'
import Cricle from './components/cricle'
import Triangle from './components/triangle'
import Coordinate from './components/coordinate'
import Rectangle from './components/triangle'
import Point from './components/point'
import Translate from './components/translate'
import Cube from './components/cube'
import Varying from './components/varying'
import Texture from './components/texture'
import Matrix from './components/matrix'
import ThreeMotion from './components/3dmotion'
import ColorCude from './components/colorCude'
import TransitionCude from './components/transitionCude'
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
        {/* <Varying /> */}
        {/** 纹理 */}
        {/* <Texture /> */}
        {/** 三维视图 */}
        {/* <Matrix /> */}
        {/** 键盘控制三维视图 */}
        {/* <ThreeMotion /> */}
        {/** 颜色立方体 */}
        {/* <ColorCude /> */}
        {/** 过渡色立方体 */}
        <TransitionCude />
      </div>
    </div>
  )
}

export default WebGl
