import React, { Component } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
function speak() {  
    // Create a SpeechSynthesisUtterance object
  
    const text = window.getSelection().toString() || "No text highlighted";
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }
class DropIns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropOffTime: new Date(),
            pickUpTime: new Date(),
            note: '',
            isSidebarOpen: false,
            submissionMessage: '' // Add a state property for the submission message
        };
        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    handleInputChange = (event) => {
        this.setState({ note: event.target.value });
    }

    handleDropOffTimeChange = (date) => {
        this.setState({ dropOffTime: date });
    };

    handlePickUpTimeChange = (date) => {
        this.setState({ pickUpTime: date });
    };

    readHighlightedText = () => {
        const text = window.getSelection().toString();
        if(text){
            speak(text);
        }
        else{
            window.speechSynthesis.cancel();
            speak("No text is highlighted");
        }
    };

    cancelSpeech = () => {  
        window.speechSynthesis.cancel();
    };

    toggleSidebar(){
        this.setState({isSidebarOpen: !this.state.isSidebarOpen});
    }   

    handleSubmit = (event) => { 
        event.preventDefault();
        const { dropOffTime, pickUpTime } = this.state;
        const token = localStorage.getItem("jwt");
        const username = token ? jwtDecode(token).username : '';

            // Convert times to dayjs objects for easy comparison
        const dropOffDayjs = dayjs(dropOffTime);
        const pickUpDayjs = dayjs(pickUpTime);

        // Define the start and end times for comparison
        const startTime = dropOffDayjs.hour(9).minute(0); // 9:00 AM
        const endTime = dropOffDayjs.hour(17).minute(0); // 5:00 PM

        // Check if drop-off and pick-up times are within the allowed range
        if (dropOffDayjs.isBefore(startTime) || dropOffDayjs.isAfter(endTime) || pickUpDayjs.isBefore(startTime) || pickUpDayjs.isAfter(endTime)) {
            this.setState({ submissionMessage: 'Please only select times between 9 AM and 5 PM.' });
            return; // Prevent the form from being submitted
        }
    
        const formattedDropOff = dayjs(dropOffTime).format('YYYY-MM-DD hh:mm A');
        const formattedPickUp = dayjs(pickUpTime).format('YYYY-MM-DD hh:mm A');
    
        fetch(`/dropins/`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: username,
                dropOff: formattedDropOff, 
                pickUp: formattedPickUp,
                note: this.state.note,
            })            
        })
        .then(response => {
            if (response.ok) {
                this.setState({ submissionMessage: `Drop in registration successful! Your drop off date/time is: ${formattedDropOff}. Your pick up date/time is: ${formattedPickUp}. See you then!` });
            } else {
                this.setState({ submissionMessage: 'Submission failed. Please try again.' });
            }
        })
        .catch(error => {
            this.setState({ submissionMessage: 'Submission failed. Please try again.' });
        });
    };      

    render() {
        const { isSidebarOpen } = this.state;
        const dynamicStyle = {
            left: isSidebarOpen ? '60px' : '0px',
            transition: '0.5s',/* Animated transition for sidebar */

        }

        const { dropOffTime, pickUpTime, submissionMessage } = this.state;
        const now = dayjs(); // Get the current date and time

        const disableWeekends = (date) => {
            return dayjs(date).day() === 0 || dayjs(date).day() === 6;
        };

        return (
            <div>

<button className="sidebar-toggle" style={dynamicStyle} onClick={this.toggleSidebar}>{isSidebarOpen ? <img src="/images/icons/close.png"></img> : <img src="/images/icons/sidebaropen.png"></img>}</button>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

            <div className='speech-button'>
                        <button id="speech-btn" onClick={this.readHighlightedText}>
                            <img id="speaker" src='/images/icons/speech.png'></img></button>


             </div>
             <div className="cancel-speech">
                <button id="cancel-btn" onClick={this.cancelSpeech}>
                <img id="pause" src='/images/icons/pause.png'></img></button>
                </div>
                
            </div>


            <div className="drop-in">
                <h1>Drop In Page</h1>
                <p>Please enter a drop-off and pick-up time if you would like to register for a drop-in day.</p>
                <form onSubmit={this.handleSubmit} className="datetime-form">
                    <div className="datetime-boxes">
                        <LocalizationProvider dateAdapter={AdapterDayjs} className="date-picker">
                            <DateTimePicker
                                label="Drop Off Time"
                                value={dayjs(dropOffTime)}
                                onChange={this.handleDropOffTimeChange}
                                shouldDisableDate={disableWeekends}
                                minDateTime={now} // Prevent selection of past dates and times
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs} className="date-picker">
                            <DateTimePicker
                                label="Pick Up Time"
                                value={dayjs(pickUpTime)}
                                onChange={this.handlePickUpTimeChange}
                                shouldDisableDate={disableWeekends}
                                minDateTime={now} // Prevent selection of past dates and times
                            />
                        </LocalizationProvider>
                    </div>
                    <br></br>
                    <input
                        type="text"
                        value={this.state.note}
                        onChange={this.handleInputChange}
                        id="dropinNote"
                        placeholder='Important details here... '
                    />                    
                    <br></br>
                    <button type="submit" className="button">Submit</button>  
                </form>
                {submissionMessage && <p>{submissionMessage}</p>}
            </div>
            </div>
        );
    }
}

export default DropIns;
