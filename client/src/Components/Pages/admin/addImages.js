import React, { useState } from 'react';
function speak() {  
    // Create a SpeechSynthesisUtterance object
  
    const text = window.getSelection().toString() || "No text highlighted."   
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }



function AddImages() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [text, setText] = useState("");
    const [caption, setCaption] = useState("");

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleCaption = (event) => {
        setCaption(event.target.value);
    };

    const deleteImages = async () => {
        try{
            const response = await fetch('/api/admin/deleteAllImages', {
                method: 'DELETE'
            });
            const res = await response.json();
            if (response.ok){
                console.log("All images successfully deleted")
                setText("All images successfully deleted")
            }
            else{
                console.log("error occured: ", res) 
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    const handleFormSubmit = async (event) => {
        setText('');    
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('caption', caption)

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
            setText("Empty field or invalid type for field. Files must be images and caption must be text.")
            console.log("error occured: ", res) 
        }
    }
    catch(error) {

        console.log(error);
    }
    
    };
    return (
        <><div>
            <h1>Upload Images</h1>
            <form onSubmit={handleFormSubmit}>
                <input id='selectFile' type="file" onChange={handleImageUpload} />
                <input id='caption' type="text" placeholder="Caption" value={caption} onChange={handleCaption} />
                <button id='submitButton' type="submit">Upload</button>
                <p>{text}</p>
            </form>
        </div><div>
            <button id='deleteImages' onClick={deleteImages}>Delete All Images</button>

            </div></>
    );
}

export default AddImages;