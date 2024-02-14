import React, { Component } from 'react';

class Events extends Component {

    getEvents = () => {
        fetch('/events/getAllEvents', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(events => this.setState({ events }))
    }

    render() {
        
        return (
            <div className="events">
                <h1>Come Join our Events</h1>
                <button onClick={() => this.props.changePage('EventCreator')}>Create Event</button>
            </div>
        );
    }
}

export default Events;
