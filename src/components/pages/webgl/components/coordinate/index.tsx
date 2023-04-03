import React, { useEffect } from "react"
import { ExtendWebGl } from '../../webgl.type'

const Coordinate: React.FC = () => {
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

    // 初始化着色器
    const program = initShader(gl, vertexShaderSource, fragShaderSource)

    if (!program) return
  
    // 获取顶点着色器的位置变量apos
    const apolocation = gl.getAttribLocation(program, 'apos')
    
    // 9个元素构建三个顶点的xyz坐标值
    const data = new Float32Array([
      0, 0, 1,
      0, 1, 0,
      1, 0, 0
    ])

    // 创建缓冲区对象
    const buffer = gl.createBuffer()
    // 绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // 顶点数据data传入缓冲区
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.vertexAttribPointer(apolocation, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(apolocation)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  const initShader = (gl: ExtendWebGl, vertexShaderSource: string, fragmentShaderSource: string) => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    if (!vertexShader || !fragmentShader) return

    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)

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

  return (
    <canvas width={100} height={100} id='canvas'/>
  )
}

export default Coordinate