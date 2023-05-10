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
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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

interface TraverseEvent extends THREE.Event {
  isMesh?: boolean
}

const Reskin: React.FC = () => {
  let renderer: THREE.WebGLRenderer | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let theModel = null
  let controls: any = null

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
    renderer.shadowMap.enabled = true
    renderer.setPixelRatio(1)
    document.body.appendChild(renderer.domElement)

    // 这是一个透视摄像机，其参数为 50 视场（field of view，fov），宽高比和默认的裁剪区域。裁剪区域指定了可视区域的前后边界。
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = cameraFar
    camera.position.x = 0

    // 材质
    const INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0xf1f1f1, shininess: 10 })
    // 将材质的数据结构声明为一个数组
    // 再次遍历 3D 模型（的组成元素），并使用 childID 查找椅子的不同部分，然后设置相应材质（mtl 属性）。模型每个元素的名字都是在 Blender 中设置的
    const INITIAL_MAP = [
      { childID: 'back', mtl: INITIAL_MTL },
      { childID: 'base', mtl: INITIAL_MTL },
      { childID: 'cushions', mtl: INITIAL_MTL },
      { childID: 'legs', mtl: INITIAL_MTL },
      { childID: 'supports', mtl: INITIAL_MTL }
    ]

    // 加载模型文件
    const loader = new GLTFLoader()
    loader.load(
      MODEL_PATH,
      function (gltf: THEModal) {
        console.log('gltf:', gltf)
        if (!scene) return
        theModel = gltf.scene

        theModel.traverse((o: TraverseEvent) => {
          if (o.isMesh) {
            o.castShadow = true
            o.receiveShadow = true
          }
        })

        // Set the models initial scale
        theModel.scale.set(2, 2, 2)

        // Offset the y position a bit
        theModel.position.y = -1
        theModel.rotation.y = Math.PI

        for (const object of INITIAL_MAP) {
          initColor(theModel, object.childID, object.mtl)
        }

        // Add the model to the scene
        scene.add(theModel)
      },
      undefined,
      function (err: Error) {
        console.error(err)
      }
    )

    // 半球光
    // 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
    // 半球光不能投射阴影。
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61)
    hemiLight.position.set(0, 50, 0)
    scene.add(hemiLight)

    // 平行光
    // 平行光是沿着特定方向发射的光。这种光的表现像是无限远,从它发出的光线都是平行的。常常用平行光来模拟太阳光 的效果; 太阳足够远，因此我们可以认为太阳的位置是无限远，所以我们认为从太阳发出的光线也都是平行的。
    // 平行光可以投射阴影
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.54)
    dirLight.position.set(-8, 12, 8)
    dirLight.castShadow = true
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
    scene.add(dirLight)

    // 创建地板
    // 平面缓冲几何体
    const floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1)
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      shininess: 0
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -0.5 * Math.PI
    floor.receiveShadow = true
    floor.position.y = -1
    scene.add(floor)

    // 添加控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.maxPolarAngle = Math.PI / 2
    controls.minPolarAngle = Math.PI / 3
    controls.enableDamping = true
    controls.enablePan = false
    controls.dampingFactor = 0.1
    controls.autoRotate = false // Toggle this if you'd like the chair to automatically rotate
    controls.autoRotateSpeed = 0.2 // 30

    animate()
  }

  const animate = () => {
    if (!renderer || !scene || !camera || !controls) return
    renderer?.render(scene, camera)

    controls.update()

    requestAnimationFrame(animate)

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
  }

  const resizeRendererToDisplaySize = (renderer: THREE.Renderer) => {
    const canvas = renderer.domElement
    const width = window.innerWidth
    const height = window.innerHeight
    const canvasPixelWidth = canvas.width / window.devicePixelRatio
    const canvasPixelHeight = canvas.height / window.devicePixelRatio

    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height

    if (needResize) {
      renderer.setSize(width, height, false)
    }

    return needResize
  }

  const initColor = (parent: Group, type: string, mtl: THREE.MeshBasicMaterial) => {
    parent.traverse((o: TraverseEvent) => {
      if (o.isMesh) {
        if (o.name.includes(type)) {
          o.material = mtl
          o.nameID = type // Set a new property to identify this object
        }
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <canvas width={window.innerWidth} height={window.innerHeight} id='canvas' />
    </>
  )
}

export default Reskin
