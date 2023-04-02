import React, { useEffect } from 'react'
import { ExtendWebGl } from '../../webgl.type'

const Point: React.FC = () => {
  const init = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl') as ExtendWebGl

    // 顶点着色器源码
    const vertexShaderSource = `
      void main() {
        gl_PointSize=20.0;
        gl_Position =vec4(0.0,0.0,0.0,1.0);
      }
    `

    // 片元着色器源码
    const fragShaderSource = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `

    // 初始化着色器
    initShader(gl, vertexShaderSource, fragShaderSource)
    gl.drawArrays(gl.POINTS, 0, 1)
  }

  const initShader = (gl: ExtendWebGl, vertexShaderSource: string, fragShaderSource: string) => {
    // 创建顶点着色器对象
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    // 创建片元着色器对象
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    if (!vertexShader || !fragmentShader) return
  
    // 引入顶点，片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragShaderSource)
    // 编译顶点，片元着色器
    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    // 创建程序对象program
    const program = gl.createProgram()

    if (!program) {
      console.log('gl.createProgram failed')
      return null
    }
    console.log('vertexShader:', vertexShader)
    console.log('fragmentShader:', fragmentShader)
    // 附着顶点着色器和片元着色器到program
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    console.log('program ：', program)
    // 链接program
    gl.linkProgram(program)

    // 使用program
    gl.useProgram(program)
    
    return true
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <canvas width={100} height={100} id='canvas'/>
  )
}

export default Point