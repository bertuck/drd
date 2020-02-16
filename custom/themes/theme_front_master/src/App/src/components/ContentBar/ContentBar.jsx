import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { connect } from "react-redux";
import { isEmpty } from '../../thunks/utils';
import ContentLoader from "react-content-loader";

class ContentBar extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const options = {
            title: {
                display: false,
            },
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false,
                labels: {
                    boxWidth: 50,
                    fontSize: 10,
                    fontColor: '#bbb',
                    padding: 5,
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                        min: 0,
                        max: 150
                    }
                }]
            }
        };

        let data = {
            labels: this.props.content.labels,
            datasets: [
                {
                    label: '',
                    height: '50px',
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#AA00FF',
                        '#43a047'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#AA00FF',
                        '#43a047'
                    ],
                    data: this.props.content.data,
                }
            ],

        };
        if (isEmpty(this.props.content.data))
            return (
                <div id="spinner" className="container-loading">
                    <ContentLoader
                        viewBox="0 0 400 160"
                        height={160}
                        width={400}
                        speed={2}
                        backgroundColor="transparent"
                    >
                        <circle cx="150" cy="86" r="8" />
                        <circle cx="194" cy="86" r="8" />
                        <circle cx="238" cy="86" r="8" />
                    </ContentLoader>
                </div>
            );
        return (
            <Bar data={data} options={options}/>
        );
    }
}

const mapStateToProps = state => ({
    ready: state.app.system.ready,
    content: state.drupal.content_created
});

export default connect(mapStateToProps)(ContentBar);