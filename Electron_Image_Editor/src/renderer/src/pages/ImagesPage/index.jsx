import React, { useState } from 'react';
import { ReactPhotoEditor } from 'react-photo-editor';
import { useNavigate, useLocation } from 'react-router-dom';

const ImagesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedImage = location.state?.imageSrc;

  const [image, setImage] = useState(passedImage || null);

  const handleSave = (editedImageBlob) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = Buffer.from(reader.result);
      const fileName = `edited_${Date.now()}.png`;

      // Use exposed Electron API
      window.electronAPI.saveImage(buffer, fileName);
      navigate('/home');
    };
    reader.readAsArrayBuffer(editedImageBlob);
  };

  // Debugging log for image state
  console.log('Image to edit:', image);

  return (
    <div>
      <h2>Edit Your Image</h2>
      {/* Check if `image` exists before rendering the editor */}
      {image ? (
        <ReactPhotoEditor src={image} onSave={handleSave} onCancel={() => navigate('/home')} />
      ) : (
        <p>Loading image...</p> // Placeholder message if the image isn't available
      )}
    </div>
  );
};

export default ImagesPage;








// import React, { useState } from 'react'
// import { ReactPhotoEditor } from 'react-photo-editor';
// import { useNavigate, useLocation } from 'react-router-dom'
// // import { PhotoEditor } from 'react-photo-editor'
// // const PhotoEditor = require('react-photo-editor')

// const ImagesPage = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const passedImage = location.state?.imageSrc

//   // window.electronAPI.saveImage(buffer, 'myfile.png');

//   const [image, setImage] = useState(passedImage || null)

//   const handleSave = (editedImageBlob) => {
//     const reader = new FileReader()
//     reader.onload = () => {
//       const buffer = Buffer.from(reader.result)
//       const fileName = `edited_${Date.now()}.png`

//       // Use exposed Electron API
//       window.electronAPI.saveImage(buffer, fileName)
//       navigate('/home')
//     }
//     reader.readAsArrayBuffer(editedImageBlob)
//   }

//   return (
//     <div>
//       <h2>Edit Your Image</h2>
//       <ReactPhotoEditor src={image} onSave={handleSave} onCancel={() => navigate('/home')} />
//     </div>
//   )
// }

// export default ImagesPage
