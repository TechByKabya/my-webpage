import { getPayload } from 'payload'
import config from './src/payload.config'

async function checkMedia() {
  const payload = await getPayload({ config })
  
  const mediaDocs = await payload.find({
    collection: 'media',
    limit: 10,
  })
  
  for (const doc of mediaDocs.docs) {
    if (doc.mimeType?.startsWith('video')) {
      console.log('--- VIDEO DOC ---')
      console.log(JSON.stringify(doc, null, 2))
    } else if (doc.filename?.includes('LOGO')) {
      console.log('--- LOGO DOC ---')
      console.log(JSON.stringify(doc, null, 2))
    }
  }
  
  console.log('Done.')
  process.exit(0)
}

checkMedia()
