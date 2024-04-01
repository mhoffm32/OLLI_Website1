import React, { Component } from 'react';
import { jwtDecode } from 'jwt-decode';
import { get } from 'mongoose';

class TimeSystem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: '',
            timeBlocks: [],
        };
        this.getTimeBlocks();
    }

    handleInputChange = (event) => {
        this.setState({ note: event.target.value });
    }

    handleClockIn = () => {
        // Perform clock in logic here
        fetch('/clock-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt') // Add token to headers
            },
            body: JSON.stringify({ description: this.state.note }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    handleClockOut = () => {
        fetch('/clock-out', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt') // Add token to headers
            },
            body: JSON.stringify({ description: this.state.note }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    getTimeBlocks = () => {
        const token = localStorage.getItem('jwt');
        const userType = jwtDecode(token).type;
        const userId = jwtDecode(token).id;
    
        let url = '';
        if (userType === 'admin') {
          url = '/timeblocks/unapproved';
        } else if (userType === 'employee') {
          url = `/timeblocks/user/${userId}`;
        }

        console.log('Fetching time blocks' + url);
    
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            this.setState({ timeBlocks: data });
        })
      }

    render() {
        const { isClockedIn, timeBlocks } = this.state;

        return (
            <div>
                <h1>Time System</h1>
                <input
                    type="text"
                    value={this.state.note}
                    onChange={this.handleInputChange}
                    placeholder='Note'
                />
                <button onClick={this.handleClockOut}>Clock Out</button>
                <button onClick={this.handleClockIn}>Clock In</button>

                {timeBlocks.map((timeBlock, index) => (
                    <div key={index}>
                        <p>Start Time: {new Date(timeBlock.startTime).toLocaleString()}</p>
                        <p>End Time: {timeBlock.endTime ? new Date(timeBlock.endTime).toLocaleString() : 'N/A'}</p>
                        <p>Description: {timeBlock.description}</p>
                        <p>Approved: {timeBlock.approved ? 'Yes' : 'No'}</p>
                    </div>
                ))}
            </div>
        );
    }
}

export default TimeSystem;