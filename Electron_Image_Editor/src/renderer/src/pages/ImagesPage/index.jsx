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


// import './styles.css'
// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'
// import { usePhotoEditor } from 'react-photo-editor'

// const ImagesPage = () => {
//   const location = useLocation()
//   const { imgSrc } = location.state || {}
//   const [file, setFile] = useState(null)
//   const [watermark, setWatermark] = useState('')

//   useEffect(() => {
//     // Convert the imgSrc to a File object
//     fetch(imgSrc)
//       .then((res) => res.blob())
//       .then((blob) => {
//         const file = new File([blob], 'edited-image.png', { type: blob.type })
//         setFile(file)
//       })
//   }, [imgSrc])

//   const {
//     canvasRef,
//     brightness,
//     contrast,
//     saturate,
//     grayscale,
//     rotate,
//     zoom,
//     setBrightness,
//     setContrast,
//     setSaturate,
//     setGrayscale,
//     setRotate,
//     setZoom,
//     handleZoomIn,
//     handleZoomOut,
//     generateEditedFile,
//     resetFilters
//   } = usePhotoEditor({
//     file,
//     defaultBrightness: 100,
//     defaultContrast: 100,
//     defaultSaturate: 100,
//     defaultGrayscale: 0
//   })

//   const handleSave = async () => {
//     // Draw watermark before saving
//     const ctx = canvasRef.current.getContext('2d')
//     ctx.font = '24px sans-serif'
//     ctx.fillStyle = 'rgba(255,255,255,0.6)'
//     ctx.fillText(watermark, 20, canvasRef.current.height - 20)

//     const editedFile = await generateEditedFile()
//     const arrayBuffer = await editedFile.arrayBuffer()
//     const buffer = Buffer.from(arrayBuffer)
//     window.electronAPI.saveImage(buffer)
//   }

//   return (
//     <div className="image-editor-page">
//       <aside className="editor-controls">
//         <div>
//           <label>Brightness: {brightness}</label>
//           <input
//             type="range"
//             min="0"
//             max="200"
//             value={brightness}
//             onChange={(e) => setBrightness(+e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Contrast: {contrast}</label>
//           <input
//             type="range"
//             min="0"
//             max="200"
//             value={contrast}
//             onChange={(e) => setContrast(+e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Saturation: {saturate}</label>
//           <input
//             type="range"
//             min="0"
//             max="200"
//             value={saturate}
//             onChange={(e) => setSaturate(+e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Grayscale: {grayscale}</label>
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={grayscale}
//             onChange={(e) => setGrayscale(+e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Rotate: {rotate}°</label>
//           <input
//             type="range"
//             min="0"
//             max="360"
//             value={rotate}
//             onChange={(e) => setRotate(+e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Zoom: {zoom}</label>
//           <div>
//             <button onClick={handleZoomIn}>Zoom In</button>
//             <button onClick={handleZoomOut}>Zoom Out</button>
//           </div>
//         </div>
//         <div>
//           <label>Watermark Text</label>
//           <input type="text" value={watermark} onChange={(e) => setWatermark(e.target.value)} />
//         </div>
//         <div className="editor-actions">
//           <button onClick={resetFilters}>Reset Filters</button>
//           <button onClick={handleSave}>Save Image</button>
//         </div>
//       </aside>

//       <div className="canvas-container">
//         <canvas ref={canvasRef} className="rpe-canvas" />
//       </div>
//     </div>
//   )
// }

// export default ImagesPage