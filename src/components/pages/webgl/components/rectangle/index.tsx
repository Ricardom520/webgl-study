import React, { useEffect } from 'react'
import { ExtendWebGl } from '../../webgl.type'

const Rectangle: React.FC = () => {
  const init = () => {
    // 顶点着色器源码
    const vertexShaderSource = `
      // attribute声明vec4类型变量apos
      attribute vec4 apos;
      void main() {
        gl_Position = apos;
      }
    `

    // 片元着色器源码
    const fragShaderSource = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl') as ExtendWebGl

    const program = initShader(gl, vertexShaderSource, fragShaderSource)

    if (!program) return

    // 获取顶点着色器的位置变量apos
    const aposLocation = gl.getAttribLocation(program, 'apos')

    // 类型数组构造函数Float32Array创建顶点数组
    const data = new Float32Array([0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5])

    // 创建缓冲区对象
    const buffer = gl.createBuffer()
    // 绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // 顶点数组data数据传入缓冲区
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    // 缓冲区中的数据按照一定的规律传递给位置变量apos
    gl.vertexAttribPointer(aposLocation, 2, gl.FLOAT, false, 0, 0)
    // 允许数据传递
    gl.enableVertexAttribArray(aposLocation)

    // 开始绘制图形
    gl.drawArrays(gl.LINE_LOOP, 0, 4)
  }

  const initShader = (gl: ExtendWebGl, vertexShaderSource: string, fragShaderSource: string) => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

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

    return program
  }

  useEffect(() => {
    init()
  }, [])

  return <canvas width={100} height={100} id='canvas' />
}

export default Rectangle
