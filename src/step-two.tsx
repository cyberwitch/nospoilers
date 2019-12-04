import Alert from "react-bootstrap/Alert";
import Jumbotron from "react-bootstrap/Jumbotron";
import React from "react";

import { Episode } from "./types";

interface StepTwoProps {
  episode: Episode;
}

export class StepTwo extends React.Component<StepTwoProps> {
  render() {
    return (
      <Jumbotron>
        <Alert variant="primary">
          You can browse Wikipedia below without any risk of spoilers beyond episode "{this.props.episode.name}".
        </Alert>
      </Jumbotron>
    );
  }
}
