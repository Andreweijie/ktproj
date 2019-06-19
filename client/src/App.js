import React, { Component } from "react";
import decode from "jwt-decode";
import { Route, withRouter } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import NavBar from "./components/layout/NavBar";
import Enquiry from "./components/Enquiry";
import Reset from "./components/authentication/Reset";
import ChangePassword from "./components/authentication/ChangePassword";
import "./App.css";
import AuthUtils from "./components/authentication/AuthUtils";

const Auth = new AuthUtils();
let status = Auth.loggedIn();

class App extends Component {
  constructor() {
    super();

    this.handleStatus = this.handleStatus.bind(this);
  }
  state = {
    loggedIn: status
  };

  handleStatus = trueOrFalse => {
    console.log("changing");
    this.setState(
      {
        loggedIn: trueOrFalse
      },
      () => {
        console.log("changed");
      }
    );
  };

  componentDidMount() {
    localStorage.removeItem("id_token");
    //console.log(decode(localStorage.getItem("id_token")));
  }
  render() {
    return (
      <div className="App">
        <NavBar status={this.state.loggedIn} logout={() => Auth.logout()} />
        <Route exact path="/enquire" component={Enquiry} />
        <Route exact path="/" component={Landing} />
        <Route exact path="/register" component={Register} />
        <Route
          exact
          path="/login"
          render={props => (
            <Login {...props} handleStatus={this.handleStatus} />
          )}
        />
        <Route exact path="/reset" component={Reset} />
        <Route exact path="/change-password" component={ChangePassword} />
      </div>
    );
  }
}

export default App;
