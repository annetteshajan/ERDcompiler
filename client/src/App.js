import React, { Component } from "react";
import { useState } from "react";
import CustomDiagram from "./CustomDiagram";
import "./App.css";
import { config, customEntities } from "./CustomDiagram/config-example";
import MainPage from "./CustomDiagram/mainpage";
import model from "./CustomDiagram/model-example";
import { Diagram, setConfig, diagramOn } from "react-flow-diagram";
import { store as diagramStore, setEntities } from "react-flow-diagram";
import PopUp from "./popup";
import { Redirect } from "react-router-dom";
import type { EntityState } from "../src/entity/reducer";
import ReactDOM from "react-dom";
import "./vendor/bootstrap/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import ScriptTag from "react-script-tag";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./script.js";
import socketIOClient from "socket.io-client";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      entities: [],
      seen: false,
      filename: "",
      submit: false,
      allFiles: [],
      model: [],
      response: false,
      endpoint: "http://localhost:4000/socket.io/socket.io.",
    };
  }
  toggleSubmit = () => {
    this.setState({
      submit: !this.state.submit,
    });
  };
  togglePop = () => {
    this.setState({
      seen: !this.state.seen,
    });
  };
  gotoDraw = () => {
    return <Redirect to="/draw" />;
  };
  callback = (filename) => {
    this.setState({ filename });
    console.log("callback");
    console.log(filename);
    this.gotoDraw();
  };

  // settingstate = () => {
  //   this.setState((data["val"]: 0));
  // };
  callBackendAPI = async () => {
    console.log(this.state.entities);
    const response = await fetch("/express_backend", {
      method: "POST",
      body: JSON.stringify([this.state.entities, this.state.filename]),
      headers: { "Content-Type": "application/json" },
    });
    const body = await response.json().catch((err) => console.log(err));
    console.log(body);
    this.setState({ data: body });
    // this.setState({ allFiles: body[1] });
    console.log("allfiles:" + this.state.allFiles);
    // if (res.ok) {
    //   // this.state.data = res.json();
    //   return res.json();
    // } else {
    //   throw new Error("Something went wrong with your fetch");
    // }

    // return response.json();
  };
  // axios
  //   .post("http://localhost:9000/testAPI", this.state.entities)
  //   .then(res => res.text())
  //   .then(res => this.setState({ apiResponse: res }));

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    // socket.on("chat-message", (data) => {
    //   console.log(data);
    // });
    // socket.on("FROMAPI", (data) => this.setState({ response: data }));
    this.fetchdata();
    this.callBackendAPI().catch((err) => console.log(err));
    diagramOn("anyChange", (entityState) => {
      // You can get the model back
      // after modifying the UI representation
      this.setState({ entities: entityState });
    });
  }

  createTable = (tablename) => {
    let table = [];
    let children = [];
    // Outer loop to create parent
    for (let i = 0; i < this.state.data[2][tablename].length; i++) {
      children.push(<td>{this.state.data[2][tablename][i]}</td>);
    }
    //Create the parent and add the children
    table.push(<tr>{children}</tr>);
    return table;
  };

  renderTables = () => {
    let tables = {};
    for (var i in this.state.data[2]) {
      tables[i] = <table>{this.createTable(i)}</table>;
    }
    let k = [];
    let final = [];
    for (var i in tables) {
      k.push(
        <div>
          <h5>
            <b>{i}</b>
          </h5>
          {tables[i]}
        </div>
      );
    }
    final.push(<div>{k}</div>);
    console.info(final);
    return final;
  };
  renderButton = () => {
    return (
      <div>
        <textarea
          type="text"
          name="query"
          value={this.state.data[0]}
          maxLength
        />
      </div>
    );
  };

  changeModel = (i) => {
    var k = [];
    for (var j in this.state.allFiles[i]["entitylist"]) {
      k.push(JSON.stringify(this.state.allFiles[i]["entitylist"][j]));
    }
    console.log("change model");
    console.log(this.state.allFiles[i]["entitylist"]);
    console.log(k);
    this.setState({ model: k });
    this.setState({ filename: this.state.allFiles[i]["filename"] });
    // this.state.model = ["one", "two"];
    console.log(this.state.model);
    // return <Redirect to="/draw"></Redirect>;
  };
  renderCards = () => {
    let cards = [];
    let card = [];
    let finalcards = [];
    console.log("files:" + this.state.allFiles);

    for (let i = 0; i < this.state.allFiles.length; i++) {
      cards.push(
        <div class="card mb-4">
          <div class="card-body">
            <h2 class="card-title">{this.state.allFiles[i]["filename"]}</h2>
            <button>
              {/* {(this.state.model = this.state.allFiles[i]["entitylist"])} */}
              {/* {(this.state.submit = true)} */}
              <Link to="/draw" onClick={() => this.changeModel(i)}>
                View{" "}
              </Link>
            </button>
          </div>
          <div class="card-footer text-muted">
            Posted on {this.state.allFiles[i]["time"]},
            {this.state.allFiles[i]["date"]}
          </div>
        </div>
      );
    }

    // for (let i = 0; i < card.length / 3; i++) {
    //   cards = [];
    //   for (let j = 0; j < 3; j++) {
    //     cards.push(<div>{card[i + j]}</div>);
    //   }
    //   finalcards.push(<div class="row">cards</div>);
    // }
    return cards;
  };

  fetchdata = () => {
    fetch("http://localhost:3000/express_backend")
      .then((res) => res.json())
      .then((res) => this.setState({ allFiles: res }));
  };

  renderChatbot = () => {
    let [showChat, setShowChat] = useState(false);

    const startChat = () => {
      setShowChat(true);
    };
    const hideChat = () => {
      setShowChat(false);
    };
    // ReactDOM.render(<Root />, document.getElementById("root"));

    // if (module.hot) {
    //   module.hot.accept("./client/Root", () => {
    //     // eslint-disable-next-line
    //     const NextRoot = require("./client/Root").default;
    //     ReactDOM.render(<NextRoot />, document.getElementById("root"));
    //   });
    // }

    return (
      <div>
        <div className="bot">
          <div style={{ display: showChat ? "" : "none" }}>
            <div id="message-container"></div>
            <form id="send-container">
              <input
                type="text"
                id="message-input"
                placeholder="type something"
              />
              <br />
              <button type="submit" id="send-button">
                Send
              </button>
            </form>
          </div>
          {/* <div> {showChat ? <SimpleForm></SimpleForm> : null} </div> */}
          <div>
            {!showChat ? (
              <button className="btn1" onClick={() => startChat()}>
                CLICK TO CHAT{" "}
              </button>
            ) : (
              <button className="btn1" onClick={() => hideChat()}>
                CLICK TO HIDE{" "}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  renderApp = () => {
    return (
      <div class="container">
        <div class="row">
          <div class="col-md-32">
            <h1 class="my-4">Your saved files</h1>

            <div
              class="btn btn-secondary"
              onClick={this.togglePop}
              // onClick={(this.state.submit = true)}
            >
              New
            </div>
            <br />
            <br></br>
            <div class="grid-container">
              <this.renderCards />
            </div>
            <this.renderChatbot />
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Router>
        <div>
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div class="container">
              <a class="navbar-brand" href="/main">
                ER DIAGRAM EDITOR
              </a>
              <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarResponsive"
                aria-controls="navbarResponsive"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <Redirect to="/main" />
              {/* <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto">
                  <li class="nav-item active">
                    <a class="nav-link" href="#">
                      <Link to="/main" onClick={this.toggleSubmit}>
                        Home
                      </Link>
                      <span class="sr-only">(current)</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">
                      <Link to="/draw">New</Link>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">
                      How it works
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">
                      Login
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>
          </nav>
          <div></div> <br />
          <br></br>
          <main>
            <Route path="/main">
              <div>
                {console.log("submit:" + this.state.submit)}
                {/* <div className="btn" onClick={this.togglePop}>
                  <button>+</button>
                </div> */}
                {/* {console.log(this.state.seen)} */}
                {this.state.seen ? (
                  <PopUp
                    toggle={this.togglePop}
                    // myChangeHandler={this.myChangeHandler.bind(this)}
                    callbackFromParent={this.callback}
                    gotoDraw={this.gotoDraw}
                    toggleSubmit={this.toggleSubmit}
                  />
                ) : null}

                {/* {console.log(this.state.submit)} */}
              </div>
              {this.state.submit ? (
                // <MainPage
                //   callBackendAPI={this.callBackendAPI.bind(this)}
                //   data={this.state.data}
                //   renderButton={this.renderButton.bind(this)}
                //   renderTables={this.renderTables.bind(this)}
                //   // settingstate={this.settingState.bind(this)}
                // />
                <Redirect to="/draw" />
              ) : (
                <this.renderApp></this.renderApp>
              )}
            </Route>

            <Route path="/draw">
              <MainPage
                callBackendAPI={this.callBackendAPI.bind(this)}
                data={this.state.data}
                renderButton={this.renderButton.bind(this)}
                renderTables={this.renderTables.bind(this)}
                model={this.state.model}
                // settingstate={this.settingState.bind(this)}
              />
            </Route>
          </main>
        </div>
      </Router>
    );
  }
  MainPage = () => {
    return <MainPage />;
  };
}

export default App;
