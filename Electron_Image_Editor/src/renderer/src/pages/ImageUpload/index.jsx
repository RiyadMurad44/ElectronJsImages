import './styles.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import uploadIcon from '../../assets/icons/upload.jpg'
import { Buffer } from 'buffer'

const ImageUpload = () => {
  const [image, setImage] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageURL = URL.createObjectURL(file)
      setImage({ file, url: imageURL })
    }
  }

  const handleSave = () => {
    if (!title || !image) {
      alert('Please provide a title and select an image.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const buffer = Buffer.from(reader.result)
      const fileName = `${title.trim().replace(/\s+/g, '_')}_${Date.now()}.png`
      window.electronAPI.saveImage(buffer, fileName)
      navigate('/home')
    }
    reader.readAsArrayBuffer(image.file)
  }

  return (
    <div className="upload-container">
      <h2>Add/Edit Image</h2>

      <label className="upload-box">
        {image ? (
          <img src={image.url} alt="Uploaded" className="preview-image" />
        ) : (
          <>
            <img src={uploadIcon} alt="Upload Icon" className="upload-icon" />
            <span>Click to Upload Image</span>
          </>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
      </label>

      <input
        type="text"
        placeholder="Title*"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input"
      />

      <button className="save-button" onClick={handleSave}>
        Add Image
      </button>
    </div>
  )
}

export default ImageUpload
