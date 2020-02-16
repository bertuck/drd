import React, { Component } from 'react';
import { connect } from 'react-redux';
import sassFeature from '../../assets/images/sass-feature.svg';
import responsiveFeature from '../../assets/images/responsive-feature.svg';
import { Container, Card, CardBody, Row, Col } from 'reactstrap';
import {ContentBar, DoughnutGraph, Weather, DataTable} from "../../components";
import {initPage, pageReady} from "../../thunks/general";
import { fetchContentCreated, fetchUsers, fetchFastContentCreated, fetchFastUsers } from "../../thunks/apiDrupal";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.props.initPage("Accueil");
    this.props.fetchContentCreated();
    this.props.fetchUsers(5);

  }
  reloadData(){
    this.props.fetchFastContentCreated();
    this.props.fetchFastUsers(5);
  }
  componentDidMount() {
    this.props.pageReady();
    setInterval(this.reloadData.bind(this), 5000);
  }

  render() {
    if (this.props.ready)
      return (
          <Container>
            <Row className={"mb-5"}>
              <Col md={6}>
                <div className="home-hero">
                  <h1>Welcome to {this.props.name}</h1>
                  <p className="text-muted">
                    Discover this UI dashboard framework that will help speed up
                    your next web application project.
                  </p>
                </div>
              </Col>
            </Row>
            <Row className={"mb-5"}>
              <Col md={6}>
                <Weather />
              </Col>
              <Col md={6}>
                <h4>UTILISATEURS</h4>
                <DataTable isFecthing={this.props.users.isFetching} data={this.props.users.data} pagination={false} search={false}/>
              </Col>
            </Row>
            <Row className={"mb-5"}>
              <Col md={6}>
                <Card>
                  <CardBody className="display-flex">
                    <img
                        src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/7761694521553750351-256.png"
                        style={{ width: 70, height: 70 }}
                        alt="Responsive"
                        aria-hidden={true}
                    />
                    <div className="m-l">
                      <h2 className="h4">1. DRUPAL</h2>
                      <p className="text-muted">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sollicitudin, nibh a luctus mattis, massa ipsum sodales metus, vitae eleifend lacus arcu non nulla.
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <CardBody className="display-flex">
                    <img
                        src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/7761694521553750351-256.png"
                        style={{ width: 70, height: 70 }}
                        alt="Responsive"
                        aria-hidden={true}
                    />
                    <div className="m-l">
                      <h2 className="h4">2. REACT</h2>
                      <p className="text-muted">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sollicitudin, nibh a luctus mattis, massa ipsum sodales metus, vitae eleifend lacus arcu non nulla.
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className={"mb-5"}>
              <Col md={6}>
                <h4>NODES PAR TYPE : BAR</h4>
                <ContentBar/>
              </Col>
              <Col md={6}>
                <h4>NODE PAR TYPE : GRAPH</h4>
                <DoughnutGraph content={this.props.content} />
              </Col>
            </Row>
          </Container>
      );
    return null;
  }
}

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const mapStateToProps = state => ({
  name: state.app.system.name,
  ready: state.app.system.ready,
  users: state.drupal.users,
  content: state.drupal.content_created
});

const mapDispatchToProps = dispatch => ({
  initPage: (page_title) => dispatch(initPage(page_title)),
  pageReady: () => dispatch(pageReady()),
  fetchContentCreated: () => dispatch(fetchContentCreated()),
  fetchUsers: (limit) => dispatch(fetchUsers(limit)),
  fetchFastContentCreated: () => dispatch(fetchFastContentCreated()),
  fetchFastUsers: (limit) => dispatch(fetchFastUsers(limit))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
// Example usage: <Page />
