import React from 'react';
import '../styles/goalsSidebar.css';

const GoalsSidebar = ({ longTermGoals, setLongTermGoals, shortTermGoals, setShortTermGoals, handleSaveGoals }) => {
  return (
    <div className="goals-sidebar">
      <h2>Goals</h2>

      <div className="goal-section">
        <h3>Long Term Goals</h3>
        <textarea
          value={longTermGoals}
          onChange={(e) => setLongTermGoals(e.target.value)}
          placeholder="Enter your long-term goals here"
        />
      </div>

      <div className="goal-section">
        <h3>Short Term Goals</h3>
        <textarea
          value={shortTermGoals}
          onChange={(e) => setShortTermGoals(e.target.value)}
          placeholder="Enter your short-term goals here"
        />
      </div>

      <button onClick={handleSaveGoals} className="save-goals-button">Save Goals</button>
    </div>
  );
};

export default GoalsSidebar;
