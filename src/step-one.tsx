import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import React from 'react'

import { Episode, Season, Show } from "./types";
import { EpisodePicker } from "./episode-picker";
import { SeasonPicker } from "./season-picker";
import { ShowPicker } from "./show-picker";

interface StepOneProps {
  onEpisodeChange: (episode?: Episode) => void;
  onNextClick: () => void;
  episode?: Episode;
}

interface StepOneState {
  season?: Season;
  show?: Show;
}

export class StepOne extends React.Component<StepOneProps, StepOneState> {
  state: StepOneState = {};

  render() {
    return (
        <Jumbotron>
          <Form>
            <Form.Group>
              <Form.Label>Search for the show you are watching:</Form.Label>
              <ShowPicker
                onChange={show => {
                  this.setState({show, season: undefined});
                  this.props.onEpisodeChange();
                }}
                selected={this.state.show}
              />
            </Form.Group>
            {this.renderSeasonPicker()}
            {this.renderEpisodePicker()}
            {this.renderNextButton()}
          </Form>
        </Jumbotron>
    );
  }

  renderSeasonPicker() {
    if (this.state.show) {
      return (
        <Form.Group>
          <Form.Label>Search for the season you are watching:</Form.Label>
          <SeasonPicker
            onChange={season => {
              this.setState({season});
              this.props.onEpisodeChange();
            }}
            selected={this.state.season}
            show={this.state.show}
          />
        </Form.Group>
      );
    }
  }

  renderEpisodePicker() {
    if (this.state.show) {
      return (
        <Form.Group>
          <Form.Label>Search for the last episode you've seen:</Form.Label>
          <EpisodePicker
            onChange={episode => this.props.onEpisodeChange(episode)}
            season={this.state.season}
            selected={this.props.episode}
            show={this.state.show}
          />
        </Form.Group>
      );
    }
  }

  renderNextButton() {
    if (this.props.episode) {
      return (
        <Button onClick={this.props.onNextClick}>Onward, to spoiler free web browsing!</Button>
      );
    }
  }
}
