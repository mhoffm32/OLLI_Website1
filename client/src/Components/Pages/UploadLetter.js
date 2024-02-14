import { useEffect, useState } from "react";

const UploadLetter = ({ changePage , user}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newsletters, setNewsletters] = useState(null);
  const [letterStates, setletterStates] = useState(null);
  const [lettersLoaded, setLoaded] = useState(0);

  const [uploadText, setText] = useState("");
  const [letterName, setName] = useState("");


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(()=>{
    getNewsletters()
  },[])


  const handleUpload = async (code) => {   
    setText('')

    if(selectedFile && letterName){   
        try {

          setText("Uploading Newsletter...")

          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("customName", letterName);
         
          const response = await fetch('http://localhost:3002/api/admin/uploadNewsletter', {
              method: "POST",
              body: formData
          });
          const res = await response.json();

        if (response.ok){
          setLoaded(0)
          console.log("file successfully uploaded")
          setText("Newsletter successfully uploaded")
        } else {
          setText(res)
          console.log("error occured: ", res)
        }
        } catch (error) {
          setText('Error uploading file: '+ error.message);
          console.error('Error uploading file:', error.message);
        }
      }else{
        console.log("file", selectedFile)
        console.log("filename", letterName)
        setText("Please attach a file and specify the newsletter title.")
        console.log("no file attached")
      }
      getNewsletters();
    };

    const getNewsletters = async () => {
      try {
        console.log("get letters called")
        const response = await fetch('http://localhost:3002/api/user/viewNewsletters');
        if (response.ok) {
          const data = await response.json();
          let newsletters =  data.newsletters;

          for (let n of newsletters){
            n.date = n.date.split('T')[0]
          }
  
          if(!lettersLoaded){
            let dStates = {}
            for(let letter of newsletters){
              dStates[letter._id] = 0;
            }
            setLoaded(1)
            setletterStates(dStates)
          }

          setNewsletters(newsletters)

          } else {
              console.error('Failed to fetch newsletters:', response.statusText);
          }

      }catch(error){
        console.error("error",error)
      }
    }

    const deleteNewsletter = async (letter_id) => {
  //let button = document.getElementById(letter_id);

      
        try{
          document.body.style.cursor = 'wait';

          const response = await fetch('http://localhost:3002/api/user/deleteNewsletter', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: letter_id})
          });

          if (response.ok) {
            console.log("successfully deleted")
          } else {
                console.error('Failed to fetch newsletters:', response.statusText);
          }
  
        }catch(error){
          console.error("error",error)
        }
        document.body.style.cursor = 'auto';
        getNewsletters()
      
    }

    const handleCancel = (letter_id) => {
      setletterStates((prevStates) => ({
        ...prevStates,
        [letter_id]: 0
      }));
    }

    const handleDelete = (letter_id) => {
      setletterStates((prevStates) => ({
        ...prevStates,
        [letter_id]: 1
      }));
    };

    const downloadPdf = async(letter_id,file_name) => {
      try{
        document.body.style.cursor = 'wait';
        const response = await fetch(`http://localhost:3002/api/user/downloadNewsletter/${letter_id}`);
        
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

    const openPdf = async (letter_id, file_name) => {
      try {
        document.body.style.cursor = 'wait';
        const response = await fetch(`http://localhost:3002/api/user/downloadNewsletter/${letter_id}`);

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
    <div id="upload-pdf">
       <p id="upload-nl"> Upload Newsletter </p>

       <div id="stuff-nl">
       <input type="file" onChange={handleFileChange}/>
        Newsletter Title: <input type="text" onChange={(e)=> setName(e.target.value)}></input>
       <button onClick={handleUpload}>Upload</button>
       </div>
       <p>{uploadText}</p>
       <div id='newsletter-list'>
                {newsletters !== null ? newsletters.map((newsletter, index) => (
            <div className="newsletter-item" key={index}>
              <div className="info-container">
                <p className="letter-info">
                  {newsletter.letter_name} {newsletter.date} 
                  <a onClick={() => { downloadPdf(newsletter._id, newsletter.pdf_name) }} download={newsletter.pdf_name}>
                    <img id="download-img" src='/images/icons/download.png' alt="Download" />
                  </a>
                  <a onClick={() => { openPdf(newsletter._id, newsletter.pdf_name,newsletter.letter_name)}} download={newsletter.pdf_name}>
                    <img id="download-img" src='/images/icons/open.png' alt="Download" />
                  </a>
                </p>
              </div>
              <div className="button-container">
                {letterStates[newsletter._id] === 1 ? (
                  <>
                    <button className="delete-nl" onClick={() => deleteNewsletter(newsletter._id)}>Confirm</button>
                    <button className="cancel-nl" onClick={() => handleCancel(newsletter._id)}>Cancel</button>
                  </>
                ) : (
                  <button className="delete-nl" onClick={() => handleDelete(newsletter._id)}>Delete</button>
                )}
              </div>
            </div>
          )) : <></>}
      </div>
      
    </div>
  );
};

export default UploadLetter;
