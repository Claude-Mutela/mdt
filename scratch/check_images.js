import fs from 'fs'

function getJpegDimensions(buffer) {
  let i = 4
  while (i < buffer.length) {
    const marker = buffer.readUInt16BE(i)
    if (marker === 0xffc0 || marker === 0xffc2) {
      return { height: buffer.readUInt16BE(i + 5), width: buffer.readUInt16BE(i + 7) }
    }
    i += 2 + buffer.readUInt16BE(i + 2)
  }
  return null
}

function getPngDimensions(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

const files = [
  'public/logo.jpg',
  'public/og-logo.jpg',
  'public/log-phila-mdt.png',
  'public/MDT LOGO ORANGE.png',
]

for (const f of files) {
  const buf = fs.readFileSync(f)
  let dim = null
  if (f.endsWith('.png')) dim = getPngDimensions(buf)
  else dim = getJpegDimensions(buf)
  console.log(f, buf.length, 'bytes', dim)
}
