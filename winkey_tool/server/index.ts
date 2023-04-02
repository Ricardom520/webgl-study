const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser())

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

const basePath = './src'
const verifyAsset = /.(jpg|jpeg|gif|bmp|png|svg|svga|mp4|mp3)$/i

/** 获取目录结构 */
app.get('/getLocalFolder', async function (req, res) {
  const readFile = async (filePath, abPath) => {
    const content = []
    const files = await fs.readdirSync(path.join(filePath))

    for (let i = 0; i < files.length; i++) {
      const _abPath = '/' + files[i]
      const _path = filePath + _abPath
      const suffixName = _abPath.substr(_abPath.lastIndexOf('.'))

      const stat = await fs.statSync(_path)

      if (stat && stat.isDirectory()) {
        const children = await readFile(_path, abPath + _abPath)
        content.push({
          name: files[i],
          type: 0,
          path: abPath + _abPath,
          children: children
        })
      } else if (!verifyAsset.test(suffixName)) {
        content.push({
          name: files[i],
          type: 1,
          path: abPath + _abPath
        })
      }
    }

    return content
  }

  const filesRes = await readFile(basePath, '')

  res.send({
    success: 0,
    data: filesRes
  })
})

/** 获取文件详情 */
app.get('/getLocalFileDetail', async function (req, res) {
  const data = fs.readFileSync(basePath + req.query.path, 'utf-8')

  res.send({
    success: 0,
    data: JSON.stringify(data)
  })
})

/** 修改文件 */
app.post('/submitFile', async function (req, res) {
  const fd = fs.openSync(basePath + req.body.path, 'w')

  fs.writeFileSync(fd, req.body.content, 'utf-8')

  fs.closeSync(fd)

  res.send({
    success: 0
  })
})

const server = app.listen(10110, function () {
  const port = server.address().port

  console.log('应用实例，访问地址为 http://localhost:%s', port)
})
