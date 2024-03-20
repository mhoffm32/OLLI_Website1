import React, { useState, useEffect } from 'react';


function speak(){
    const text = window.getSelection().toString() || "No text highlighted."
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);

}


function formatDateAndTime(date){
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    let hour = d.getHours();
    let suffix = (hour >= 12) ? "PM" : "AM";
    if(hour >12){
        hour = hour - 12;
        suffix = "PM";
    }
    else if(hour === 0){
        hour = 12;
        suffix = "AM";
    }
    else{
        suffix = "AM";  
    }
    const minute = d.getMinutes();
    return `${month}/${day}/${year} ${hour}:${minute}${suffix}`;

}

const readHighlightedText = () => {
    const text = window.getSelection().toString();
    if(text){
        speak(text);
    }
    else{
        speak("No text is highlighted");
    }
};
function PhotoGallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch('/api/displayImages')
            .then(response => response.json())
            .then(data => {
                setImages(data.images);
            })
            .catch(error => console.error('Error fetching images:', error));
    }, []);

    return (
        <div>
             <div className='speech-button'>
                        <button id="speech-btn" onClick={readHighlightedText}>
                            <img id="speaker" src='/images/icons/speech.png'></img>Click to hear highlighted text out loud</button>


             </div>
            <h1>Photo Gallery</h1>
            {images.map(image => (
                <div key={image._id}>
                    <img id='images' src={`data:image/jpeg;base64,${image.image}`} alt="Uploaded" />
                    <p>{image.caption}</p>
                    <p>{formatDateAndTime(image.uploadDate)}</p>
                </div>
            ))}
        </div>
    );
}

export default PhotoGallery;
