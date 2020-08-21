import React from 'react';
import SignedIn from './signed_in';
import SignedOut from './signed_out';

class UserAuthBanner extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let renderedComponent;
        if (this.props.currentUser) {
            renderedComponent = <SignedIn logout={this.props.logout} currentUser={this.props.currentUser} />;
        } else {
            renderedComponent = <SignedOut login={this.props.login} />;
        }
        return (
            <div id='user-auth-banner-container'>
                <li className='user-auth-banner-title'>Chess with Friends</li>
                <nav id='user-auth-banner'>
                    {renderedComponent}
                </nav>
            </div>
        )
    }
}

export default UserAuthBanner;