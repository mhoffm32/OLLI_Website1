import React, { Component } from 'react';
function speak() {  
  // Create a SpeechSynthesisUtterance object

  let text = "Here you can create events"

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Speak the text
  window.speechSynthesis.speak(utterance);
}
class EventCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      eventDescription: '',
      eventDate: '',
      eventLocation: '',
      includeWaiver: false,
      waiverSections: []
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleCheckboxChange = (event) => {
    this.setState({ includeWaiver: event.target.checked });
  }

  handleAddWaiverSection = () => {
    this.setState(prevState => ({
      waiverSections: [...prevState.waiverSections, { header: '', content: '' }]
    }));
  }

  handleRemoveWaiverSection = (index) => {
    this.setState(prevState => ({
      waiverSections: prevState.waiverSections.filter((_, i) => i !== index)
    }));
  }

  handleWaiverInputChange = (index, field, value) => {
    this.setState(prevState => {
      const newWaiverSections = [...prevState.waiverSections];
      newWaiverSections[index][field] = value;
      return { waiverSections: newWaiverSections };
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // Add your logic to create the event here
    console.log("Waiver Sections: " + this.state.waiverSections[0].header + " " + this.state.waiverSections[0].content);
    fetch('/events/createEvent', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({title: this.state.eventName, description: this.state.eventDescription, date: this.state.eventDate, location: this.state.eventLocation, waiver: this.state.waiverSections})
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
    speak();
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
          <input
          type="checkbox"
          name="includeWaiver"
          className='includeWaiverCheckbox'
          checked={this.state.includeWaiver}
          onChange={this.handleCheckboxChange}
          />
          <label htmlFor="includeWaiver">Include Waiver</label>
          <br />

          {this.state.includeWaiver && (
          <div>
            {this.state.waiverSections.map((section, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={section.header}
                  onChange={e => this.handleWaiverInputChange(index, 'header', e.target.value)}
                  className='eventCreatorBar'
                  placeholder='Waiver Header'
                />
                <textarea
                  value={section.content}
                  onChange={e => this.handleWaiverInputChange(index, 'content', e.target.value)}
                  className='eventCreatorBar'
                  placeholder='Waiver Content'
                />
                <button type="button" onClick={() => this.handleRemoveWaiverSection(index)}>Remove</button>
                <br />
              </div>
            ))}
            <button type="button" onClick={this.handleAddWaiverSection}>Add Waiver Section</button>
          </div>
        )}

          <button type="submit">Create</button>
        </form>
      </div>
    );
  }
}

export default EventCreator;
