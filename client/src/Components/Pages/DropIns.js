import React, { Component } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

class DropIns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropOffTime: new Date(),
            pickUpTime: new Date(),
            submissionMessage: '' // Add a state property for the submission message
        };
    }

    handleDropOffTimeChange = (date) => {
        this.setState({ dropOffTime: date });
    };

    handlePickUpTimeChange = (date) => {
        this.setState({ pickUpTime: date });
    };

    handleSubmit = (event) => { 
        event.preventDefault();
        const { dropOffTime, pickUpTime } = this.state;
    
        const formattedDropOff = dayjs(dropOffTime).format('YYYY-MM-DD hh:mm A');
        const formattedPickUp = dayjs(pickUpTime).format('YYYY-MM-DD hh:mm A');
    
        fetch(`http://localhost:3002/dropins/`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                dropOff: formattedDropOff, 
                pickUp: formattedPickUp,
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
        const { dropOffTime, pickUpTime, submissionMessage } = this.state;

        return (
            <div className="drop-in">
                <form onSubmit={this.handleSubmit}>
                    <h1>Drop In Page</h1>
                    <LocalizationProvider dateAdapter={AdapterDayjs} className="date-picker">
                        <DateTimePicker
                            label="Drop Off Time"
                            value={dayjs(dropOffTime)}
                            onChange={this.handleDropOffTimeChange}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs} className="date-picker">
                        <DateTimePicker
                            label="Pick Up Time"
                            value={dayjs(pickUpTime)}
                            onChange={this.handlePickUpTimeChange}
                        />
                    </LocalizationProvider>
                    <br></br>
                    <button type="submit" className="button">Submit</button>  
                </form>
                {/* Display the submission message */}
                {submissionMessage && <p>{submissionMessage}</p>}
            </div>
        );
    }
}

export default DropIns;
