import React, { useState, useEffect } from 'react';
function speak() {  
    // Create a SpeechSynthesisUtterance object
  
    let text = "Here you can view photos placed in the library by users."
  
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
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
function PhotoGallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch('/api/displayImages')
            .then(response => response.json())
            .then(data => {
                setImages(data.images);
            })
            .catch(error => console.error('Error fetching images:', error));
            speak();
    }, []);

    return (
        <div>
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
