import React from 'react';
import './App.css';
import NavigationBar from './Components/NavigationBar';
import Home from './Components/Pages/Home';
import Contact from './Components/Pages/Contact';
import About from './Components/Pages/About';
import Events from './Components/Pages/Events';

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
    let page;
    switch (this.state.activeOption) {
      case 'Home':
        page = <Home />;
        break;
      case 'Contact':
        console.log("Displaying Contact page");
        page = <Contact />;
        break;
      case 'About':
        page = <About />;
        break;
      case 'Events':
        page = <Events />;
        break;
      default:
        page = <Home />;
  }

    return (
      <div className="App">
      <header className="App-header">
        <NavigationBar activeOption={this.state.activeOption} changePage={this.changePage} />
        {page}
      </header>
      </div>
    );
  }
}

export default App;