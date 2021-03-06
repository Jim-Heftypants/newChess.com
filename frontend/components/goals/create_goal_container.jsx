import { connect } from 'react-redux';
import GoalForm from './goal_form';
import { createGoal } from '../../actions/goal_actions';

const mSTP = (state) => ({
    goal: {
        title: '',
        body: '',
        user_id: `${state.session.id}`,
    },
    formType: 'Create Goal',
    formClassName: 'create',
})

const mDTP = dispatch => ({
    action: (goal) => dispatch(createGoal(goal))
})

export default connect(mSTP, mDTP)(GoalForm);