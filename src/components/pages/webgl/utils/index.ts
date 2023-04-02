/** 制造着色器 */
export const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type) as WebGLShader 

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if (success) return shader

  console.log(gl.getShaderInfoLog(shader))

  gl.deleteShader(shader)
}

/** 创建项目 */
export const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
  const program = gl.createProgram()

  if (!program || !vertexShader || !fragmentShader) return null 

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const success = gl.getProgramParameter(program, gl.LINK_STATUS)

  if (success) return program

  console.log(gl.getProgramInfoLog(program))

  gl.deleteProgram(program)
}

/** 初始化WebGl */
export const initWebGl = (gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource) as WebGLShader
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource) as WebGLShader
  const program = createProgram(gl, vertexShader, fragmentShader)

  return program
}

export const createTexture = (gl: WebGL2RenderingContext) => {
  const texture = gl.createTexture()

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  return texture
}

/**  */
export const createProjectionMat = (l: number, r: number, t: number, b: number, n: number, f: number) => {
  return [
    2 / (r - 1), 0, 0, 0,
    0, 2 / (t - b), 0, 0,
    0, 0, 2 / (f - n), 0,
    -(r + 1) / (r - 1), -(t + b) / (t - b), -(f + n) / (f - n), 1
  ]
}

export const createTranslateMat = (tx: number, ty: number) => {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    tx, ty, 0, 1
  ]
}

export const createRotateMat = (rotate: number) => {
  rotate = rotate * Math.PI / 180

  const cos = Math.cos(rotate)
  const sin = Math.sin(rotate)

  return [
    cos, sin, 0, 0,
    -sin, cos, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
}

export const createScaleMat = (sx: number, sy: number) => {
  return [
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
}