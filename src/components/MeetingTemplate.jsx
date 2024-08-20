import React, { useEffect } from "react";
import { useMeetingContext } from "../context/MeetingContext";
import './MeetingTemplate.css';

// Pre-set guide questions per category
const initialQuestions = {
  "Ask for Guidance and Input": [
    "I am having some challenges and struggles with [specific task/project]. Can you help me think about how to navigate and address this successfully?",
    "Could you suggest any ideas or thoughts on how I could get more support (people, time, funding) to help with [specific task/project]?",
    "What do you think of my idea [specific idea]? Do you have any suggestions for how to improve it, or might you have an alternative idea I should consider?"
  ],
  "Clarify Priorities and Expectations": [
    "Given what is on my plate, what should I be prioritizing right now, and can you help me understand why?",
    "As you review my workload, am I taking on the right projects and tasks?",
    "Am I on track for meeting my goals and your expectations from your perspective? Is any refocusing necessary?",
    "Is there any context I might be missing about the projects I am working on? For example, what is the reasoning for doing project [specific project]?"
  ],
  "Align with the Organization and Its Strategy": [
    "What is going on further up the tree (or in other parts of the organization) that would be helpful for me to know as I work on my key tasks?",
    "To better help me understand the big picture, how does the work I’m doing or the assignment you just gave me fit into the broader goals and strategy?",
    "Is there anything that the management team is working on or considering that you think I should know about, given its potential impact on my role?",
    "What is new in our strategic priorities as a company that you feel I should know about, if anything?"
  ],
  "Seek Growth Opportunities and Career Advancement": [
    "I would value your counsel. What can I do to prepare myself for greater opportunities or to pursue [specific interest]?",
    "As you reflect on where the organization is going, do you have any thoughts on how I should improve and develop to best align?",
    "What strengths do you think I have, and how might they be helpful in the future?",
    "From your perspective, what should I be targeting as my next career move, and why do you recommend that position?",
    "How can we make sure that my skillset is put to the best use to support the team and the organization?",
    "How can we make sure that my full potential is achieved?"
  ],
  "Get Feedback on Your Performance": [
    "Am I meeting your expectations? I would appreciate learning your perspective on my work performance.",
    "What feedback might you be able to share with me about how I’m doing at [specific task/project]?",
    "Do you feel I have any blind spots when it comes to [specific task/project]?",
    "As you reflect on what I do at work, what should I start, stop, or continue doing?"
  ],
  "Build a Relationship": [
    "How is your day going?",
    "How are things going for you overall? Are you doing okay?",
    "What is something you are excited about outside of work?",
    "Is there anything you would like to know about me?"
  ],
  "Offer Support": [
    "What are your priorities over the next [specific time period]? What can I do to help you with this?",
    "Where can I offer you support?",
    "Is there anything keeping you up at night that I can help with?"
  ]
};

const MeetingTemplate = ({ disabled }) => {
  const { selectedCategory, setSelectedCategory, setMeetingNotes } = useMeetingContext();

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setMeetingNotes(initialQuestions[newCategory] || []);
  };

  useEffect(() => {
    if (!selectedCategory) {
      setMeetingNotes([]);
    }
  }, [selectedCategory, setMeetingNotes]);

  useEffect(() => {
    setSelectedCategory(''); 
  }, [setSelectedCategory]);

  return (
    <div className="meeting-template">
      <h2 className="meeting-template__title">Meeting Template</h2>
      <p className="meeting-template__intro-text">
        You may choose guide questions for your specific meeting agenda. These guides are designed to help you make the most out of your 1-on-1 meetings with your supervisor. They are categorized into seven key areas, allowing you to advocate for your career growth, clarify expectations, and build a stronger working relationship.
      </p>
      <select
        onChange={handleCategoryChange}
        value={selectedCategory || ''}
        disabled={disabled}
        className="meeting-template__select"
      >
        <option value="" disabled>Select a guide question</option>
        {Object.keys(initialQuestions).map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      {selectedCategory && (
        <ul className="meeting-template__questions-list">
          {(initialQuestions[selectedCategory] || []).map((q, index) => (
            <li key={index} className="meeting-template__question-item">{q}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeetingTemplate;
