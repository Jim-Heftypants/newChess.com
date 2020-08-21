import React from 'react';
import GoalIndexItem from './goal_index_item';

class GoalIndex extends React.Component {
    componentDidMount() {
        this.props.fetchGoals();
    }

    render() {
        return (
            <div>
                {this.props.goals.map(goal => <GoalIndexItem key={goal.id} goal={goal} deleteGoal={this.props.deleteGoal} />)}
            </div>
        )
    }
}

export default GoalIndex;