/** 请求接口 */

import request from '../utils/request'
import { DemoRequest, DemoResponse } from '~/modals/demo'

export const FetchDemo = () => {
  return request.get<DemoRequest, DemoResponse>('xxx')
}
