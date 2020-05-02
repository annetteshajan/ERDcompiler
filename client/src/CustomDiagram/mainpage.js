import { render } from "react-dom";
import React, { Component } from "react";
import CustomDiagram from "./";
import "../App.css";
import { config, customEntities } from "./config-example";
import model from "./model-example";
import { Diagram, setConfig, diagramOn } from "react-flow-diagram";
import { store as diagramStore, setEntities } from "react-flow-diagram";
import "../vendor/bootstrap/css/bootstrap.min.css";
import App from "../App";
import type { EntityState } from "../src/entity/reducer";

// import { callBackendAPI, renderButton, renderTables, data } from "../App";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
class MainPage extends Component {
  // state = {k};
  constructor(props) {
    super(props);
    console.log("here");

    // this.props.settingstate();
  }

  // renderObj = () => {
  //   {
  //     Object.keys(model1).map((obj) => {
  //       diagramStore.dispatch(setEntities(model1[obj]));
  //     });
  //   }
  // };
  componentDidMount() {
    var k = [];
    // console.log(JSON.parse(this.props.model));
    for (var i in this.props.model) {
      console.log(JSON.parse(this.props.model[i]));
      k.push(JSON.parse(this.props.model[i]));
    }
    const model1: EntityState = k;
    diagramStore.dispatch(setEntities(model1));
  }
  // renderModel = () => {
  //   diagramStore.dispatch(setEntities(model1));
  // };
  render() {
    // var k = this.props.data;
    // const model1: EntityState = this.props.model1;
    // var k = [];
    // // console.log(JSON.parse(this.props.model));
    // for (var i in this.props.model) {
    //   console.log(JSON.parse(this.props.model[i]));
    //   k.push(JSON.parse(this.props.model[i]));
    // }
    // const model1: EntityState = k;
    // console.log(model1);
    return (
      // console.log(props);

      <div class="App">
        <header class="App-header">
          <br></br>

          <h1 class="App-title">Create your own ER diagram!</h1>
        </header>

        <main class="main">
          <CustomDiagram />
          {/* {console.log("model:" + this.props.model1)} */}
          {/* <this.renderObj /> */}
          {/* {diagramStore.dispatch(setEntities(model1))} */}
          {/* {this.renderModel} */}

          <span>
            <button
              class="button"
              onClick={() => {
                this.props.callBackendAPI();
              }}
            >
              Save
            </button>
            <button
              class="button red"
              onClick={() => diagramStore.dispatch(setEntities(model))}
            >
              Clear
            </button>
          </span>
          {this.props.data[1] === 0 ? this.props.data[0] : null}

          <div className="container1">
            <div className="left">
              {this.props.data[1] === 1 ? this.props.renderButton() : null}
            </div>
            <div className="right">{this.props.renderTables()}</div>
          </div>
        </main>
      </div>
    );
  }
}

export default MainPage;
