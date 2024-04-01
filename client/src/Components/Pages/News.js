import React, { Component } from 'react';
import { useState,useEffect } from 'react';
function speak() {  
  // Create a SpeechSynthesisUtterance object

  const text = window.getSelection().toString() || "No text highlighted."
  const utterance = new SpeechSynthesisUtterance(text);

  
  // Speak the text
  window.speechSynthesis.speak(utterance);
}
const News = () => {
    const [newsletters, setNewsletters] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    

    useEffect(()=>{
      getNewsletters()
    },[])

    const dynamicStyle = {
      left: isSidebarOpen ? '60px' : '0px',
      transition: '0.5s', // Animated transition for the sidebar toggle button
  };
  
    const getNewsletters = async () => {
        try {
          const response = await fetch('/api/user/viewNewsletters');
          if (response.ok) {
            const data = await response.json();
            let newsletters =  data.newsletters;
            
            for (let n of newsletters){
              n.date = n.date.split('T')[0]
            }
            console.log(newsletters)
            setNewsletters(newsletters)
  
            } else {
                console.error('Failed to fetch newsletters:', response.statusText);
            }
  
        }catch(error){
          console.error("error",error)
        }
      }

      const toggleSidebar = () => { // Step 2: Toggle function
        setIsSidebarOpen(!isSidebarOpen);
    };

      const downloadPdf = async(letter_id,file_name) => {
        try{
          document.body.style.cursor = 'wait';
          const response = await fetch(`/api/user/downloadNewsletter/${letter_id}`);
          
          if (response.ok) {
  
            const data = await response.json();
            const letter = data.letter;
            console.log("letter", letter)
            const href = `data:application/pdf;base64,${letter}`;
  
            const anchor = document.createElement('a');
            anchor.href = href;
            anchor.download = file_name; 
            anchor.click();
            anchor.remove();
  
            } else {
                console.error('Failed to fetch newsletters:', response.statusText);
            }
  
        }catch(error){
          console.error("error",error)
        }
        document.body.style.cursor = 'auto';
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

      const cancelSpeech = () => {  
        window.speechSynthesis.cancel();
    };
  
      const openPdf = async (letter_id, file_name) => {
        try {
          document.body.style.cursor = 'wait';
          const response = await fetch(`/api/user/downloadNewsletter/${letter_id}`);
  
          if (response.ok) {
            const data = await response.json();
            const letter = data.letter;
            const pdfData = `data:application/pdf;base64,${letter}`;
      
            // Open a new window with the PDF content
            const newWindow = window.open();
            newWindow.document.write(`
              <html>
                <head>
                  <title>${file_name}</title>
                </head>
                <body style="margin: 0; padding: 0; overflow: hidden;">
                  <iframe width="100%" height="100%" src="${pdfData}" frameborder="0" title="${file_name}"></iframe>
                </body>
              </html>
            `);
            
          } else {
            console.error('Failed to fetch newsletters:', response.statusText);
          }
        } catch (error) {
          console.error("error", error);
        }
        document.body.style.cursor = 'auto';
      }
  
    
    return (
      <div>
          <button className="sidebar-toggle" style={dynamicStyle} onClick={toggleSidebar}>{isSidebarOpen ? <img src="/images/icons/close.png"></img> : <img src="/images/icons/sidebaropen.png"></img>}</button>
          <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

         <div className='speech-button'>
                        <button id="speech-btn" onClick={readHighlightedText}>
                            <img id="speaker" src='/images/icons/speech.png'></img></button>

             </div>
             <div className="cancel-speech">
                <button id="cancel-btn" onClick={cancelSpeech}>
                <img id="pause" src='/images/icons/pause.png'></img></button>
                </div>
             </div>

        <div className="news">
            <h1>News</h1>
            <p className='letterheader'> Below are our recent newsletters. Click to view or download any!</p>
            {localStorage.getItem('jwt') ?
            <div id='newsletter-list'>
                {newsletters !== null ? newsletters.map((newsletter, index) => (
            <div className="newsletter-item" key={index}>
              <div className="info-container">
                <p className="letter-info">
                  {newsletter.letter_name} {newsletter.date} 
                  <a onClick={() => { downloadPdf(newsletter._id, newsletter.pdf_name) }} download={newsletter.pdf_name}>
                    <img id="download-img" src='/images/icons/download.png' alt="Download" title="Download PDF" />
                  </a>
                  <a onClick={() => { openPdf(newsletter._id, newsletter.pdf_name,newsletter.letter_name)}} download={newsletter.pdf_name}>
                    <img id="download-img" src='/images/icons/open.png' alt="Download" title="Open PDF" />
                  </a>
                </p>
              </div>
            </div>
          )) : <></>}
      </div> : <></>}
        </div>
      </div>
    );
    
}


export default News;
