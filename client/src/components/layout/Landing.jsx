import React, { Component } from "react";
import { Link } from "react-router-dom";
import withAuth from "../authentication/withAuth";
import AuthUtils from "../authentication/AuthUtils";
const Auth = new AuthUtils();
class Landing extends Component {
  componentDidMount() {
    console.log(Auth.loggedIn());
  }

  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Build</b> a login/auth app with the{" "}
              <span style={{ fontFamily: "monospace" }}>MERN</span> stack from
              scratch
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Create a (minimal) full-stack app with user authentication via
              passport and JWTs
            </p>
            <br />

            {this.props.user ? <h1>{this.props.user}</h1> : null}
          </div>
        </div>
      </div>
    );
  }
}
export default withAuth(Landing);
