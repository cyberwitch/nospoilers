import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

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
}

export class StepTwo extends React.Component<StepTwoProps, StepTwoState> {
  constructor(props: StepTwoProps) {
    super(props);

    this.state = {
      pages: [],
      query: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    if (this.props.nextEpisode) {
      return (
        <React.Fragment>
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
              <Button variant="primary" type="submit">Search</Button>
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
                {page.title}
              </Tab>
            );
          })}
        </Tabs>
      );
    } else if (this.state.loading) {
      return <Alert variant="primary">"Searching..."</Alert>;
    } else if (this.state.submitted) {
      return <Alert variant="danger">"Sorry, no results were found from before the next episode aired :("</Alert>;
    }
  }

  onSubmit(e: React.FormEvent) {
    e.preventDefault();

    this.setState({loading: true, submitted: true});

    wiki.search(this.state.query).then(searchResponse => {
      const results = JSON.parse(searchResponse);

      if (results.query.search.length) {
        results.query.search.forEach((page: Page) => {
          const date = new Date(this.props.nextEpisode!.airstamp);
          date.setDate(date.getDate() - 1);

          wiki.getRevision(page.title, date.toISOString()).then(getRevisionResponse => {
            const pages = JSON.parse(getRevisionResponse).query.pages;
            const revisions = pages[Object.keys(pages)[0]].revisions;

            if (revisions && revisions.length) {
              this.setState({pages: this.state.pages.concat([{title: page.title, revid: revisions[0].revid}])});
            }
          }).finally(() => {
            this.setState({loading: false});
          });
        });
      }
    }).finally(() => {
      this.setState({loading: false});
    });
  }
}
