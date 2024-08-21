// IntroductionModal.jsx
import React from 'react';
import './IntroductionModal.css';

const IntroductionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to Our App</h2>
        <p>
          Effective one-on-one meetings between managers and employees are crucial for performance, growth, and team success. 
          However, these meetings often overlook the employee's needs, leaving them to advocate for themselves. 
          Drawing inspiration from Harvard Business Review’s research on twenty-eight essential questions for productive meetings, 
          our application empowers employees by integrating these questions into the meeting process.
        </p>
        <ul>
          <li><strong>Select relevant questions:</strong> Choose from a set of carefully crafted questions to guide the conversation.</li>
          <li><strong>Document meeting notes:</strong> Keep a clear record of discussions and decisions.</li>
          <li><strong>Track action items:</strong> Ensure follow-through on commitments with a dedicated tracking feature.</li>
          <li><strong>Generate summaries:</strong> Quickly create summaries to recap key points and next steps.</li>
          <li><strong>Automated email:</strong> Send meeting summaries directly to participants, ensuring everyone stays aligned and informed.</li>
        </ul>
        <p>
          This tool helps employees actively manage their professional growth, ensuring that each meeting is focused, effective, 
          and aligned with best practices. It not only supports individual success but also enhances the performance of the entire team.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default IntroductionModal;
