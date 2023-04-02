import React, { useEffect } from "react"
import { initWebGl } from '../../utils'

const Triangle: React.FC = () => {
  const init = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl') as WebGL2RenderingContext

    const vertexShader = `
      attribute vec4 a_Position;
      void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.;
      }
    `

    const fragmentShader = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
      }
    `

    const pointPos = [-0.5, 0.0, 0.5, 0.0, 0.0, 0.5]

    const program = initWebGl(gl, vertexShader, fragmentShader) as WebGLProgram

    if (!program) return
  
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointPos), gl.STATIC_DRAW)

    const a_Position = gl.getAttribLocation(program, 'a_Position')
    gl.vertexAttribPointer(
      a_Position,
      2,
      gl.FLOAT,
      false,
      Float32Array.BYTES_PER_ELEMENT * 2,
      0
    )

    gl.enableVertexAttribArray(a_Position)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <canvas id="canvas" />
  )
}

export default Triangle