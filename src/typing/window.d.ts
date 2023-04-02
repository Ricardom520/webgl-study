interface Window {
  webkitRequestAnimationFrame?: (callback: FrameRequestCallback) => number
  mozRequestAnimationFrame?: (callback: FrameRequestCallback) => number
  oRequestAnimationFrame?: (callback: FrameRequestCallback) => number
  msRequestAnimationFrame?: (callback: FrameRequestCallback) => number
  cancelRequestAnimationFrame?: (handle: number) => void
  webkitCancelAnimationFrame?: (handle: number) => void
  mozCancelAnimationFrame?:(handle: number) => void
  msCancelAnimationFrame?: (handle: number) => void
  oCancelAnimationFrame?: (handle: number) => void
  webkitCancelRequestAnimationFrame?: (handle: number) => void
  mozCancelRequestAnimationFrame?: (handle: number) => void
  msCancelRequestAnimationFrame?: (handle: number) => void
  oCancelRequestAnimationFrame?: (handle: number) => void
}
