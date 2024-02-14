import React, { Component } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

class DropIns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropOffTime: new Date(),
            pickUpTime: new Date()
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

        fetch(`http://localhost:3002/api/dropins/`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                dropOffTime: dropOffTime.toISOString(), 
                pickUpTime: pickUpTime.toISOString(),
            })
        })
        .then(response => {

        })
        .catch(error => {

        });
    };

    render() {
        const { dropOffTime, pickUpTime } = this.state;

        return (
            <div className="drop-in">
                <form onSubmit={this.handleSubmit}>
                    <h1>Drop In Page</h1>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Drop Off Time"
                            value={dayjs(dropOffTime)}
                            onChange={this.handleDropOffTimeChange}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Pick Up Time"
                            value={dayjs(pickUpTime)}
                            onChange={this.handlePickUpTimeChange}
                        />
                    </LocalizationProvider>

                    <button type="submit" className="button">Submit</button>  
                </form>
            </div>
        );
    }
}

export default DropIns;
