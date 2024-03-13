import React, { Component } from 'react';

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
          events: [],
          expandedEventId: null
        };
        this.getEvents();
      }

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
                <button onClick={() => this.getEvents()}>Get Events</button>
                {this.state.events.map((event, index) => (
                    <div className='eventBox'>
                        <h2>{event.title}</h2>
                        <p>{event.location}</p>
                        <p>{new Date(event.date).toLocaleString()}</p>
                        <button onClick={() => this.setState({ expandedEventId: this.state.expandedEventId === event._id ? null : event._id })}>
                            {this.state.expandedEventId === event._id ? 'Hide Details' : 'Show Details'}
                        </button>
                        {this.state.expandedEventId === event._id && (
                            <div>
                                <p>{event.description}</p>
                                <button>Sign Up</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }
}

export default Events;
