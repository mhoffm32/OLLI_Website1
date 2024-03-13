import React, { useState } from 'react';

function AddImages() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', selectedImage);

        fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response from the server
                console.log(data);
            })
            .catch((error) => {
                // Handle any errors
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Upload Images</h1>
            <form onSubmit={handleFormSubmit}>
                <input type="file" onChange={handleImageUpload} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default AddImages;