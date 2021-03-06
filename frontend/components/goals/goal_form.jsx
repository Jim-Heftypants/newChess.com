import React from 'react';
import { withRouter } from 'react-router-dom';

class GoalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.goal;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    update(formType) {
        return e => {
            this.setState({ [formType]: e.currentTarget.value });
        }
    }

    handleSubmit() {
        this.props.action(this.state)
            // .then(() => this.props.history.push(`/users/${this.props.match.params.userId}`)) // user show page
    }

    render() {
        return (
            <div className='goal-form-container'>
                <div>
                    <label className={'goal-form-item goal-form-title'}>Title:</label>
                    <input type='text' value={this.state.title} onChange={this.update('title')} />
                </div>
                <div className='goal-form-body-div'>
                    <label className={'goal-form-item oal-form-body'}>Body:</label>
                    <input type='text' value={this.state.body} onChange={this.update('body')} />
                </div>
                <div>
                    <button onClick={this.handleSubmit}>{this.props.formType}</button>
                </div>
            </div>
        )
    }
}

export default withRouter(GoalForm);