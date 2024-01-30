import React from 'react';
import './App.css';
import NavigationBar from './Components/NavigationBar';
import Home from './Components/Pages/Home';
import Contact from './Components/Pages/Contact';
import About from './Components/Pages/About';
import Events from './Components/Pages/Events';
import News from './Components/Pages/News';
import Fundraising from './Components/Pages/Fundraising';
import Login from './Components/Pages/Login';
import Signup from './Components/Pages/Signup';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOption: 'Home'
    };
  }

  changePage = (str) => {
    this.setState({
      activeOption: str
    });
  }

  render() {
    let page;
    switch (this.state.activeOption) {
      case 'Home':
        page = <Home changePage={this.changePage}/>;
        break;
      case 'Contact':
        page = <Contact />;
        break;
      case 'About':
        page = <About />;
        break;
      case 'Events':
        page = <Events />;
        break;
      case 'Fundraising':
        page = <Fundraising />;
        break;
      case 'News':
        page = <News />;
        break;
      case 'Login':
        page = <Login changePage={this.changePage}/>;
        break;
      case 'Sign Up':
        page = <Signup changePage={this.changePage}/>;
        break;
      default:
        page = <Home changePage={this.changePage}/>;
  }

    return (
      <div className="App">
      <header className="App-header">
        {this.state.activeOption !== 'Login' && this.state.activeOption !== 'Sign Up' && 
          <NavigationBar activeOption={this.state.activeOption} changePage={this.changePage} />
        }
        {page}
      </header>
      </div>
    );
  }
}

export default App;