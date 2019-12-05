import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

import { Episode, Season, Show } from "../tvmaze/types";
import { tvmaze } from "../tvmaze/tvmaze";

interface EpisodePickerProps {
  onChange: (episode?: Episode, nextEpisode?: Episode) => void;
  nextSeason?: Season;
  show: Show;
  season?: Season;
  selected?: Episode;
}

interface EpisodePickerState {
  isLoading: boolean;
  results: Episode[];
  firstEpsiodeNextSeason?: Episode;
}

export class EpisodePicker extends React.Component<EpisodePickerProps, EpisodePickerState> {
  constructor(props: EpisodePickerProps) {
    super(props);

    this.state = {
      isLoading: false,
      results: []
    };

    this.fetchEpisodes = this.fetchEpisodes.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <Typeahead
        id="episode-picker"
        clearButton={true}
        isLoading={this.state.isLoading}
        labelKey={this.formatEpisodeName}
        onChange={this.onChange}
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
      episodeNumber = `0${episodeNumber || "0"}`;
    }

    return `${seasonNumber}.${episodeNumber} - ${episode.name}`;
  }

  fetchEpisodes() {
    const show = this.props.show.id.toString();

    this.setState({isLoading: true});

    if (this.props.season) {
      tvmaze.shows.seasonEpisodes(this.props.season.id.toString())
        .then(results => {
          this.setState({results});

          if (this.props.nextSeason) {
            tvmaze.shows.episodebynumber(show, this.props.nextSeason.number.toString(), "1")
              .then(firstEpsiodeNextSeason => this.setState({firstEpsiodeNextSeason}))
              .finally(() => this.setState({isLoading: false}));
          } else {
            this.setState({firstEpsiodeNextSeason: undefined, isLoading: false});
          }
        }).catch(() => {
          this.setState({isLoading: false});
      })
    } else {
      tvmaze.shows.episodes(show)
        .then(results => this.setState({results}))
        .finally(() => this.setState({isLoading: false}));
    }
  }

  onChange(selected: Episode[]) {
    if (selected.length) {
      const nextEpisodeIndex = this.state.results.indexOf(selected[0]) + 1;

      if (this.state.results.length <= nextEpisodeIndex) {
        this.props.onChange(selected[0], this.state.firstEpsiodeNextSeason);
      } else {
        this.props.onChange(selected[0], this.state.results[nextEpisodeIndex]);
      }
    } else {
      this.props.onChange();
    }
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
