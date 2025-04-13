import { useNavigate } from 'react-router-dom'
import ImageCard from '../../components/ImageCards'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const navigate = useNavigate()
  const [images, setImages] = useState([])

  useEffect(() => {
    const loadedImages = window.electronAPI.getImages()
    setImages(loadedImages)
  }, [])

  const handleDelete = (imagePath) => {
    const success = window.electronAPI.deleteImage(imagePath)
    if (success) {
      setImages(images.filter((img) => img.fullPath !== imagePath))
    }
  }

  return (
    <div className="card-container">
      {images.map((img, i) => (
        <ImageCard
          key={i}
          imageSrc={img.src}
          title={img.name}
          description="Description"
          onEdit={() => navigate('/imageView', { state: { imgrc: img.src } })}
          onDelete={() => handleDelete(img.fullPath)}
        />
      ))}
    </div>
  )
}

export default Home
