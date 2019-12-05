import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import React from 'react'

import { Episode, Season, Show } from "../tvmaze/types";
import { EpisodePicker } from "./episode-picker";
import { SeasonPicker } from "./season-picker";
import { ShowPicker } from "./show-picker";

interface StepOneProps {
  onEpisodeChange: (episode?: Episode, nextEpisode?: Episode) => void;
  onNextClick: () => void;
  episode?: Episode;
  nextEpisode?: Episode;
}

interface StepOneState {
  nextSeason?: Season;
  season?: Season;
  show?: Show;
}

export class StepOne extends React.Component<StepOneProps, StepOneState> {
  constructor(props: StepOneProps) {
    super(props);

    this.state = {};

    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    return (
        <Jumbotron>
          <Form onSubmit={this.onSubmit}>
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
          <Form.Label>Select the season you are watching:</Form.Label>
          <SeasonPicker
            onChange={(season, nextSeason) => {
              this.setState({season, nextSeason});
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
            nextSeason={this.state.nextSeason}
            onChange={(episode, nextEpisode) => this.props.onEpisodeChange(episode, nextEpisode)}
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
        <Button type="submit">Onward, to spoiler free web browsing!</Button>
      );
    }
  }

  onSubmit(e: React.FormEvent) {
    e.preventDefault();
    this.props.onNextClick();
  }
}
