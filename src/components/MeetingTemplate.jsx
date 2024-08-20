import React, { useEffect } from "react";
import { useMeetingContext } from "../context/MeetingContext";
import './MeetingTemplate.css';

// Pre-defined guide questions grouped by category
const guideQuestions = {
  "Ask for Guidance and Input": [
    "I am having some challenges with [specific task/project]. Can you help me navigate and address this?",
    "Do you have any ideas on how I could get more support for [specific task/project]?",
    "What do you think of my idea [specific idea]? Do you have any suggestions?"
  ],
  "Clarify Priorities and Expectations": [
    "What should I be prioritizing right now, given my workload?",
    "Am I taking on the right projects?",
    "Am I on track for meeting goals and expectations? Any necessary adjustments?",
    "Is there any context I might be missing about the projects I’m working on?"
  ],
  "Align with the Organization and Its Strategy": [
    "What is going on at higher levels that might impact my tasks?",
    "How does my work fit into the broader goals and strategy?",
    "Is there anything from management that I should be aware of?",
    "Are there any new strategic priorities I should know about?"
  ],
  "Seek Growth Opportunities and Career Advancement": [
    "How can I prepare myself for greater opportunities?",
    "How should I improve to align with the organization's future direction?",
    "What strengths do you think I have, and how might they be helpful?",
    "What should I target as my next career move, and why?"
  ],
  "Get Feedback on Your Performance": [
    "Am I meeting your expectations? What is your perspective on my work performance?",
    "What feedback can you share about how I’m doing at [specific task/project]?",
    "Do I have any blind spots with [specific task/project]?",
    "What should I start, stop, or continue doing?"
  ],
  "Build a Relationship": [
    "How is your day going?",
    "How are things going for you overall?",
    "What is something you're excited about outside of work?",
    "Is there anything you would like to know about me?"
  ],
  "Offer Support": [
    "What are your priorities over the next period? How can I help?",
    "Where can I offer you support?",
    "Is there anything keeping you up at night that I can help with?"
  ]
};

const MeetingTemplate = ({ disabled }) => {
  const { selectedCategory, setSelectedCategory } = useMeetingContext();

  // Handle category selection change
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory); // Update selected category in context
  };

  // Effect to handle the component reset logic
  useEffect(() => {
    setSelectedCategory(''); // Reset the selected category when the home button is clicked
  }, [setSelectedCategory]);

  return (
    <div className="meeting-template">
      <h2 className="meeting-template__title">Meeting Template</h2>
      <p className="meeting-template__intro-text">
        Select guide questions for your meeting agenda. These guides are designed to help you make the most out of your 1-on-1 meetings with your supervisor, categorized into key areas.
      </p>
      <select
        onChange={handleCategoryChange}
        value={selectedCategory || ''}
        disabled={disabled}
        className="meeting-template__select"
      >
        <option value="" disabled>Select a guide question category</option>
        {Object.keys(guideQuestions).map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      {selectedCategory && (
        <ul className="meeting-template__questions-list">
          {(guideQuestions[selectedCategory] || []).map((q, index) => (
            <li key={index} className="meeting-template__question-item">{q}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeetingTemplate;
