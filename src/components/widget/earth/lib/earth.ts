import { getWebGLContext } from '~/utils/cuon-utils.js'
import { Matrix4 } from '~/utils/cuon-matrix.js'

interface CustomGL extends WebGLRenderingContext {
  program: WebGLProgram
}

export const initEarth = () => {
  // 顶点着色器
  const VSHADER_SOURCE = `
    attribute vec_4 a_Position;
    uniform mat4 u_ModelViewMatrix;
    varying vec4 v_Color;
    void main(){
      gl_Position = u_ModelViewMatrix * a_Position;
      v_Color = vec4(0.2, 0.2, 0.2, 0.1);  
    }
  `

  // 片元着色器
  const FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    void main() {
      gl_FragColor = vec4(0, 0, 0, 0.1);
    }
  `

  // 声明js需要的相关变量
  const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
  const gl = getWebGLContext(canvas) as CustomGL
  const r = 8
  const latitudeBands = 50 // 纬度带
  const longitudeBands = 80 // 经度带
  const positions_ = [] // 存储x, y, z坐标
  const indices_ = [] // 三角形列表(索引值)
  const textureCoorData = [] // 存储纹理坐标u,v，纹理坐标与顶点坐标一一对应

  for (let latNum = 0; latNum <= latitudeBands; latNum++) {
    const lat = latNum * Math.PI / latitudeBands - Math.PI / 2; // 纬度范围从-π/2到π/2
    const sinLat = Math.sin(lat)
    const cosLat = Math.cos(lat)

    for (let longNum = 0; longNum <= longitudeBands; longNum++) {
      const lon = longNum * 2 * Math.PI / longitudeBands - Math.PI // 经度范围从-π到π
      const sinLon = Math.sin(lon)
      const cosLon = Math.cos(lon)

      const x = cosLat * cosLon
      const y = cosLat * sinLat
      const z = sinLat
      const u = (longNum / longitudeBands)
      const v =(latNum / latitudeBands)

      positions_.push(x)
      positions_.push(z)
      positions_.push(y)
      textureCoorData.push(u)
      textureCoorData.push(v)
    }
  }

  for (let latNum = 0; latNum < latitudeBands; latNum++) {
    for (let longNum = 0; latNum < longitudeBands; longNum++) {
      const first = latNum * (longitudeBands + 1) + longNum
      const second = first + longitudeBands + 1
      
      indices_.push(first)
      indices_.push(second)
      indices_.push(first + 1)
      indices_.push(second)
      indices_.push(second + 1)
      indices_.push(first + 1)
    }
  }

  const position = new Float32Array(positions_)
  const indices = new Float32Array(indices_)

  // 创建缓冲区对象
  const vertexBuffer = gl.createBuffer()
  const indexBuffer = gl.createBuffer()

  if (!vertexBuffer || !indexBuffer) {
    console.log('无法创建缓冲区对象')
    return
  }  

  // 绑定缓冲区对象并写入数据
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)

  // 获取数组中一个元素所占的字节数
  const fsize = position.BYTES_PER_ELEMENT

  // 获取attribu -> a_Position 变量的存储地址
  const a_Position = gl.getAttribLocation(gl.program, "a_Position")

  if (a_Position < 0) {
    console.log("无法获取顶点位置的存储变量")
    return
  }

  // 对位置的顶点数据进行分配，并开启
  const numComponents = 3
  const strideToNextPieceOfData = fsize * 3
  const offsetIntoBuffer = 0

  // 告诉显卡从当前绑定的缓冲区（bindBuffer()指定的缓冲区）中读取顶点数据。
  gl.vertexAttribPointer(a_Position, numComponents, gl.FLOAT, false, strideToNextPieceOfData, offsetIntoBuffer)
  // 由于除非启用，否则不能使用属性，并且默认情况下是禁用的，因此您需要调用以enableVertexAttribArray()启用各个属性，以便可以使用它们。
  // 完成后，可以使用其他方法访问该属性，包括vertexAttribPointer()、vertexAttrib*()和getVertexAttrib()。
  gl.enableVertexAttribArray(a_Position)

  // 将顶底索引数据写入缓存区对象
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  // 设置视角矩阵得到相关信息
  const u_ModelViewMatrix = gl.getUniformLocation(gl.program, "u_ModelViewMatrix") as WebGLUniformLocation 
  if (u_ModelViewMatrix < 0) {
    console.log("无法获取矩阵变量的存储位置")
    return
  }

  // 进入场景初始化
  draw(gl, indices.length, u_ModelViewMatrix, positions_.length)

  function draw(gl: WebGLRenderingContext, indices_length: number, u_ModelViewMatrix: WebGLUniformLocation, positions_length: number) {
    // 设置视角矩阵的相关信息（视点、视线、上方向）
    const viewMatrix = new Matrix4()
    viewMatrix.setLookAt(12,3,7,-0.5,0,0,0,1,0)
  
    // 设置模型矩阵的相关信息
    const modelMatrix = new Matrix4()
    
    // 设置透视投影矩阵
    const projMatrix = new Matrix4()
    projMatrix.setPerspective(20, canvas.width / canvas.height, 1, 3000)

    // 计算出模型视图矩阵viewMatrix.multiply(modelMatrix)相当于在着色器里面u_ViewMatrix * u_ModelMatrix
    const modeViewMatrix = projMatrix.multiply(viewMatrix.multiply(modelMatrix))

    // 将视频矩阵传给u_ViewMatrix变量
    gl.uniformMatrix4fv(u_ModelViewMatrix, false, modeViewMatrix.elements)
    console.log('u_ModelViewMatrix', u_ModelViewMatrix)

    // 开启隐藏面清除
    gl.enable(gl.DEPTH_TEST)

    // 清空颜色和深度缓冲区
    // 指定清空cavans的颜色
    gl.clearColor(0, 0, 0, 1.0)

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.viewport(0, 0, canvas.width, canvas.height)

    gl.drawElements(gl.TRIANGLES, indices_length, gl.UNSIGNED_SHORT, 0)
  }
}