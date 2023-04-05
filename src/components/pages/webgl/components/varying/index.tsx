import React, { useEffect } from 'react'
import { ExtendWebGl } from '../../webgl.type'

const Varying: React.FC = () => {
  const init = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl') as ExtendWebGl

    // 顶点着色器源码
    const vertexShaderSource = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      varying vec4 v_Color;
      
      void main() {
        gl_Position = a_Position;
        v_Color = a_Color;
      }
    `

    // 片元着色器源码
    const fragShaderSource = `
      // 设置精度
      precision mediump float;
      // 声明varying变量v_Color,用来接收顶点着色器传来的片元颜色信息
      varying vec4 v_Color;
      
      void main() {
        gl_FragColor = v_Color;
      }
    `

    initShader(gl, vertexShaderSource, fragShaderSource)

    // 清空canvas的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 初始化顶点坐标和颜色
    const n = initVertexBuffers(gl)

    if (!n) return

    gl.drawArrays(gl.TRIANGLES, 0, n)
  }

  const initShader = (gl: ExtendWebGl, vertexShaderSource: string, fragShaderSource: string) => {
    // 创建顶点着色器对象
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    // 创建片元着色器对象
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    // 引入顶点，片元着色器源码

    if (!vertexShader || !fragmentShader) return

    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragShaderSource)
    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()

    if (!program) return

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)
    gl.program = program

    return program
  }

  const initVertexBuffers = (gl: ExtendWebGl) => {
    // 前两个是顶点坐标，后三个是顶点颜色
    const verticesColors = new Float32Array([
      0.0,
      0.5,
      1.0,
      0.0,
      0.0, // 顶点1
      -0.5,
      -0.5,
      1.0,
      1.0,
      0.0, // 顶点2
      0.5,
      -0.5,
      0.0,
      1.0,
      0.0 //  顶点3
    ])

    // 创建缓冲区对象
    const vertexColorBuffer = gl.createBuffer()

    if (!vertexColorBuffer) {
      console.log('创建缓冲区对象失败')
      return
    }

    // 将顶点坐标和颜色写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    // 获取类型化数组中每个元素的大小
    const FSIZE = verticesColors.BYTES_PER_ELEMENT

    // 获取着色器attribute变量a_Position的存储地址，分配缓存并开启
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0)
    gl.enableVertexAttribArray(a_Position)

    // 获取着色器attribute变量a_Color的存储地址，分配缓存并开启
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    gl.vertexAttribPointer(a_Color, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
    gl.enableVertexAttribArray(a_Color)

    return verticesColors.length / 5
  }

  useEffect(() => {
    init()
  }, [])

  return <canvas width={100} height={100} id='canvas' />
}

export default Varying
