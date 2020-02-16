import React, { Component }  from 'react';
import { Container, Alert } from 'reactstrap';


export class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    toggleNotification(show) {
        this.setState({
            show : show
        });
    }
    render() {
        return (
            <Container>
                <Alert color={this.props.item.type} isOpen={this.state.show} onClick={() => this.toggleNotification(false)} toggle={() => this.toggleNotification(false)}>
                    <h4 className="alert-heading">{this.props.item.title}</h4>
                    <p>{this.props.item.text}</p>
                </Alert>
            </Container>
        );
    }

}
