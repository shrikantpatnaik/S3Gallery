# S3 Gallery
This is just a simple meteor app that takes my images from s3 and shows them as a gallery.

## Required Settings
* AWS.accessKeyId
* AWS.secretAccessKey
* AWS.s3BucketName
* AWS.s3BucketMainFolder
  * Will only search in this folder
* public.AWS.s3LowQualityFolderName
  * Will only add files in these subfolders
* public.AWS.s3HighQualityFolderName
  * Used to as string replace argument to get High quality images
* public.photosBaseUrl
  * The base URL for photos, this will usually be the S3 bucket URL or FQDN
