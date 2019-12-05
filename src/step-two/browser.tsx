import React from "react";

import { Page } from "../wikimedia/types";
import { Wikimedia } from "../wikimedia/wikimedia";

interface BrowserProps {
  page: Page;
  wiki: Wikimedia;
}

interface BrowserState {
  html?: string;
}

export class Browser extends React.Component<BrowserProps, BrowserState> {
  constructor(props: BrowserProps) {
    super(props);

    this.state = {};
  }

  render() {
    if (this.state.html) {
      return <div dangerouslySetInnerHTML={{__html: this.state.html}} />
    } else {
      return "Loading...";
    }
  }

  componentDidMount() {
    this.props.wiki.getPage(this.props.page.oldid).then(response => {
      this.setState({html: JSON.parse(response).parse.text["*"]});
    });
  }
}
