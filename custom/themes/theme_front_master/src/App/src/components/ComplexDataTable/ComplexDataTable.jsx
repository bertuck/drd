import React, {Component} from 'react';
import { MDBDataTable } from 'mdbreact';
import {connect} from "react-redux";

class ComplexDataTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data_example = {
            columns: [
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Position',
                    field: 'position',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'Office',
                    field: 'office',
                    sort: 'asc',
                    width: 200
                },

            ],
            rows: [
                {
                    name: 'Tiger Nixon',
                    position: 'System Architect',
                    office: 'Edinburgh'
                },
                {
                    name: 'Garrett Winters',
                    position: 'Accountant',
                    office: 'Tokyo'
                },
                {
                    name: 'Ashton Cox',
                    position: 'Junior Technical Author',
                    office: 'San Francisco'
                },
                {
                    name: 'Cedric Kelly',
                    position: 'Senior Javascript Developer',
                    office: 'Edinburgh'
                },
                {
                    name: 'Airi Satou',
                    position: 'Accountant',
                    office: 'Tokyo',
                    age: '33',
                    date: '2008/11/28',
                    salary: '$162'
                },
                {
                    name: 'Brielle Williamson',
                    position: 'Integration Specialist',
                    office: 'New York'
                }
            ]
        };
        return (
            <MDBDataTable
                striped={false}
                bordered
                small={false}
                barReverse={true}
                noBottomColumns={true}
                data={data_example}
                paging={false}
            />
        );
    }
}

const mapStateToProps = state => ({
    ready: state.app.system.ready,
});

export default connect(mapStateToProps)(ComplexDataTable);
