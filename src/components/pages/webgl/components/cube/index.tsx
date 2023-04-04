import React, { useEffect } from 'react'
import { ExtendWebGl } from '../../webgl.type'

const Cube: React.FC = () => {
  const init = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl') as ExtendWebGl

    // 顶点着色器源码
    const vertexShaderSource = `
      // attribute声明vec4类型变量apos
      attribute vec4 apos;
      void main() {
        // 设置几何体轴旋转角度为30度，并把角度转化为浮点值
        float radian = radians(30.0);
        // 求解旋转角度余弦值
        float cos = cos(radian);
        // 求解旋转角度正弦值
        float sin = sin(radian);
        // 引用上面的计算数据，创建绕x轴旋转矩阵
        // 1      0       0    0
        // 0   cosα     sinα   0
        // 0  -sinα     cosα   0
        // 0      0        0   1
        mat4 mx = mat4(1, 0, 0, 0, 0, cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1);
        // 引用上面的计算数据，创建绕y轴旋转矩阵
        //  cosβ   0   sinβ     0
        //     0   1   0        0
        // -sinβ   0   cosβ     0
        //     0   0   0        1
        mat4 my = mat4(cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, 0, 0, 0, 1);
        // 连续两个旋转矩阵，顶点齐次坐标连乘
        gl_Position = mx * my * apos;
      }
    `

    // 片元着色器源码
    const fragShaderSource = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `

    // 初始化着色器
    const program = initShader(gl, vertexShaderSource, fragShaderSource)

    if (!program) return

    // 获取顶点着色器的位置变量apos
    const aposLocation = gl.getAttribLocation(program, 'apos')

    // 从9个元素构成三个顶点的xyz坐标值
    const data = new Float32Array([
      // z为0.5时，xoy平面上的四个点坐标
      0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
      // z为-0.5时，xoy平面上的四个点坐标
      0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5,
      // 从上面的两组坐标分别对应起来组成一对
      0.5, 0.5, 0.5, 0.5, 0.5, -0.5,

      -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,

      -0.5, -0.5, 0.5, -0.5, -0.5, -0.5,

      0.5, -0.5, 0.5, 0.5, -0.5, -0.5
    ])

    // 创建缓存区对象
    const buffer = gl.createBuffer()
    // 绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // 顶点数据data 传入缓冲区
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    // 缓存区中的数据按照一定的规律传递给位置变量apos
    gl.vertexAttribPointer(aposLocation, 3, gl.FLOAT, false, 0, 0)
    // 允许数据传递
    gl.enableVertexAttribArray(aposLocation)

    // Line_Loop模式绘制前四个点
    gl.drawArrays(gl.LINE_LOOP, 0, 4)
    // LINE_LOOP模式从第五个点开始绘制4个点
    gl.drawArrays(gl.LINE_LOOP, 4, 4)
    // LINES模式绘制后8个点
    gl.drawArrays(gl.LINES, 8, 8)
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

export default Cube
