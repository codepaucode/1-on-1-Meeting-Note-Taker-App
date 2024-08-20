import React, { createContext, useState, useContext } from 'react';

const MeetingContext = createContext();

// Provider component for the MeetingContext (to manage and share data related to meeting details across the app)
export const MeetingProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected guide question category
  const [meetingNotes, setMeetingNotes] = useState(''); // Meeting notes content
  const [actionItems, setActionItems] = useState([]); // List of action items

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

// Custom hook to use the MeetingContext
export const useMeetingContext = () => useContext(MeetingContext);

export default MeetingContext;
