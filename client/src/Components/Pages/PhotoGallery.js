

import React, { useState, useEffect } from 'react';
function introSpeak() {  
    // Create a SpeechSynthesisUtterance object
  
    let text = "Here you can view photos placed in the library by users."
  
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }

function speak() {
  const text = window.getSelection().toString() || "No text highlighted.";
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

function formatDateAndTime(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  let hour = d.getHours();
  let suffix = hour >= 12 ? "PM" : "AM";
  if (hour > 12) {
    hour = hour - 12;
    suffix = "PM";
  } else if (hour === 0) {
    hour = 12;
    suffix = "AM";
  } else {
    suffix = "AM";
  }
  const minute = d.getMinutes();
  return `${month}/${day}/${year} ${hour}:${minute}${suffix}`;
}

const readHighlightedText = () => {
  const text = window.getSelection().toString();
  if (text) {
    speak(text);
  } else {
    speak("No text is highlighted");
  }
};

const cancelSpeech = () => {
  window.speechSynthesis.cancel();
};

function PhotoGallery() {
  const [images, setImages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/displayImages")
      .then((response) => response.json())
      .then((data) => {
        setImages(data.images);
      })
      .catch((error) => console.error("Error fetching images:", error));
    speak();
  }, []);

    useEffect(() => {
        fetch('/api/displayImages')
            .then(response => response.json())
            .then(data => {
                setImages(data.images);
            })
            .catch(error => console.error('Error fetching images:', error));
            introSpeak();
    }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const dynamicStyle = {
    left: isSidebarOpen ? "60px" : "0px",
    transition: "0.5s",
  };

  return (
    <div>
      <button
        className="sidebar-toggle"
        style={dynamicStyle}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <img src="/images/icons/close.png"></img>
        ) : (
          <img src="/images/icons/sidebaropen.png"></img>
        )}
      </button>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="speech-button">
          <button id="speech-btn" onClick={readHighlightedText}>
            <img id="speaker" src="/images/icons/speech.png"></img>
          </button>
        </div>
        <div className="cancel-speech">
          <button id="cancel-btn" onClick={cancelSpeech}>
            <img id="pause" src="/images/icons/pause.png"></img>
          </button>
        </div>
      </div>
      <h1>Photo Gallery</h1>
      {images.map((image) => (
        <div key={image._id}>
          <img
            id="images"
            src={`data:image/jpeg;base64,${image.image}`}
            alt="Uploaded"
          />
          <p>{image.caption}</p>
          <p>{formatDateAndTime(image.uploadDate)}</p>
        </div>
      ))}
    </div>
  );
}

export default PhotoGallery;
