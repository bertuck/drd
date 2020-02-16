import React, {Component} from 'react';
import { Row, Table, Button } from 'reactstrap';
import {DataRow, LoadingDatatable} from '../../components'
import {filterData, isEmpty} from '../../thunks/utils';
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
import * as Feather from "react-feather";

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            itemsPerPage: (typeof this.props.itemsPerPage !== undefined ? this.props.itemsPerPage : 5),
            search: '',
            dataFilter: null,
            showSearch: (typeof this.props.showSearch !== undefined ? this.props.showSearch : true),
            pagination: (typeof this.props.pagination !== undefined ? this.props.pagination : false),
        };
    }

    handleChange(e) {
        this.setState({ search: e.target.value });
    }

    validateForm(e) {
        if(e.keyCode === 13) this.searchGlobal();
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    }

    setPagination(data) {
        if (data.length > this.state.itemsPerPage && this.state.pagination)
            return (
                <Pagination
                    firstPageText={<i className='fa fa-angle-double-left'/>}
                    lastPageText={<i className='fa fa-angle-double-right'/>}
                    prevPageText={<i className='fa fa-angle-left'/>}
                    nextPageText={<i className='fa fa-angle-right'/>}
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.state.itemsPerPage}
                    totalItemsCount={data.length}
                    onChange={this.handlePageChange.bind(this)}
                />
            );
        return (null);
    }

    searchGlobal() {
        let result = [];
        if (this.state.search !==  '') {
            const regexpr = new RegExp(this.state.search.split(' ').map(term => `(?=.*${term})`).join(''), 'i');
            result = filterData(this.props.data, (item)  => item.content.match(regexpr));
        } else {
            this.setState({dataFilter: null});
            return;
        }
        if (result.length > 0) {
            this.setState({dataFilter: result});
        } else {
            this.setState({dataFilter: []});
        }
    }

    setSearch() {
        const Icon = Feather['Search'] ;
        if (this.state.showSearch)
            return (
                <div className="card card-sm">
                    <div className="card-body row no-gutters align-items-center">
                        <div className="col">
                            <input type="text" className="form-control form-search-data" onKeyDown={this.validateForm.bind(this)} placeholder="Recherche" onChange={this.handleChange.bind(this)}/>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-lg btn-search" onClick={this.searchGlobal.bind(this)}>{'Search' && Icon && <Icon className="side-nav-icon"/>}</button>
                        </div>
                    </div>
                </div>
            );
        return (null);
    }

    createDataRows(data, data_columns) {
        if (data.length > 0)
            return Object.values(data).map((item, index) => {
                return (<DataRow key={index} items={item}/>);
            });
        return (<tr><td colSpan={data_columns.length}>Aucun resultat.</td></tr>);
    }

    render() {
        let props_data = [];
        props_data = this.state.dataFilter !== null ? this.state.dataFilter : this.props.data;
        let data = props_data;
        if (this.state.pagination && !isEmpty(this.props.data)) {
            const indexOfLastTodo = this.state.activePage * this.state.itemsPerPage;
            const indexOfFirstTodo = indexOfLastTodo - this.state.itemsPerPage;
            data = props_data.slice(indexOfFirstTodo, indexOfLastTodo);
        }
        let data_columns = Object.values(this.props.data);
        if (data_columns[0]) data_columns = data_columns[0];
        if (this.props.isFetching)
            return (<LoadingDatatable />);
        return (
            <div>
                { this.setSearch() }
                <Row>
                    <Table>
                        <thead>
                        <tr>
                            { Object.values(data_columns).map((item, index) =>  (<th key={index}>{item.title}</th>) )}
                        </tr>
                        </thead>
                        <tbody>
                        { this.createDataRows(data, data_columns) }
                        </tbody>
                    </Table>
                    { this.setPagination(props_data) }
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ready: state.app.system.ready,
});

export default connect(mapStateToProps)(DataTable);
