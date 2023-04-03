import React, { useEffect } from 'react'
import { ExtendWebGl } from '../../webgl.type'

const Cricle: React.FC = () => {
  const init = () => {
    // 顶点着色器
    const VERTEX_SHADER_SOURCE = `
      attribute vec4 a_Position;
      
      void main() {
        gl_Position = a_Position;
      }
    `

    // 片元着色器
    const FRAGMENT_SHADER_SOURCE = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl') as ExtendWebGl

    if (!initShaders(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)) {
      alert('Failed to init shaders')
    }

    const N = 100
    const vertexData = [0.0, 0.0]
    const r = 0.5

    for (let i = 0; i <= N; i++) {
      const theta = (i * 2 * Math.PI) / N
      const x = r * Math.sin(theta)
      const y = r * Math.cos(theta)

      vertexData.push(x, y)
    }
    console.log('vertexData:', vertexData)
    const vertices = new Float32Array(vertexData)
    initVertexBuffers(gl, vertices)

    gl?.clearColor(0.0, 0.0, 0.0, 1.0)
    gl?.clear(gl.COLOR_BUFFER_BIT)
    gl?.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2)
  }

  const initShaders = (
    gl: ExtendWebGl,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) => {
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

    if (!program) {
      console.log('Failed to create program')
      return false
    }

    gl.useProgram(program)
    gl.program = program

    return true
  }

  const initVertexBuffers = (gl: ExtendWebGl, vertices: ArrayBuffer) => {
    const vertexBuffer = gl.createBuffer()

    if (!vertexBuffer) {
      console.log('Failed to create buffer object')
      return
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    if (!gl.program) {
      return
    }

    // 获取attribu -> a_Position 变量的存储地址
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

    // 告诉显卡从当前绑定的缓冲区（bindBuffer()指定的缓冲区）中读取顶点数据。
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    // 由于除非启用，否则不能使用属性，并且默认情况下是禁用的，因此您需要调用以enableVertexAttribArray()启用各个属性，以便可以使用它们。
    // 完成后，可以使用其他方法访问该属性，包括vertexAttribPointer()、vertexAttrib*()和getVertexAttrib()。
    gl.enableVertexAttribArray(a_Position)
  }

  function loadShader(gl: ExtendWebGl, type: GLenum, source: string) {
    const shader = gl.createShader(type)

    if (!shader) {
      console.log('unable to create shader')
      return null
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const compilded = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if (!compilded) {
      const error = gl.getShaderInfoLog(shader)
      console.log('Failed to compile shader:', error)
      return null
    }

    return shader
  }

  const createProgram = (
    gl: ExtendWebGl,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) {
      return null
    }

    const program = gl.createProgram()

    if (!program) {
      console.log('gl.createProgram failed')
      return null
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)

    const linked = gl.getProgramParameter(program, gl.LINK_STATUS)

    if (!linked) {
      const error = gl.getProgramInfoLog(program)
      console.log('Failed to link program:' + error)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)

      return null
    }

    return program
  }

  useEffect(() => {
    init()
  }, [])

  return <canvas width={100} height={100} id='canvas' />
}

export default Cricle
