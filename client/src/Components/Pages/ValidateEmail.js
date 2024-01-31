import React from 'react';

class ValidateEmail extends React.Component {
    render() {
        return (
            <div>
                <button onClick={() => this.props.changePage('Home')} className='backBtn'>🡠</button>
                <h1>Validate Email</h1>
                <p>Please check your email and click on the validation link.</p>
                <button onClick={() => this.props.changePage('Login')} className='loginBtn'>Go to Login</button>
            </div>
        );
    }
}

export default ValidateEmail;
