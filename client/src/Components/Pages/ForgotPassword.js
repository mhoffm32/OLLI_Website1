import React, { Component } from 'react';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  handleChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.state.email)){
        alert("Please enter a valid email");
        return;
    } else {
        fetch(`http://localhost:3002/user/forgotPassword`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: this.state.email}),
        })
        .then(res => res.json()
        .then(data => {
          if(res.status !== 200){
            console.log(res.status)
          }
          else {
            console.log(data)
          }
        }))
    }
  };

  render() {
    const { email } = this.state;

    return (
      <div>
        <button onClick={() => this.props.changePage('Home')} className='backBtn'><img src="/images/BackArrow.png" alt="Back" className='backArrowImg' /></button>
        <img src="/images/OLLILOGO.png" alt="OLLI Logo" className='logo' />
        <h1>Forgot Password</h1>
        <form onSubmit={this.handleSubmit}>
        <input
            type="text"
            name="email"
            value={email}
            onChange={this.handleInputChange}
            className='usernameBar'
            placeholder="Email..."
        />
        <br />
          <button type="submit" className='loginBtn'>Reset Password</button>
        </form>
      </div>
    );
  }
}

export default ForgotPassword;
