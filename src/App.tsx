import React from 'react'
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { Episode } from "./tvmaze/types";
import { StepOne } from "./step-one/step-one";
import { StepTwo } from "./step-two/step-two";

import './App.css';

interface AppProps {}

interface AppState {
  activeKey: string;
  episode?: Episode;
  nextEpisode?: Episode;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      activeKey: "step-one"
    };
  }

  render() {
    return (
      <Tabs id="app" activeKey={this.state.activeKey} onSelect={(activeKey: string) => this.setState({activeKey})}>
        <Tab eventKey="step-one" title="Episode Picker">
          <StepOne
            onEpisodeChange={(episode, nextEpisode) => this.setState({episode, nextEpisode})}
            episode={this.state.episode}
            onNextClick={() => this.setState({activeKey: "step-two"})}
          />
        </Tab>
        <Tab eventKey="step-two" title="Wikipedia" disabled={!this.state.episode}>
          {this.state.episode && <StepTwo episode={this.state.episode} nextEpisode={this.state.nextEpisode} />}
        </Tab>
      </Tabs>
    );
  }
}

export default App;
