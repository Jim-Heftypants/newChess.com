import React from 'react';
import {Link} from 'react-router-dom';
import CreateUserContainer from '../create_user_form_container';
import LoginUserContainer from '../../session/login_container';

class SignedOut extends React.Component {
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
    }

    click(actionType) {
        if (actionType === 'new') {
            document.getElementById('create').classList.add('active-form')
        } else if (actionType === 'login') {
            document.getElementById('login').classList.add('active-form')
        } else if (actionType === 'demo') {
            const demoUser = {
                username: 'Demo User',
                password: '123456',
            }
            this.props.login(demoUser);
        }
    }

    render() {
        return (
            <div>
                <div className='user-auth-banner-links'>
                    {/* <li><Link to={`/users/new`}>Create New User</Link></li>
                    <li><Link to={`/session/new`}>Login</Link></li> */}
                    <li><a target='_blank' href='https://www.linkedin.com/in/nick-sercel-4402261a0/'>LinkedIn</a></li>
                    <li><a target="_blank" href='https://github.com/Jim-Heftypants/newChess.com'>Github</a></li>
                    <li><a className='clickable' onClick={() => this.click('new')}>Create New User</a></li>
                    <li><a className='clickable' onClick={() => this.click('login')}>Login</a></li>
                    <li><a className='clickable' onClick={() => this.click('demo')}>Demo User</a></li>
                </div>
                <CreateUserContainer />
                <LoginUserContainer />
            </div>
        )
    }
}

export default SignedOut;