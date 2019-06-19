import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import AuthUtils from "../authentication/AuthUtils";
import AccMenu from "../AccMenu";

class NavBar extends Component {
  render() {
    let { pathname } = this.props.location;
    return (
      <div className="nav-bar">
        {this.props.status ? (
          <div>
            <Link
              to="/enquire"
              style={{
                marginLeft: "2rem",
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large waves-effect white hoverable black-text"
            >
              ENQUIRE
            </Link>
            <Link
              to="/dashboard"
              style={{
                marginLeft: "2rem",
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large waves-effect white hoverable black-text"
            >
              DASHBOARD
            </Link>
            <AccMenu logout={this.props.logout} />
          </div>
        ) : pathname != "/login" ? (
          <div>
            {" "}
            <Link
              to="/enquire"
              style={{
                marginLeft: "2rem",
                marginRight: "2rem",
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large waves-effect white hoverable black-text"
            >
              ENQUIRE
            </Link>
            <Link
              to="/login"
              style={{
                marginLeft: "2rem",
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large waves-effect white hoverable black-text"
            >
              Log In
            </Link>
          </div>
        ) : (
          <div>
            <Link
              to="/enquire"
              style={{
                marginLeft: "2rem",
                marginRight: "2rem",
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large waves-effect white hoverable black-text"
            >
              ENQUIRE
            </Link>
            <Link
              to="/register"
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(NavBar);
