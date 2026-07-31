import { v2 as cloudinary } from 'cloudinary'

console.log('Testing REAL Cloudinary Upload...')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

try {
  // Test avec une image d'exemple publique
  const result = await cloudinary.uploader.upload('https://cloudinary-devs.github.io/cld-docs-assets/assets/images/butterfly.png', {
    folder: 'test_mdt'
  })
  console.log('✅ Upload Successful!')
  console.log('URL:', result.secure_url)
} catch (error) {
  console.error('❌ Upload Failed!')
  console.error(error)
}
