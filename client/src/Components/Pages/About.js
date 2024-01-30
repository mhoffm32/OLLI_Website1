import React from "react";

class About extends React.Component {
  render() {
    const address = "info@rockglen.com";
    return (
      <div>
        <h1>About Us</h1>
        <p>OLLI's clubhouse is located at Rock Glen Family Resort (8685 Rock Glen Road, Arkona, ON N0M 1B0). </p>
        <p>To contact the venue, please call 1-800-265-7597 (Toll Free) or 519-828-3456 (Local) or email <a href={`mailto:${address}`}>{address}</a></p>

        <h2> HOURS </h2>
        <p>Monday: 8AM - 7PM</p>
        <p>Tuesday: 8AM - 7PM</p>
        <p>Wednesday: 8AM - 7PM</p>
        <p>Thursday: 8AM - 7PM</p>
        <p>Friday: 8AM - 6PM</p>
        <p>Saturday: 9AM - 4PM</p>
        <p>Sunday: 9AM - 4PM</p>

      </div>
    );
  }
}

export default About;
