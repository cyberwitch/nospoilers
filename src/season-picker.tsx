import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

import { Season, Show } from "./types";
import { tvmaze } from "./tvmaze";

interface SeasonPickerProps {
  onChange: (selected: Season) => void;
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
  }

  render() {
    return (
      <Typeahead
        clearButton={true}
        filterBy={() => true}
        isLoading={this.state.isLoading}
        labelKey={this.formatSeasonName}
        onChange={selected => this.props.onChange(selected[0])}
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

  componentDidMount() {
    this.fetchSeasons();
  }

  componentDidUpdate(prevProps: SeasonPickerProps) {
    if (this.props.show !== prevProps.show) {
      this.fetchSeasons();
    }
  }
}
