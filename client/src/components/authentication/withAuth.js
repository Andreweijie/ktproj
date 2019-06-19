import React, { Component } from "react";
import decode from "jwt-decode";
import AuthUtils from "./AuthUtils";

export default function withAuth(AuthComponent) {
  const Auth = new AuthUtils("http://localhost:5000");
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
        user: null
      };
    }
    componentDidMount() {
      console.log("hi");
      if (!Auth.loggedIn()) {
        this.props.history.replace("/login");
      } else {
        try {
          const profile = Auth.getProfile();
          console.log(decode(Auth.getToken()));
          this.setState({ user: profile }, () => {
            this.props.history.replace("/");
          });
        } catch (err) {
          Auth.logout();
          this.props.history.replace("/login");
        }
      }
    }
    render() {
      if (this.state.user) {
        return (
          <AuthComponent history={this.props.history} user={this.state.user} />
        );
      } else {
        return null;
      }
    }
  };
}
