require('dotenv').config()
const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const AWS = require('aws-sdk')

const s3 = new AWS.S3()

const app = express()
app.use(cors())
app.use(fileUpload())

app.post('/upload', async (req, res) => {
  console.log(req.files)
  if (!req.files || !req.files.file_input) {
    res.send({
      "response_code": 400,
      "response_message": "Malformed request."
    })
  }
  AWS.config.update({
    accessKeyId: process.env.AWS_KEY, // Access key ID
    secretAccesskey: process.env.AWS_SECRET, // Secret access key
    region: "us-east-1" //Region
  })
  // Binary data base64
  const fileContent  = Buffer.from(
    req.files.file_input.data, 'binary'
  )
  // Setting up S3 upload parameters
  let filename = `${Date.now()}_${req.files.file_input.name}`
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Body: fileContent,
    ACL:'public-read'
  }
  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err
    }
    res.send({
      "response_code": 200,
      "response_message": "Success",
      "response_data": data
    })
  })
})

app.get('/form', function(req, res) {
  res.send(
    `
    <form method="POST" action="/upload" enctype="multipart/form-data">
    <input type="file" name="file_input" accept=".jpg,.jpeg,.png,.gif" />
    <input type="submit" />
    </form>
    `
  )
})

app.get('/', function(req, res) {
  const params = {
    Bucket: process.env.BUCKET_NAME
  }
  s3.listObjects(params, function(err, data) {
    if (err) {
      res.send(err)
    } else {
      let response = data.Contents.map(d => {
        return {
          filename: d.Key,
          date: d.LastModified
        }
      })
      res.send(response)
    }
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})
