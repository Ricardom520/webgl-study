/**
 * 文档：
 * https://threejs.org/docs/index.html#examples/en/loaders/GLTFLoader
 * 教程：
 * https://github.com/JChehe/blog/issues/44
 */
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { AnimationClip, Camera, Group } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

interface THEModal {
  animations: AnimationClip
  asset: {
    generator: string
    version: string
  }
  cameras: Camera[]
  parser: any
  scene: Group
  scenes: Group[]
  userData: Record<string, string>
}

const Reskin: React.FC = () => {
  let renderer: THREE.WebGLRenderer | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let theModel = null

  // camera的距离
  const cameraFar = 5
  // 背景色变量
  const BACKGROUND_COLOR = 0xf1f1f1
  // 模型文件
  const MODEL_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb'

  const init = () => {
    // Init the scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(BACKGROUND_COLOR)
    scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100)

    const canvas = document.querySelector('#canvas') as HTMLCanvasElement
    // Init the renderer
    // 创建一个 WebGLRenderer，传入 canvas 和选项参数（抗齿距，使 3D 模型的边缘更光滑）。
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
    document.body.appendChild(renderer.domElement)

    // 这是一个透视摄像机，其参数为 50 视场（field of view，fov），宽高比和默认的裁剪区域。裁剪区域指定了可视区域的前后边界。
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = cameraFar
    camera.position.x = 0

    // 加载模型文件
    const loader = new GLTFLoader()
    loader.load(
      MODEL_PATH,
      function (gltf: THEModal) {
        console.log('gltf:', gltf)
        if (!scene) return
        theModel = gltf.scene

        // Set the models initial scale
        theModel.scale.set(2, 2, 2)

        // Offset the y position a bit
        theModel.position.y = -1

        // Add the model to the scene
        scene.add(theModel)
      },
      undefined,
      function (err: Error) {
        console.error(err)
      }
    )

    animate()
  }

  const animate = () => {
    if (!renderer || !scene || !camera) return
    renderer?.render(scene, camera)

    requestAnimationFrame(animate)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <canvas id='canvas' />
    </>
  )
}

export default Reskin
