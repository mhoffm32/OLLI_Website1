import React, { useState } from 'react';

function AddImages() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [text, setText] = useState("");

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleFormSubmit = async (event) => {
        setText('');    
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', selectedImage);

         const response = await fetch('/admin/uploadImages', {
            method: 'POST',
            body: formData,
        });
        const res = await response.json();
        if (response.ok){
            console.log("file successfully uploaded")
            setText("Image successfully uploaded")
        } else {
            setText(res)
            console.log("error occured: ", res)
        }
    };

    return (
        <div>
            <h1>Upload Images</h1>
            <form onSubmit={handleFormSubmit}>
                <input type="file" onChange={handleImageUpload} />
                <button type="submit">Upload</button>
                <p>{text}</p>
            </form>
        </div>
    );
}

export default AddImages;