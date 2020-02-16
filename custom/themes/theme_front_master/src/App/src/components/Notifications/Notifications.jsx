import React, { Component }  from 'react';
import { connect } from 'react-redux'
import { Notification } from "./components/Notification";


class Notifications extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const showNotifications = notifs => {
            return Object.values(notifs).map((item, index) => (<Notification key={index} item={item} />));
        };
        const itemType = (item, index) => {
            return <Notification item={item} key={index} />;
        };
        if (this.props.ready)
            return (
               <div className="notifications">
                   { showNotifications(this.props.items) }
               </div>
            );
        return (null);
    }

}


const mapStateToProps = state => ({
    ready: state.app.system.ready,
    show: state.app.notifications.show,
    items: state.app.notifications.items
});

export default connect(mapStateToProps)(Notifications);
// Example usage: <Notification />
