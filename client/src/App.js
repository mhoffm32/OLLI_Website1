import React from 'react';
import './App.css';
import NavigationBar from './NavigationBar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOption: 'Home'
    };
  }

  changePage = (evt) => {
    this.setState({
      activeOption: evt.target.innerText
    });
  }

  render() {
    return (
      <div className="App">
      <header className="App-header">
        <NavigationBar activeOption={this.state.activeOption} changePage={this.changePage} />
      </header>
      </div>
    );
  }
}

export default App;