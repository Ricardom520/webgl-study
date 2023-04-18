import React, { useEffect } from 'react'
import { ExtendWebGl } from '../../webgl.type'
import { initShader } from '~/utils/tools'
import { Matrix4 } from '~/utils/cuon-matrix.js'

const ThreeMotion: React.FC = () => {
  // 视点
  let g_eyeX = 0.2
  let g_eyeY = 0.25
  const g_eyeZ = 0.25

  const init = () => {
    const vertexShaderSource = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      uniform mat4 u_ViewMatrix;
      varying vec4 v_Color;
      
      void main() {
        gl_Position = u_ViewMatrix * a_Position;
        v_Color = a_Color;
      }
    `

    const fragShaderSource = `
      #ifdef GL_ES
        // 设置精度
        precision mediump float;
      #endif
      varying vec4 v_Color;

      void main() {
        // 将varying变量v_Color接收的颜色信息赋值给内置变量gl_FragColor
        gl_FragColor = v_Color;
      }
    `

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl') as ExtendWebGl

    if (!initShader(gl, vertexShaderSource, fragShaderSource)) {
      alert('Failed to init shaders')

      return
    }

    // 设置canvas的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 初始化顶点坐标和顶点颜色
    const n = initVertexBuffers(gl)

    // 获取顶点着色器uniform变量u_ViewMatrix的存储地址
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')

    if (!u_ViewMatrix) {
      console.log('获取u_ViewMatrix的存储地址失败！')
      return
    }

    // 创建视图矩阵
    const viewMatrix = new Matrix4()

    // 设置视点，视线和上方向
    viewMatrix.setLookAt(0.2, 0.25, 0.25, 0, 0, 0, 0, 1, 0)

    // 将视图矩阵传给顶点着色器uniform变量u_ViewMatrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elments)

    // 绘制三角形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)

    document.onkeydown = function (e) {
      keydown(e, gl, n, u_ViewMatrix, viewMatrix)
    }
  }

  const keydown = (
    e: any,
    gl: ExtendWebGl,
    n: number,
    u_ViewMatrix: WebGLUniformLocation,
    viewMatrix: any
  ) => {
    if (e.keyCode === 38) {
      // 上键
      g_eyeY -= 0.01
    } else if (e.keyCode === 40) {
      // 下键
      g_eyeY += 0.01
    } else if (e.keyCode === 37) {
      // 左键
      g_eyeX -= 0.01
    } else if (e.keyCode === 39) {
      // 右键3
      g_eyeX += 0.01
    } else {
      return
    }

    draw(gl, n, u_ViewMatrix, viewMatrix)
  }

  const draw = (
    gl: ExtendWebGl,
    n: number,
    u_ViewMatrix: WebGLUniformLocation,
    viewMatrix: any
  ) => {
    // 设置视图矩阵
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0)

    // 将视图矩阵传给顶点着色器uniform变量u_ViewMatrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elments)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, n)
  }

  const initVertexBuffers = (gl: ExtendWebGl) => {
    const verticesColors = new Float32Array([
      //最后面的三角形
      0.0, 0.5, -0.4, 0.4, 1.0, 0.4, -0.5, -0.5, -0.4, 0.4, 1.0, 0.4, 0.5, -0.5, -0.4, 1.0, 0.4,
      0.4,

      //中间的三角形
      0.5, 0.4, -0.2, 1.0, 0.4, 0.4, -0.5, 0.4, -0.2, 1.0, 1.0, 0.4, 0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

      //最前面的三角形
      0.0, 0.5, 0.0, 0.4, 0.4, 1.0, -0.5, -0.5, 0.0, 0.4, 0.4, 1.0, 0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    ])

    //创建缓冲区对象
    const vertexColorBuffer = gl.createBuffer()
    if (!vertexColorBuffer) {
      console.log('创建缓冲区对象失败！')
      return -1
    }

    //将顶点坐标和顶点颜色信息写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    //获取类型化数组中每个元素的大小
    const FSIZE = verticesColors.BYTES_PER_ELEMENT

    //获取顶点着色器attribute变量a_Position的存储地址, 分配缓存并开启
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
    gl.enableVertexAttribArray(a_Position)

    //获取顶点着色器attribute变量a_Color(顶点颜色信息)的存储地址, 分配缓存并开启
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
    gl.enableVertexAttribArray(a_Color)

    // 解绑缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    return verticesColors.length / 6
  }

  useEffect(() => {
    init()
  }, [])

  return <canvas width={100} height={100} id='canvas' />
}

export default ThreeMotion
