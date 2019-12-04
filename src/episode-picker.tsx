import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

import { Episode, Season, Show } from "./types";
import { tvmaze } from "./tvmaze";

interface EpisodePickerProps {
  onChange: (selected: Episode) => void;
  show: Show;
  season?: Season;
  selected?: Episode;
}

interface EpisodePickerState {
  isLoading: boolean;
  results: Episode[];
}

export class EpisodePicker extends React.Component<EpisodePickerProps, EpisodePickerState> {
  constructor(props: EpisodePickerProps) {
    super(props);

    this.state = {
      isLoading: false,
      results: []
    };

    this.fetchEpisodes = this.fetchEpisodes.bind(this);
  }

  render() {
    return (
      <Typeahead
        clearButton={true}
        filterBy={() => true}
        isLoading={this.state.isLoading}
        labelKey={this.formatEpisodeName}
        onChange={selected => this.props.onChange(selected[0])}
        options={this.state.results}
        renderMenuItemChildren={episode => {
          if (episode) {
            const episodeName = this.formatEpisodeName(episode);
            return (
              <div>
                {episode.image && <img src={episode.image.medium} alt={episodeName}/>}
                {episodeName}
              </div>
            );
          }
        }}
        selected={this.props.selected ? [this.props.selected] : []}
      />
    );
  }

  formatEpisodeName(episode: Episode) {
    let seasonNumber: string | number = episode.season;
    if (seasonNumber < 10) {
      seasonNumber = `0${seasonNumber}`;
    }

    let episodeNumber: string | number = episode.number;
    if (episodeNumber < 10) {
      episodeNumber = `0${episodeNumber}`;
    }

    return `${seasonNumber}.${episodeNumber} - ${episode.name}`;
  }

  fetchEpisodes() {
    this.setState({isLoading: true});

    let xhr;

    if (this.props.season) {
      xhr = tvmaze.shows.seasonEpisodes(this.props.season.id.toString());
    } else {
      xhr = tvmaze.shows.episodes(this.props.show.id.toString());
    }


   xhr.then(results => this.setState({results}))
     .finally(() => this.setState({isLoading: false}));
  }

  componentDidMount() {
    this.fetchEpisodes();
  }

  componentDidUpdate(prevProps: EpisodePickerProps) {
    if (this.props.show !== prevProps.show || this.props.season !== prevProps.season) {
      this.fetchEpisodes();
    }
  }
}
