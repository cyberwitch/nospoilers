import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Toast from "react-bootstrap/Toast";

import { Browser } from "./browser";
import { Episode } from "../tvmaze/types";
import { Page } from "../wikimedia/types";
import { Wikimedia } from "../wikimedia/wikimedia";

const wiki = new Wikimedia();

interface StepTwoProps {
  episode: Episode;
  nextEpisode?: Episode;
}

interface StepTwoState {
  pages: Page[];
  query: string;
  loading?: boolean;
  submitted?: boolean;
  toastVisible?: boolean;
}

export class StepTwo extends React.Component<StepTwoProps, StepTwoState> {
  constructor(props: StepTwoProps) {
    super(props);

    this.state = {
      pages: [],
      query: "",
      toastVisible: false
    };

    this.onClick = this.onClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    if (this.props.nextEpisode) {
      return (
        <React.Fragment>
          <Toast show={this.state.toastVisible} onClose={() => this.setState({toastVisible: false})} autohide>
            <Toast.Body onClick={() => window.scrollTo(0, 0)} className="alert-primary">
              New tab opened!  Click here to scroll up.
            </Toast.Body>
          </Toast>
          <Jumbotron>
            <Alert variant="primary">
              You can browse Wikipedia below without any risk of spoilers beyond episode "{this.props.episode.name}".
            </Alert>

            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label>
                  Search for a Wikipedia article:
                </Form.Label>
                <Form.Control value={this.state.query}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({
                                pages: [],
                                query: e.target.value,
                                submitted: false
                              })}/>
              </Form.Group>
              <Button disabled={this.state.loading} variant="primary" type="submit">Search</Button>
            </Form>
          </Jumbotron>

          {this.renderTabs()}
        </React.Fragment>
      );
    } else {
      return (
        <Jumbotron>
          <Alert variant="danger">
            You selected the last episode of the series!  Just go to Wikipedia like a normal person.
          </Alert>
        </Jumbotron>
      );
    }
  }

  renderTabs() {
    if (this.state.pages.length) {
      return (
        <Tabs id="browser">
          {this.state.pages.map(page => {
            return (
              <Tab key={page.title} eventKey={page.title} title={page.title}>
                <Browser page={page} wiki={wiki} />
              </Tab>
            );
          })}
        </Tabs>
      );
    } else if (this.state.loading) {
      return <Alert variant="primary">Searching...</Alert>;
    } else if (this.state.submitted) {
      return <Alert variant="danger">Sorry, no results were found from before the next episode aired :(</Alert>;
    }
  }

  fetchPage(title: string) {
    if (!this.state.pages.find(page => page.title === title)) {
      return wiki.getRevision(title, this.props.nextEpisode!.airstamp).then(getRevisionResponse => {
        const pages = JSON.parse(getRevisionResponse).query.pages;
        const revisions = pages[Object.keys(pages)[0]].revisions;

        if (revisions && revisions.length) {
          this.setState({pages: this.state.pages.concat([{title, oldid: revisions[0].revid}])});
        }
      });
    }
  }

  onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!this.state.loading) {
      this.setState({loading: true, pages: [], submitted: true});

      wiki.search(this.state.query).then(searchResponse => {
        const results = JSON.parse(searchResponse);

        if (results.query.search.length) {
          Promise.all(results.query.search.map((page: Page) => this.fetchPage(page.title))).finally(() => this.setState({loading: false}));
        }
      }).catch(() => {
        this.setState({loading: false});
      });
    }
  }

  onClick(e: MouseEvent) {
    const element = e.target as HTMLElement;

    if (element.tagName === "A") {
      const anchor = element as HTMLAnchorElement;

      if (anchor.pathname.startsWith("/wiki/")) {
        const newtab = this.fetchPage(anchor.pathname.substring(6).replace(/_/g, " "));

        newtab && newtab.then(() => this.setState({toastVisible: true}));
      } else if (!anchor.href.startsWith(window.location.origin)) {
        window.open(anchor.href, "_blank");
      }

      e.preventDefault();
    }
  }

  componentDidMount() {
    window.addEventListener("click", this.onClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onClick)
  }
}
