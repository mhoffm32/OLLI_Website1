import React, { useState, useEffect } from 'react';


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
    const second = d.getSeconds();
    return `${month}/${day}/${year} ${hour}:${minute}:${second}${suffix}`;

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
    }, []);

    return (
        <div>
            <h1>Photo Gallery</h1>
            {images.map(image => (
                <div key={image._id}>
                    <img src={`data:image/jpeg;base64,${image.image}`} alt="Uploaded" />
                    <p>{formatDateAndTime(image.uploadDate)}</p>
                </div>
            ))}
        </div>
    );
}

export default PhotoGallery;
