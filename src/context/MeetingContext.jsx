import React, { createContext, useState, useContext } from 'react';

const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [actionItems, setActionItems] = useState([]);

  return (
    <MeetingContext.Provider value={{
      selectedCategory,
      setSelectedCategory,
      meetingNotes,
      setMeetingNotes,
      actionItems,
      setActionItems,
    }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeetingContext = () => useContext(MeetingContext);

export default MeetingContext;
