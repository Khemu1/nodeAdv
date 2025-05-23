import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
const googleAuthUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/auth/google"
    : "/auth/google";
const googleAuthLogoutUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/auth/logout"
    : "/auth/logout";
class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href={`${googleAuthUrl}`}>Login With Google</a>
          </li>
        );
      default:
        return [
          <li key="3" style={{ margin: "0 10px" }}>
            <Link to="/blogs">My Blogs</Link>
          </li>,
          <li key="2">
            <a href={`${googleAuthLogoutUrl}`}>Logout</a>
          </li>,
        ];
    }
  }

  render() {
    return (
      <nav className="indigo">
        <div className="nav-wrapper">
          <Link
            to={this.props.auth ? "/blogs" : "/"}
            className="left brand-logo"
            style={{ marginLeft: "10px" }}
          >
            Blogster
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
