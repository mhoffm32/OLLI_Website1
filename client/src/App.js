import React from "react";
import "./App.css";
import NavigationBar from "./Components/NavigationBar";
import Home from "./Components/Pages/Home";
import Contact from "./Components/Pages/Contact";
import About from "./Components/Pages/About";
import Events from "./Components/Pages/Events";
import News from "./Components/Pages/News";
import Fundraising from "./Components/Pages/Fundraising";
import Login from "./Components/Pages/Login";
import Signup from "./Components/Pages/Signup";
import Verification from "./Components/Pages/Verification";
import DropIns from "./Components/Pages/DropIns";
import ValidateEmail from "./Components/Pages/ValidateEmail";
import AdminTools from "./Components/Pages/admin/AdminTools";
import UserSettings from "./Components/Pages/UserSettings";
import ForgotPassword from "./Components/Pages/ForgotPassword";
import EventCreator from "./Components/EventCreator";
import ChatHome from "./Components/Pages/ChatHome";
import PhotoGallery from "./Components/Pages/PhotoGallery";
import TimeSystem from "./Components/Pages/TimeSystem";
import UploadLetter from "./Components/Pages/admin/UploadLetter";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOption: "Home",
      signUpOption: "",
    };
  }

  changePage = (str) => {
    this.setState({
      activeOption: str,
    });
  };

  changeSignUpOption = (str) => {
    this.setState({
      signUpOption: str,
    });
  };

  render() {
    let page;
    switch (this.state.activeOption) {
      case "Home":
        page = <Home changePage={this.changePage} />;
        break;
      case "Contact":
        page = <Contact />;
        break;
      case "About":
        page = <About />;
        break;
      case "Events":
        page = (
          <Events
            changePage={this.changePage}
            changeSignUpOption={this.changeSignUpOption}
          />
        );
        break;
      case "Fundraising":
        page = <Fundraising />;
        break;
      case "News":
        page = <News />;
        break;
      case "Drop Ins":
        page = <DropIns />;
        break;
      case "Verification":
        page = <Verification />;
        break;
      case "AdminTools":
        page = <AdminTools changePage={this.changePage} />;
        break;
      case "Photo Gallery":
        page = <PhotoGallery changePage={this.changePage} />;
        break;
      case "UserSettings":
        page = <UserSettings changePage={this.changePage} />;
        break;
      case "ChatHome":
        page = <ChatHome changePage={this.changePage} />;
        break;
      case "Login":
        page = <Login changePage={this.changePage} />;
        break;
      case "Sign Up":
        page = <Signup changePage={this.changePage} />;
        break;
      case "Contact":
        page = <Contact />;
        break;
      case "ValidateEmail":
        page = <ValidateEmail changePage={this.changePage} />;
        break;
      case "ForgotPassword":
        page = <ForgotPassword changePage={this.changePage} />;
        break;
      case "EventCreator":
        page = <EventCreator changePage={this.changePage} />;
        break;
      case "TimeSystem":
        page = <TimeSystem changePage={this.changePage} />;
        break;
      default:
        page = <Home changePage={this.changePage} />;
    }

    return (
      <div className="App">
        <header className="App-header">
          {this.state.activeOption !== "Login" &&
            this.state.activeOption !== "Sign Up" &&
            this.state.activeOption !== "ValidateEmail" &&
            this.state.activeOption !== "ForgotPassword" && (
              <NavigationBar
                activeOption={this.state.activeOption}
                changePage={this.changePage}
              />
            )}
          {page}
        </header>
      </div>
    );
  }
}

export default App;
