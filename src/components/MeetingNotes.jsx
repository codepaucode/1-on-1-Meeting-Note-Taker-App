import React from 'react';
import './MeetingNotes.css';

const MeetingNotes = ({ notes, setNotes, isInputDisabled }) => {

  const handleNotesChange = (e) => {
    if (isInputDisabled) {
      alert("Please select a date first.");
      return;
    }
    setNotes(e.target.value);
  };

  return (
    <div className="meeting-notes">
      <h2>Meeting Notes</h2>
      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="Enter your meeting notes here"
        rows="20"
        cols="50"
        style={{ height: '400px' }}
        onClick={() => {
          if (isInputDisabled) {
            alert("Please select a date first.");
          }
        }}
      />
    </div>
  );
};

export default MeetingNotes;
