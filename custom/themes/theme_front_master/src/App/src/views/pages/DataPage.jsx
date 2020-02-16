import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row } from "reactstrap";
import { initPage, pageReady } from "../../thunks/general";
import { fetchLikes, fetchContentCreated, fetchLastArticles, fetchFastLastArticles, fetchLastNews, fetchFastLastNews, fetchLastPages, fetchFastLastPages, fetchUsers } from "../../thunks/apiDrupal";
import {ContentBar, Analytics, DoughnutGraph, DataTable, ComplexDataTable} from "../../components";

class DataPage extends Component {
    constructor(props) {
        super(props);
        this.props.initPage("Data");
        this.props.fetchLikes();
        this.props.fetchContentCreated();
        this.props.fetchLastArticles(100);
        this.props.fetchLastNews(100);
        this.props.fetchLastPages(100);
    }

    reloadData() {
        this.props.fetchFastLastArticles(100);
        this.props.fetchFastLastNews(100);
        this.props.fetchFastLastPages(100);
    }

    componentDidMount() {
        this.props.pageReady();
        setInterval(this.reloadData.bind(this), 5000);
    }

    render() {
        if (this.props.ready)
            return (
            <Container>
                <Row>
                    <Col className={"mb-5"} md={12}>
                        <h4>LAST ARTICLES</h4>
                        <DataTable isFetching={this.props.last_articles.isFetching} data={this.props.last_articles.data} pagination={true} showSearch={true} itemsPerPage={5} />
                    </Col>
                    <Col className={"mb-5"} md={6}>
                        <h4>LAST NEWS</h4>
                        <DataTable isFetching={this.props.last_news.isFetching} data={this.props.last_news.data} pagination={true} showSearch={true} itemsPerPage={5} />
                    </Col>
                    <Col className={"mb-5"} md={6}>
                        <h4>LAST BASIC PAGES</h4>
                        <DataTable isFetching={this.props.last_pages.isFetching} data={this.props.last_pages.data} pagination={true} showSearch={true} itemsPerPage={5} />
                    </Col>
                    <Col className={"mb-5"} md={12}>
                        <h4>MY LIKES</h4>
                        <DataTable isFetching={this.props.likes.isFetching} data={this.props.likes.data} pagination={true} showSearch={true} itemsPerPage={5} />
                    </Col>
                </Row>
            </Container>
        );
        return null;
    }
}

const mapStateToProps = state => ({
    ready: state.app.system.ready,
    likes: state.drupal.likes,
    last_articles: state.drupal.last_articles,
    last_news: state.drupal.last_news,
    last_pages: state.drupal.last_pages,
    users: state.drupal.users,
    content: state.drupal.content_created
});

const mapDispatchToProps = dispatch => ({
    initPage: (page_title) => dispatch(initPage(page_title)),
    pageReady: () => dispatch(pageReady()),
    fetchLikes: () => dispatch(fetchLikes()),
    fetchContentCreated: () => dispatch(fetchContentCreated()),
    fetchFastLastArticles: (limit) => dispatch(fetchFastLastArticles(limit)),
    fetchLastArticles: (limit) => dispatch(fetchLastArticles(limit)),
    fetchLastNews: (limit) => dispatch(fetchLastNews(limit)),
    fetchFastLastNews: (limit) => dispatch(fetchFastLastNews(limit)),
    fetchLastPages: (limit) => dispatch(fetchLastPages(limit)),
    fetchFastLastPages: (limit) => dispatch(fetchFastLastPages(limit)),
    fetchUsers: (limit) => dispatch(fetchUsers(limit))
});

export default connect(mapStateToProps, mapDispatchToProps)(DataPage);
// Example usage: <DataPage />
