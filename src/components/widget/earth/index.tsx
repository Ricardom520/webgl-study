import React, { useEffect } from 'react'
import { initEarth } from './lib/earth'

const Earth: React.FC = () => {
  useEffect(() => {
    initEarth()
  }, [])

  return (
    <div>
      <canvas id='canvas' width={800} height={1200} />
    </div>
  )
}

export default Earth