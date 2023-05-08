import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, useRoutes } from 'react-router-dom'
import Home from '~@/pages/home'
import WebGl from '~@/pages/webgl'
import ThreeJS from '~@/pages/threeJS'

import './index.scss'

const routes = [
  {
    path: '/',
    name: '主页',
    element: <Home />
  },
  {
    path: '/webgl',
    name: 'webgl',
    element: <WebGl />
  },
  {
    path: '/threejs',
    name: 'threejs',
    element: <ThreeJS />
  }
]

const Router = () => {
  const elm = useRoutes(routes)

  return elm
}

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement)

root.render(
  <HashRouter>
    <Router />
  </HashRouter>
)
