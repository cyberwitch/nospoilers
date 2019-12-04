import { AsyncTypeahead } from "react-bootstrap-typeahead";
import React from "react";

import { Show } from "./types";
import { tvmaze } from "./tvmaze";

interface ShowPickerProps {
  onChange: (selected: Show) => void;
  selected?: Show;
}

interface ShowPickerState {
  isLoading: boolean;
  query: string;
  results: Show[];
}

export class ShowPicker extends React.Component<ShowPickerProps, ShowPickerState> {
  state = {
    isLoading: false,
    query: "",
    results: []
  };

  render() {
    return (
      <AsyncTypeahead
        clearButton={true}
        isLoading={this.state.isLoading}
        labelKey={(show: Show) => show.name}
        onSearch={query => {
          this.setState({isLoading: true});
          tvmaze.search.shows(query)
            .then(results => this.setState({results: results.map(show => show.show)}))
            .finally(() => this.setState({isLoading: false}));
        }}
        onChange={selected => this.props.onChange(selected[0])}
        options={this.state.results}
        renderMenuItemChildren={show => {
          return (
            <div>
              {show.image && <img src={show.image.medium} alt={show.name} />}
              {show.name}
            </div>
          );
        }}
        selected={this.props.selected ? [this.props.selected] : []}
      />
    );
  }
}
