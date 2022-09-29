# Multi purpose file upload service

Uploads files to an AWS S3 bucket and list them.

## S3 Bucket CORS

```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
```

## Environment Variables
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
BUCKET_NAME=
```

## Endpoints
- `GET /`: List all files in bucket
- `GET /form`: Manually upload a file to the bucket
- `POST /upload`: Expects a `multipart/form-data` payload to upload to S3

## Sending file programatically
```
fetch('http://somewhere/file.jpg', { mode: 'cors' })
.then(r => r.arrayBuffer())
.then(r => {
  console.log('fetched file data', r)
  const formData = new FormData()
  formData.append('file_input',  new File([r], `test.jpg`))
  fetch(
    'http://uploadservice/upload',
    { method: 'POST', body: formData }
  )
  .then(r => r.json())
  .then(console.log)
})
.catch(console.log)
```

## Reference links:
- https://stackoverflow.com/questions/17930204/simple-file-upload-to-s3-using-aws-sdk-and-node-express
- https://stackoverflow.com/questions/14375895/aws-s3-node-js-sdk-uploaded-file-and-folder-permissions#14376684
- https://stackoverflow.com/questions/17533888/s3-access-control-allow-origin-header
