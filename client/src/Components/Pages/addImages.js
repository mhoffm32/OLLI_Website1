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

        try{

         const response = await fetch('/api/admin/uploadImages', {
            method: 'POST',
            body: formData
        });
        const res = await response.json();
        console.log(res)
        if (response.ok){
            console.log("file successfully uploaded")
            setText("File successfully uploaded")
        }
        else{
            setText("No file included or invalid type")
            console.log("error occured: ", res) 
        }
    }
    catch(error) {

        console.log(error);
    }
    
    };

    return (
        <div>
            <h1>Upload Images</h1>
            <form onSubmit={handleFormSubmit}>
                <input id='selectFile' type="file" onChange={handleImageUpload} />
                <button id='submitButton' type="submit">Upload</button>
                <p>{text}</p>
            </form>
        </div>
    );
}

export default AddImages;