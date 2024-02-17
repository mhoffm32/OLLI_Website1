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
        const now = dayjs(); // Get the current date and time

        const disableWeekends = (date) => {
            return dayjs(date).day() === 0 || dayjs(date).day() === 6;
        };

        return (
            <div className="drop-in">
                <form onSubmit={this.handleSubmit}>
                    <h1>Drop In Page</h1>
                    <p>Please enter a drop-off and pick-up time if you would like to register for a drop-in day.</p>
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
                    <br></br>
                    <button type="submit" className="button">Submit</button>  
                </form>
                {submissionMessage && <p>{submissionMessage}</p>}
            </div>
        );
    }
}

export default DropIns;
