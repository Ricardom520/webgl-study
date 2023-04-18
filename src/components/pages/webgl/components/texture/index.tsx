import React, { useEffect } from 'react'
import { ExtendWebGl } from '../../webgl.type'
import demoImg from '~/images/demo01.png'

const Texture: React.FC = () => {
  const init = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl') as ExtendWebGl

    // 顶点着色器
    const vertexShaderSource = `
      // 声明attribute变量a_Position,用来存放顶点位置信息
      attribute vec4 a_Position;
      // 声明attribute变量a_TexCoord,用来存放纹理坐标
      attribute vec2 a_TexCoord;
      // 声明varying变量v_TextCoord,用来向片元着色器船只纹理坐标
      varying vec2 v_TexCoord;

      void main() {
        // 变量a_Position赋值给顶点着色器内置变量gl_Position;
        gl_Position = a_Position;
        // 将纹理坐标传给片元着色器
        v_TexCoord = a_TexCoord;
      }
    `

    // 片元着色器
    const fragShaderSource = `
      // 设置精度
      precision mediump float;
      // 声明uniform变量u_Sampler,用来存放纹理单元编号
      uniform sampler2D u_Sampler;
      // 声明varying变量v_TextCoord,用来接收顶点着色器传送的纹理坐标
      varying vec2 v_TexCoord;

      // 使用texture2D函数抽取纹素，并赋值给内置变量gl_FragColor
      void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord);
      }
    `

    initShader(gl, vertexShaderSource, fragShaderSource)

    // 设置cavans的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 初始化顶点坐标和颜色
    const n = initVertexBuffers(gl)

    // 初始化纹理
    initTextures(gl, n)
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

    gl.program = program

    return program
  }

  const initVertexBuffers = (gl: ExtendWebGl) => {
    const verticesTexCoords = new Float32Array([
      //顶点坐标前两个   纹理坐标后两个
      //------\\ //----\\
      -0.5,
      0.5,
      0.3,
      1.7, //顶点1
      -0.5,
      -0.5,
      -0.3,
      -0.2, //顶点2
      0.5,
      0.5,
      1.7,
      1.7, //顶点3
      0.5,
      -0.5,
      1.7,
      -0.2 //顶点4
    ])

    // 创建缓冲区对象
    const vertexTexCoordBuffer = gl.createBuffer()

    if (!vertexTexCoordBuffer) {
      console.log('创建缓冲区对象失败!')
      return -1
    }

    // 将顶点坐标和纹理坐标写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW)

    // 获取类型化数组中每个元素的大小
    const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT

    // 获取类型化数组中每个元素的大小
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
    gl.enableVertexAttribArray(a_Position)

    // 获取顶点着色器attribute变量a_TexCoord（纹理坐标）的存储地址，分配缓存并开启
    const a_TextCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')
    gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 0)
    gl.enableVertexAttribArray(a_TextCoord)

    return verticesTexCoords.length / 4
  }

  const initTextures = (gl: ExtendWebGl, n: number) => {
    // 创建纹理对象
    const texture = gl.createTexture()
    // 获取片元着色器uniform变量u_Sampler（纹理单元编号）的存储地址
    const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')

    const image = new Image()
    image.src = '/src/images/demo01.png'

    if (!texture || !u_Sampler) return

    image.onload = function () {
      // 调用加载纹理函数
      loadTexture(gl, n, texture, u_Sampler, image)
    }

    return true
  }

  const loadTexture = (
    gl: ExtendWebGl,
    n: number,
    texture: WebGLTexture,
    u_Sampler: WebGLUniformLocation,
    image: HTMLImageElement
  ) => {
    // 对纹理图像镜像y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    // 激活纹理单元
    gl.activeTexture(gl.TEXTURE0)
    // 绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture)
    // 配置纹理对象参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    // 纹理图像分配给纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
    // 纹理单元编号传给片元着色器中uniform变量u_Sampiler
    gl.uniform1i(u_Sampler, 0)

    // 情况canvas
    gl.clear(gl.COLOR_BUFFER_BIT)
    console.log(image)
    console.log(n)
    // 绘制纹理图像
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
  }

  useEffect(() => {
    init()
  }, [])
  return (
    <div>
      <canvas width={200} height={200} id='canvas' />
      <p>原图</p>
      <img src={demoImg} />
    </div>
  )
}

export default Texture
