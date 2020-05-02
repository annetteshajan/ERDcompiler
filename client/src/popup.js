import React, { Component } from "react";
import css from "./App.css";
import { Redirect } from "react-router-dom";

export default class PopUp extends Component {
  constructor(props) {
    super(props);
    this.state = { filename: "" };
  }
  handleClick = () => {
    this.props.toggle();
  };
  handleChange = (event) => {
    console.log("here");
    const filename = event.target.value;
    this.setState({ filename });
    console.log(this.state.filename);
  };
  handleFormSubmit = (event) => {
    console.log(this.state.filename);
    if (this.state.filename === "") {
      alert("Enter valid filename");
      event.preventDefault();
      return;
    }

    event.preventDefault();

    this.props.toggleSubmit();

    this.props.toggle();

    this.props.callbackFromParent(this.state.filename);
    // this.props.gotoDraw();
  };

  render() {
    const modal = {
      position: "fixed",
      zIndex: "1",
      width: "100%",
      height: "100%",
      "background-color": "white",
    };
    const modal_content = {
      background: "white",
      position: "absolute",
      color: "black",
      top: "20%",
      left: "30%",
      width: "30%",
      padding: "20px",
      borderRadius: "5px",
      border: "2px solid black",
    };
    return (
      <div style={modal}>
        <div style={modal_content}>
          {console.log("inside")}
          <span class="close" onClick={this.handleClick}>
            &times;
          </span>
          <form onSubmit={this.handleFormSubmit}>
            <h3>Enter new file name</h3>
            <label>
              <input
                type="text"
                name="file"
                id="file"
                value={this.state.filename}
                onChange={this.handleChange}
                // onChange={(event) => this.handleChange(event)}
              />
            </label>
            <br />
            {/* {console.log(event.target.name + "here")} */}
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    );
  }
}
