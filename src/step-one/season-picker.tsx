import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

import { Season, Show } from "../tvmaze/types";
import { tvmaze } from "../tvmaze/tvmaze";

interface SeasonPickerProps {
  onChange: (season?: Season, nextSeason?: Season) => void;
  show: Show;
  selected?: Season;
}

interface SeasonPickerState {
  isLoading: boolean;
  results: Season[];
}

export class SeasonPicker extends React.Component<SeasonPickerProps, SeasonPickerState> {
  constructor(props: SeasonPickerProps) {
    super(props);

    this.state = {
      isLoading: false,
      results: []
    };

    this.fetchSeasons = this.fetchSeasons.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <Typeahead
        id="season-picker"
        clearButton={true}
        filterBy={() => true}
        isLoading={this.state.isLoading}
        labelKey={this.formatSeasonName}
        onChange={this.onChange}
        options={this.state.results}
        renderMenuItemChildren={season => {
          const seasonName = this.formatSeasonName(season);
          return (
            <div>
              {season.image && <img src={season.image.medium} alt={seasonName} />}
              {seasonName}
            </div>
          );
        }}
        selected={this.props.selected ? [this.props.selected] : []}
      />
    );
  }

  formatSeasonName(season: Season) {
    return [season.number, season.name].filter(namePart => !!namePart).join(". ");
  }

  fetchSeasons() {
    this.setState({isLoading: true});
    tvmaze.shows.seasons(this.props.show.id.toString())
      .then(results => this.setState({results}))
      .finally(() => this.setState({isLoading: false}));
  }

  onChange(selected: Season[]) {
    if (selected.length) {
      const nextSeasonIndex = this.state.results.indexOf(selected[0]) + 1;

      if (this.state.results.length <= nextSeasonIndex) {
        this.props.onChange(selected[0]);
      } else {
        this.props.onChange(selected[0], this.state.results[nextSeasonIndex]);
      }
    } else {
      this.props.onChange();
    }
  }

  componentDidMount() {
    this.fetchSeasons();
  }

  componentDidUpdate(prevProps: SeasonPickerProps) {
    if (this.props.show !== prevProps.show) {
      this.fetchSeasons();
    }
  }
}
