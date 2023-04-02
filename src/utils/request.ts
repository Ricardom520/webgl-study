import axios from 'axios'

const service = axios.create({
  baseURL: '/',
  timeout: 5000
  // withCredentials: true
})

service.interceptors.request.use(
  (req) => {
    return req
  },
  function (error) {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res) => res.data,
  function (error) {
    return Promise.reject(error)
  }
)

export default service
