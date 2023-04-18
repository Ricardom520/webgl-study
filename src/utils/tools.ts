import { ExtendWebGl } from '../components/pages/webgl/webgl.type'

export const initShader = (
  gl: ExtendWebGl,
  vertexShaderSource: string,
  fragShaderSource: string
) => {
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

  gl.program = program

  return program
}
