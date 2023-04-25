import React, { useEffect } from 'react'
import { ExtendWebGl } from '../../webgl.type'
import { initShader } from '~/utils/tools'
import { Matrix4 } from '~/utils/cuon-matrix.js'

const TransitionCude: React.FC = () => {
  const init = () => {
    const vertexShaderSource = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      uniform mat4 u_MvpMatrix;
      varying vec4 v_Color;

      void main() {
        gl_Position = u_MvpMatrix * a_Position;
        v_Color = a_Color;
      }
    `

    const fragShaderSource = `
      #ifdef GL_ES
        precision mediump float;
      #endif
      varying vec4 v_Color;

      void main() {
        gl_FragColor = v_Color;
      }
    `

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl') as ExtendWebGl

    if (!initShader(gl, vertexShaderSource, fragShaderSource)) {
      console.log('初始化着色器失败')
      return
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    const n = initVertexBuffers(gl)

    setMatrixAndDraw(gl, n)
  }

  const setMatrixAndDraw = (gl: ExtendWebGl, n: number) => {
    gl.enable(gl.DEPTH_TEST)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')

    const mvpMatrix = new Matrix4()

    // 设置可视空间/透视投影矩阵
    mvpMatrix.setPerspective(30, 1, 1, 100)

    // 设置视点、视线和上方向
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)

    // 将模型视图投影组合矩阵传给顶点着色器uniform变量u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    // 绘制立方体
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
  }

  const initVertexBuffers = (gl: ExtendWebGl) => {
    const verticesColors = new Float32Array([
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0, // v0 白色
      -1.0,
      1.0,
      1.0,
      1.0,
      0.0,
      1.0, // v1 品红
      -1.0,
      -1.0,
      1.0,
      1.0,
      0.0,
      0.0, // v2 红色
      1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      0.0, // v3 黄色
      1.0,
      -1.0,
      -1.0,
      0.0,
      1.0,
      0.0, // v4 绿色
      1.0,
      1.0,
      -1.0,
      0.0,
      1.0,
      1.0, // v5 青色
      -1.0,
      1.0,
      -1.0,
      0.0,
      0.0,
      1.0, // v6 蓝色
      -1.0,
      -1.0,
      -1.0,
      0.0,
      0.0,
      0.0 // v7 黑色
    ])

    //顶点索引
    const indices = new Uint8Array([
      0,
      1,
      2,
      0,
      2,
      3, // 前
      0,
      3,
      4,
      0,
      4,
      5, // 右
      0,
      5,
      6,
      0,
      6,
      1, // 上
      1,
      6,
      7,
      1,
      7,
      2, // 左
      7,
      4,
      3,
      7,
      3,
      2, // 下
      4,
      7,
      6,
      4,
      6,
      5 // 后
    ])

    //创建缓冲区对象
    const vertexColorBuffer = gl.createBuffer()
    const indexBuffer = gl.createBuffer()

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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
    // 解绑缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return indices.length
  }

  useEffect(() => {
    init()
  }, [])

  return <canvas width={300} height={300} id='canvas' />
}

export default TransitionCude
