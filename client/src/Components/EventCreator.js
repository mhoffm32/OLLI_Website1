import React, { Component } from 'react';

class EventCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      eventDescription: '',
      eventDate: '',
      eventLocation: ''
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // Add your logic to create the event here
    console.log("Date: " + this.state.eventDate)
    fetch('/events/createEvent', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({title: this.state.eventName, description: this.state.eventDescription, date: this.state.eventDate, location: this.state.eventLocation})
        }).then(res => res.json())
        .then(data => {
            console.log('Event created: ' + data.message);
        })

    console.log('Event created:', this.state);
    // Reset the form fields
    this.setState({
      eventName: '',
      eventDate: '',
      eventLocation: '',
    eventDescription: ''
    });
  }

  render() {
    const { eventName, eventDate, eventLocation, eventDescription } = this.state;

    return (
      <div>
        <h2 className='createEventTitle'>Create Event</h2>
        <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="eventName"
              value={eventName}
              onChange={this.handleInputChange}
              className='eventCreatorBar'
              placeholder='Event Name'
            />
          <br />
            <input
              type="text"
              name="eventDescription"
              value={eventDescription}
              onChange={this.handleInputChange}
              className='eventCreatorBar'
              placeholder='Event Description'
            />
          <br />
            <input
              type="date"
              name="eventDate"
              value={eventDate}
              onChange={this.handleInputChange}
              className='eventCreatorBar'
            />
          <br />
            <input
              type="text"
              name="eventLocation"
              value={eventLocation}
              onChange={this.handleInputChange}
              className='eventCreatorBar'
              placeholder='Event Location'
            />
          <br />
          <button type="submit">Create</button>
        </form>
      </div>
    );
  }
}

export default EventCreator;
