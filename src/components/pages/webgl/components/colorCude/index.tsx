import React, { useEffect } from 'react'
import { ExtendWebGl } from '../../webgl.type'
import { initShader } from '~/utils/tools'
import { Matrix4 } from '~/utils/cuon-matrix.js'

const ColorCude: React.FC = () => {
  const init = () => {
    // 顶点着色器
    const vertexShaderSource = `
      // 声明attribute变量a_Position，用来存放顶点位置信息
      attribute vec4 a_Position;
      // 声明attribute变量a_Color,用来存放顶点信息
      attribute vec4 a_Color;
      // 声明uniform变量u_MvpMatrix,用来存放模型视图投影组合矩阵
      uniform mat4 u_MvpMatrix;
      // 声明varying变量v_Color,用来向片着色器传值顶点颜色信息
      varying vec4 v_Color;

      void main() {
        // 将模型视图投影组合矩阵与顶点坐标相乘赋值给顶点着色器内置变量gl_Position
        gl_Position = u_MvpMatrix * a_Position;
        v_Color = a_Color;
      }
    `

    // 片元着色器
    const fragShaderSource = `
      #ifdef GL_SE
        precision mediump float;
      #endif
      // 声明varying变量v_Color,用来接收顶点着色器传送的片元颜色信息
      varying vec4 v_Color;

      void main() {
        // 将varying变量v_Color接收的颜色信息赋值给内置变量gl_FragColor
        gl_FragColor = v_Color;
      }
    `

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl') as ExtendWebGl

    if (!initShader(gl, vertexShaderSource, fragShaderSource)) {
      console.log('初始化着色器失败')
      return
    }

    // 设置canvas的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 初始化顶点坐标和顶点颜色
    const n = initVertexBuffers(gl)

    setMatrixAndDraw(gl, n)
  }

  // 设置矩阵并绘图
  const setMatrixAndDraw = (gl: ExtendWebGl, n: number) => {
    // 开启隐藏面消除
    gl.enable(gl.DEPTH_TEST)

    // 清空颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT)

    // 获取顶点着色器uniform变量u_MvpMartix的存储地址
    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')

    // 创建模型视图投影矩阵
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

  // 初始化顶点坐标和顶点颜色
  const initVertexBuffers = (gl: ExtendWebGl) => {
    const v0 = [1.0, 1.0, 1.0]
    const v1 = [-1.0, 1.0, 1.0]
    const v2 = [-1.0, -1.0, 1.0]
    const v3 = [1.0, -1.0, 1.0]
    const v4 = [1.0, -1.0, -1.0]
    const v5 = [1.0, 1.0, -1.0]
    const v6 = [-1.0, 1.0, -1.0]
    const v7 = [-1.0, -1.0, -1.0]

    //顶点
    const vertices = new Float32Array([
      ...v0,
      ...v1,
      ...v2,
      ...v3, // 前 index 0-3
      ...v0,
      ...v3,
      ...v4,
      ...v5, // 右 index 4-7
      ...v0,
      ...v5,
      ...v6,
      ...v1, // 上 index 8-11
      ...v1,
      ...v6,
      ...v7,
      ...v2, // 左 index 12-15
      ...v7,
      ...v4,
      ...v3,
      ...v2, // 下 index 16-19
      ...v4,
      ...v7,
      ...v6,
      ...v5 // 后 index 20-23
    ])

    const fontColor = [1.0, 0.0, 0.0]
    const backColor = [1.0, 0.0, 0.0]
    const leftColor = [0.0, 1.0, 0.0]
    const rightColor = [0.0, 1.0, 0.0]
    const topColor = [0.0, 0.0, 1.0]
    const downColor = [0.0, 0.0, 1.0]
    // 顶点的颜色
    const colors = new Float32Array([
      ...fontColor,
      ...fontColor,
      ...fontColor,
      ...fontColor, // 前 index 0-3
      ...rightColor,
      ...rightColor,
      ...rightColor,
      ...rightColor, // 右 index 4-7
      ...topColor,
      ...topColor,
      ...topColor,
      ...topColor, // 上 index 8-11
      ...leftColor,
      ...leftColor,
      ...leftColor,
      ...leftColor, // 左 index 12-15
      ...downColor,
      ...downColor,
      ...downColor,
      ...downColor, // 下 index 16-19
      ...backColor,
      ...backColor,
      ...backColor,
      ...backColor // 后 index 20-23
    ])

    // 绘制的索引
    const indices = new Uint8Array([
      0,
      1,
      2,
      0,
      2,
      3, // 前
      4,
      5,
      6,
      4,
      6,
      7, // 右
      8,
      9,
      10,
      8,
      10,
      11, // 上
      12,
      13,
      14,
      12,
      14,
      15, // 左
      16,
      17,
      18,
      16,
      18,
      19, // 下
      20,
      21,
      22,
      20,
      22,
      23 // 后
    ])

    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) {
      return -1
    }

    if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) {
      return -1
    }

    //创建缓冲区对象
    const indexBuffer = gl.createBuffer()

    //将顶点索引写入缓冲区对象
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length
  }

  const initArrayBuffer = (
    gl: ExtendWebGl,
    data: Float32Array,
    num: number,
    type: number,
    attribute: string
  ) => {
    // 创建缓冲区对象
    const buffer = gl.createBuffer()
    // 将顶点坐标和顶点颜色信息写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    // 获取顶点着色器attribute变量存储地址，分配缓存并开启
    const a_Attribute = gl.getAttribLocation(gl.program, attribute)
    gl.vertexAttribPointer(a_Attribute, num, type, false, 0, 0)
    gl.enableVertexAttribArray(a_Attribute)

    return true
  }

  useEffect(() => {
    init()
  }, [])

  return <canvas width={300} height={300} id='canvas' />
}

export default ColorCude
