import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
import ActionItems from "../components/ActionItems"; 
import MeetingNotes from "../components/MeetingNotes"; 
import MeetingSummary from "../components/MeetingSummary"; 
import MeetingTemplate from "../components/MeetingTemplate"; 
import Sidebar from "../components/Sidebar"; 
import GoalsSidebar from "../components/GoalsSidebar"; 
import IntroductionModal from "../components/IntroductionModal"; 
import { saveMeetingData, loadMeetingData, deleteMeetingData, saveGoalsData, loadGoalsData } from "../services/firebase"; 
import { useMeetingContext } from "../context/MeetingContext"; 
import './Dashboard.css'; 

const Dashboard = () => {
  const { currentUser } = useAuth(); 
  const { selectedCategory, setSelectedCategory, setMeetingNotes, setActionItems } = useMeetingContext(); 
  const [selectedDate, setSelectedDate] = useState(""); 
  const [savedMeetings, setSavedMeetings] = useState({}); 
  const [meetingData, setMeetingData] = useState({
    selectedCategory: '',
    meetingNotes: '',
    actionItems: [],
    summary: '',
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(true); // State for controlling the modal

  const [longTermGoals, setLongTermGoals] = useState(''); 
  const [shortTermGoals, setShortTermGoals] = useState(''); 

  // Load saved meetings and goals when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadSavedMeetings(); 
      loadGoals(); 
    }
  }, [currentUser]);

  // Load meeting data when the selected date changes
  useEffect(() => {
    if (selectedDate && savedMeetings[selectedDate]) {
      const savedMeeting = savedMeetings[selectedDate];
      setMeetingData(savedMeeting); 
      setSelectedCategory(savedMeeting.selectedCategory || ''); 
      setMeetingNotes(savedMeeting.meetingNotes || ''); 
      setActionItems(savedMeeting.actionItems || []); 
      setUnsavedChanges(false); 
    } else {
      resetMeetingData(); 
    }
  }, [selectedDate, savedMeetings, setSelectedCategory, setMeetingNotes, setActionItems]);

  // Function to load saved meetings from Firebase
  const loadSavedMeetings = async () => {
    try {
      const meetings = await loadMeetingData(currentUser.uid); 
      setSavedMeetings(meetings); 
    } catch (error) {
      console.error("Error loading saved meetings:", error);
    }
  };

  // Function to load goals from Firebase
  const loadGoals = async () => {
    try {
      const goals = await loadGoalsData(currentUser.uid); 
      setLongTermGoals(goals.longTermGoals || ''); 
      setShortTermGoals(goals.shortTermGoals || ''); 
    } catch (error) {
      console.error("Error loading goals data:", error);
    }
  };

  // Function to save the current meeting data to Firebase
  const handleSaveMeeting = async () => {
    if (!selectedDate) {
      alert('Please select a date to save the meeting.');
      return;
    }

    const updatedMeetingData = {
      selectedCategory, 
      meetingNotes: meetingData.meetingNotes, 
      actionItems: meetingData.actionItems, 
      summary: meetingData.summary, 
    };

    try {
      await saveMeetingData(currentUser.uid, selectedDate, updatedMeetingData); 
      alert('Meeting saved successfully!');
      setUnsavedChanges(false); 
      loadSavedMeetings(); 
    } catch (error) {
      console.error("Error saving meeting:", error);
      alert('Failed to save the meeting. Please try again.');
    }
  };

  // Function to delete the selected meeting data from Firebase
  const handleDeleteMeeting = async () => {
    if (!selectedDate) {
      alert('Please select a date to delete the meeting.');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the meeting on ${selectedDate}?`);
    if (confirmDelete) {
      try {
        await deleteMeetingData(currentUser.uid, selectedDate); 
        alert('Meeting deleted successfully!');
        resetMeetingData(); 
        loadSavedMeetings(); 
      } catch (error) {
        console.error("Error deleting meeting:", error);
        alert('Failed to delete the meeting. Please try again.');
      }
    }
  };

  // Function to save goals data to Firebase
  const handleSaveGoals = async () => {
    try {
      await saveGoalsData(currentUser.uid, { longTermGoals, shortTermGoals }); 
      alert('Goals saved successfully!');
    } catch (error) {
      console.error("Error saving goals:", error);
      alert('Failed to save the goals. Please try again.');
    }
  };

  // Function to reset meeting data to default values
  const resetMeetingData = () => {
    setMeetingData({
      selectedCategory: '',
      meetingNotes: '',
      actionItems: [],
      summary: '',
    });
    setSelectedCategory('');
    setMeetingNotes('');
    setActionItems([]);
    setUnsavedChanges(false);
  };

  return (
    <div className="dashboard-container">
      <IntroductionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> {/* Introduction Modal */}
      <Sidebar
        savedMeetings={savedMeetings} 
        onDateClick={(date) => {
          if (unsavedChanges) {
            const confirmSwitch = window.confirm("You have unsaved changes. Do you want to switch dates without saving?");
            if (!confirmSwitch) {
              return; 
            }
          }
          setSelectedDate(date);
        }}
        selectedDate={selectedDate}
        handleHomeClick={() => setSelectedDate("")}
      />
      <div className="dashboard-content">
        <main>
          <section className="date-section">
            <div className="date-and-delete-container">
              <label htmlFor="meeting-date">Select Meeting Date: </label>
              <input
                type="date"
                id="meeting-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {selectedDate && (
                <button className="delete-meeting-button" onClick={handleDeleteMeeting}>
                  Delete Meeting
                </button>
              )}
            </div>
            <button onClick={handleSaveMeeting} disabled={!selectedDate} className="save-meeting-button">Save Meeting</button>
          </section>

          <section className="meeting-template-section">
            <MeetingTemplate
              selectedCategory={meetingData.selectedCategory}
              setSelectedCategory={(category) => {
                setMeetingData({ ...meetingData, selectedCategory: category });
                setUnsavedChanges(true);
              }}
              disabled={!selectedDate}
            />
          </section>

          <section className="meeting-notes-section">
            <MeetingNotes
              notes={meetingData.meetingNotes}
              setNotes={(notes) => {
                setMeetingData({ ...meetingData, meetingNotes: notes });
                setUnsavedChanges(true);
              }}
              isInputDisabled={!selectedDate}
            />
          </section>

          <section className="action-items-section">
            <ActionItems
              actionItems={meetingData.actionItems}
              setActionItems={(items) => {
                setMeetingData({ ...meetingData, actionItems: items });
                setUnsavedChanges(true);
              }}
              isInputDisabled={!selectedDate}
            />
          </section>

          <section className="meeting-summary-section">
            <MeetingSummary
              meetingNotes={meetingData.meetingNotes}
              actionItems={meetingData.actionItems}
              setSummary={(summary) => setMeetingData({ ...meetingData, summary })}
              userName={currentUser.displayName}
              meetingDate={selectedDate}
              initialSummary={meetingData.summary}
              isSummaryButtonDisabled={!selectedDate || !savedMeetings[selectedDate]}
            />
          </section>
        </main>

        <footer className="dashboard-footer">
          <p>© 2024 FrontendDev101. All rights reserved.</p>
        </footer>
      </div>

      <GoalsSidebar
        longTermGoals={longTermGoals}
        setLongTermGoals={setLongTermGoals}
        shortTermGoals={shortTermGoals}
        setShortTermGoals={setShortTermGoals}
        handleSaveGoals={handleSaveGoals}
      />
    </div>
  );
};

export default Dashboard;
