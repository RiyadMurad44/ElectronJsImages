import { contextBridge, nativeImage } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from 'fs'
import path from 'path'
import { app } from '@electron/remote'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

const imageDir = isDev
  ? path.join(__dirname, '../../src/renderer/src/assets/photos')
  : path.join(process.resourcesPath, 'assets/photos')

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

// New Code Added
contextBridge.exposeInMainWorld('electronAPI', {
  saveImage: (buffer, fileName) => {
    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true })
    const filePath = path.join(imageDir, fileName)
    fs.writeFileSync(filePath, buffer)
  },

  getImages: () => {
    try {
      if (!fs.existsSync(imageDir)) return []
      const files = fs.readdirSync(imageDir)
      const imageFiles = files.filter((file) => /\.(png|jpe?g)$/i.test(file))

      return imageFiles.map((file) => {
        const filePath = path.join(imageDir, file)
        const imageBuffer = fs.readFileSync(filePath)
        const base64 = imageBuffer.toString('base64')
        const mime = file.endsWith('.jpg') || file.endsWith('.jpeg') ? 'image/jpeg' : 'image/png'
        return {
          name: file,
          src: `data:${mime};base64,${base64}`,
          fullPath: filePath
        }
      })
    } catch (err) {
      console.error('Error reading image files:', err)
      return []
    }
  },

  deleteImage: (fullPath) => {
    try {
      console.log('Attempting to delete image at path:', fullPath)
      if (!fullPath) {
        console.error('Error: fullPath is undefined or empty.')
        return false
      }
      fs.unlinkSync(fullPath)
      return true
    } catch (err) {
      console.error('Failed to delete image:', err)
      return false
    }
  }
})
