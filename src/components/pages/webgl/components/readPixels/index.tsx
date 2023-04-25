import React, { useEffect } from 'react'
import { ExtendWebGl } from '../../webgl.type'
import { initShader } from '~/utils/tools'
import { Matrix4 } from '~/utils/cuon-matrix.js'

const ReadPixels: React.FC = () => {
  const init = () => {
    const vertexShaderSource = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      uniform mat4 u_MvpMatrix;
      uniform bool u_Clicked;
      varying vec4 v_Color;

      void main() {
        gl_Position = u_MvpMatrix * a_Position;
        if (u_Clicked) {
          v_Color = vec4(1.0, 0.0, 0.0, 1.0);
        } else {
          v_Color = a_Color;
        }
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

    setMatrixAndDraw(gl, n, canvas)
  }

  // 设置矩阵并绘图
  const setMatrixAndDraw = (gl: ExtendWebGl, n: number, canvas: HTMLCanvasElement) => {
    // 开启隐藏面
    gl.enable(gl.DEPTH_TEST)

    // 清空颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // 获取顶点着色器uniform变量u_MvpMatrix、u_Clicked的存储地址
    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    const u_Clicked = gl.getUniformLocation(gl.program, 'u_Clicked')

    if (!u_MvpMatrix || !u_Clicked) {
      console.log('获取uniform变量u_MvpMatrix或u_Clicked的存储地址失败')
      return
    }

    // 创建视图投影矩阵
    const viewProjMatrix = new Matrix4()
    viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0)
    viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)

    // 给顶点着色器uniform变量u_Clicked
    gl.uniform1i(u_Clicked, 0)

    let currentAngle = 0.0 // 当前旋转的角度
    canvas.onmousedown = function (ev: any) {
      const x = ev.clientX
      const y = ev.clientY
      const rect = ev.target.getBoundingClientRect()

      if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        //获取点击位置在canvas坐标系中的值
        const x_in_canvas = x - rect.left
        const y_in_canvas = rect.bottom - y
        checkCubeIsSelected(
          gl,
          n,
          x_in_canvas,
          y_in_canvas,
          currentAngle,
          u_Clicked,
          viewProjMatrix,
          u_MvpMatrix
        )
      }
    }

    const tick = function () {
      //动画循环
      currentAngle = getCurrentAngle(currentAngle)
      draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix)
      requestAnimationFrame(tick)
    }
    tick()
  }

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
      ...v3, // 前
      ...v0,
      ...v3,
      ...v4,
      ...v5, // 右
      ...v0,
      ...v5,
      ...v6,
      ...v1, // 上
      ...v1,
      ...v6,
      ...v7,
      ...v2, // 左
      ...v7,
      ...v4,
      ...v3,
      ...v2, // 下
      ...v4,
      ...v7,
      ...v6,
      ...v5 // 后
    ])

    const fontColor = [0.2, 0.58, 0.82]
    const backColor = [0.73, 0.82, 0.93]
    const leftColor = [0.78, 0.69, 0.84]
    const rightColor = [0.5, 0.41, 0.69]
    const topColor = [0.0, 0.32, 0.61]
    const downColor = [0.32, 0.18, 0.56]
    // 顶点的颜色
    const colors = new Float32Array([
      ...fontColor,
      ...fontColor,
      ...fontColor,
      ...fontColor, // v0-v1-v2-v3 前
      ...rightColor,
      ...rightColor,
      ...rightColor,
      ...rightColor, // v0-v3-v4-v5 右
      ...topColor,
      ...topColor,
      ...topColor,
      ...topColor, // v0-v5-v6-v1 上
      ...leftColor,
      ...leftColor,
      ...leftColor,
      ...leftColor, // v1-v6-v7-v2 左
      ...downColor,
      ...downColor,
      ...downColor,
      ...downColor, // v7-v4-v3-v2 下
      ...backColor,
      ...backColor,
      ...backColor,
      ...backColor // v4-v7-v6-v5 后
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

  const checkCubeIsSelected = (
    gl: ExtendWebGl,
    n: number,
    x: number,
    y: number,
    currentAngle: number,
    u_Clicked: WebGLUniformLocation,
    viewProjMatrix: any,
    u_MvpMatrix: any
  ) => {
    gl.uniform1i(u_Clicked, 1) //给顶点着色器uniform变量u_Clicked传值1
    //绘制图形，顶点着色器中根据u_Clicked值将方块绘制为红色，即RGBA值的R分量为255
    draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix)

    const pixels = new Uint8Array(4) //创建Uint8Array类型化数组，接收获取的像素值数据
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels) //读取鼠标点击位置像素颜色

    if (pixels[0] == 255) {
      // pixels[0]即RGBA值的R分量的值等于255说明选中方块
      alert('方块被选中! ')
    } else {
      gl.uniform1i(u_Clicked, 0) //未选中给顶点着色器uniform变量u_Clicked传值0
      draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix) // 重绘方块
    }
  }

  const g_MvpMatrix = new Matrix4() //模型视图投影矩阵
  const draw = (
    gl: ExtendWebGl,
    n: number,
    currentAngle: number,
    viewProjMatrix: any,
    u_MvpMatrix: any
  ) => {
    //计算模型视图投影矩阵
    g_MvpMatrix.set(viewProjMatrix)
    g_MvpMatrix.rotate(currentAngle, 1.0, 0.0, 0.0)
    g_MvpMatrix.rotate(currentAngle, 0.0, 1.0, 0.0)
    g_MvpMatrix.rotate(currentAngle, 0.0, 0.0, 1.0)

    //模型视图投影矩阵的计算结果传给uniform变量u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0) //绘图
  }

  let g_LastTime = Date.now() // 上次绘制的时间
  const ANGLE_SET = 30.0 // 旋转速度（度/秒）

  const getCurrentAngle = (angle: number) => {
    const now = Date.now()
    const elapsed = now - g_LastTime //上次调用与当前时间差
    g_LastTime = now
    let newAngle = angle + (ANGLE_SET * elapsed) / 1000.0
    return (newAngle %= 360)
  }

  const initArrayBuffer = (
    gl: ExtendWebGl,
    data: Float32Array,
    num: number,
    type: number,
    attribute: string
  ) => {
    //创建缓冲区对象
    const buffer = gl.createBuffer()
    //将顶点坐标和顶点颜色信息写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    //获取顶点着色器attribute变量存储地址, 分配缓存并开启
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

export default ReadPixels
