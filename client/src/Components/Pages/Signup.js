import React, { Component } from 'react';

class Signup extends Component {
    render() {
        return (
            <div>
                <button onClick={() => this.props.changePage('Home')} className='backBtn'>🡠</button>
                <img src="/images/OLLILOGO.png" alt="OLLI Logo" className='logo' />
                <h1>Signup Page</h1>
                {/* Add your signup page content here */}
            </div>
        );
    }
}

export default Signup;
