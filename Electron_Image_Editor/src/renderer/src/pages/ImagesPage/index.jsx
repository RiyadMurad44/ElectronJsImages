import './styles.css'
import { Buffer } from 'buffer'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useRef, useEffect, useState } from 'react'

const ImagesPage = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { imgSrc } = state

  const canvasRef = useRef(null)
  const [image, setImage] = useState(null)
  const [angle, setAngle] = useState(0)
  const [grayscale, setGrayscale] = useState(0)
  const [watermarkText, setWatermarkText] = useState('')
  const [watermarkApplied, setWatermarkApplied] = useState(false)

  // Load image once
  useEffect(() => {
    const img = new Image()
    img.src = imgSrc
    img.onload = () => {
      setImage(img)
      drawImage(img, angle, grayscale)
    }
  }, [imgSrc])

  const drawImage = (img, rotation = 0, grayscaleLevel = 0) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const size = 500

    canvas.width = size
    canvas.height = size
    ctx.clearRect(0, 0, size, size)

    ctx.save()
    ctx.translate(size / 2, size / 2)
    ctx.rotate((rotation * Math.PI) / 180)

    const scale = Math.min(size / img.width, size / img.height)
    const imgW = img.width * scale
    const imgH = img.height * scale

    ctx.drawImage(img, -imgW / 2, -imgH / 2, imgW, imgH)
    ctx.restore()

    if (grayscaleLevel > 0) applyGrayscale(grayscaleLevel)
    if (watermarkApplied) applyWatermark()
  }

  const applyGrayscale = (level) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = data[i] + (avg - data[i]) * (level / 100)
      data[i + 1] = data[i + 1] + (avg - data[i + 1]) * (level / 100)
      data[i + 2] = data[i + 2] + (avg - data[i + 2]) * (level / 100)
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyWatermark = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.font = '20px Arial'
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    ctx.textAlign = 'right'
    ctx.fillText(watermarkText || '© My Watermark', canvas.width - 10, canvas.height - 10)
  }

  const handleRotate = () => {
    const newAngle = angle + 90
    const adjusted = newAngle % 360
    setAngle(adjusted)
    drawImage(image, adjusted, grayscale)
  }

  const handleGrayscaleChange = (e) => {
    const val = parseInt(e.target.value)
    setGrayscale(val)
    drawImage(image, angle, val)
  }

  const handleAddWatermark = () => {
    if (!watermarkApplied) {
      applyWatermark()
      setWatermarkApplied(true)
    }
  }

  const saveEditedImage = () => {
    const canvas = canvasRef.current

    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('Failed to convert canvas to Blob.')
        return
      }

      // Read the blob as an array buffer
      const reader = new FileReader()
      reader.onloadend = async () => {
        const buffer = Buffer.from(reader.result)
        const fileName = `edited-${Date.now()}.png`

        try {
          const result = await window.electronAPI.saveImage(buffer, fileName)
          console.log('Image saved successfully:', result)
          navigate('/home')
        } catch (err) {
          console.error('Error saving image:', err)
          alert('Failed to save image.')
        }
      }

      reader.readAsArrayBuffer(blob)
    }, 'image/png')
  }

  // V2
  // const saveEditedImage = () => {
  //   const canvas = canvasRef.current

  //   canvas.toBlob(async (blob) => {
  //     if (!blob) {
  //       console.error('Failed to convert canvas to Blob.')
  //       return
  //     }

  //     // Read the blob as an array buffer
  //     const reader = new FileReader()
  //     reader.onloadend = async () => {
  //       const buffer = Buffer.from(reader.result)

  //       // Use the original image's filename or timestamp for the new file name
  //       const fileName = state.imgSrc.split('/').pop() || `edited-${Date.now()}.png`

  //       try {
  //         // Check if the file already exists and delete it
  //         await window.electronAPI.deleteImage(fileName)

  //         // Save the new image with the same file name
  //         const result = await window.electronAPI.saveImage(buffer, fileName)
  //         console.log('Image saved successfully:', result)

  //         // Navigate back to the home page (or wherever you want to show the updated image)
  //         navigate('/home')
  //       } catch (err) {
  //         console.error('Error saving image:', err)
  //         alert('Failed to save image.')
  //       }
  //     }

  //     reader.readAsArrayBuffer(blob)
  //   }, 'image/png')
  // }

  // const saveEditedImage = () => {
  //   const canvas = canvasRef.current

  //   canvas.toBlob(async (blob) => {
  //     if (!blob) {
  //       console.error('Failed to convert canvas to Blob.')
  //       return
  //     }

  //     // Read the blob as an array buffer
  //     const reader = new FileReader()
  //     reader.onloadend = async () => {
  //       const buffer = Buffer.from(reader.result)

  //       // Use the original image's filename for the new file name
  //       const originalFileName = state.imgSrc.split('/').pop()
  //       const fileName = originalFileName || `edited-${Date.now()}.png`

  //       try {
  //         // Construct the full path where the image should be saved
  //         const filePath = path.join(imageDir, fileName)

  //         // Check if the image already exists and delete it
  //         const fileExists = fs.existsSync(filePath)
  //         if (fileExists) {
  //           await window.electronAPI.deleteImage(filePath)
  //         }

  //         // Save the new image with the same file name
  //         const result = await window.electronAPI.saveImage(buffer, fileName)
  //         console.log('Image saved successfully:', result)

  //         // Navigate back to the home page
  //         navigate('/home')
  //       } catch (err) {
  //         console.error('Error saving image:', err)
  //         alert('Failed to save image.')
  //       }
  //     }

  //     reader.readAsArrayBuffer(blob)
  //   }, 'image/png')
  // }

  return (
    <div className="editor-layout">
      <main className="canvas-area">
        <h2 className="editor-title">🖼️ Image Editor</h2>
        <canvas ref={canvasRef} className="canvas-box" />
      </main>

      <aside className="editor-controls">
        <h3>🛠️ Tools</h3>

        <button onClick={handleRotate}>🔄 Rotate 90°</button>

        <div className="control-group">
          <label htmlFor="grayscale">🖤 Grayscale</label>
          <input
            type="range"
            min="0"
            max="100"
            value={grayscale}
            onChange={handleGrayscaleChange}
          />
        </div>

        <div className="control-group">
          <label htmlFor="watermark">💧 Watermark Text</label>
          <input
            type="text"
            placeholder="Enter watermark..."
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
          />
          <button onClick={handleAddWatermark}>Apply Watermark</button>
        </div>

        {/* <button onClick={handleExport}>📤 Export Image</button> */}
        <button onClick={saveEditedImage}>📤 Export Image</button>
      </aside>
    </div>
  )
}

export default ImagesPage
