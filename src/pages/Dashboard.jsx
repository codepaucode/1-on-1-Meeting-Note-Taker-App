import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ActionItems from "../components/ActionItems";
import MeetingNotes from "../components/MeetingNotes";
import MeetingSummary from "../components/MeetingSummary";
import MeetingTemplate from "../components/MeetingTemplate";
import Sidebar from "../components/Sidebar";
import GoalsSidebar from "../components/GoalsSidebar";
import { saveMeetingData, loadMeetingData, deleteMeetingData, saveGoalsData, loadGoalsData } from "../services/firebase";
import { useMeetingContext } from "../context/MeetingContext";
import './Dashboard.css';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const { setSelectedCategory } = useMeetingContext();
    const [selectedDate, setSelectedDate] = useState("");
    const [savedMeetings, setSavedMeetings] = useState({});
    const [meetingData, setMeetingData] = useState({
        selectedCategory: '',
        meetingNotes: '',
        actionItems: [],
        summary: '',
    });
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    // State for goals
    const [longTermGoals, setLongTermGoals] = useState('');
    const [shortTermGoals, setShortTermGoals] = useState('');

    useEffect(() => {
        if (currentUser) {
            loadSavedMeetings();
            loadGoals();
        }
    }, [currentUser]);

    useEffect(() => {
        if (selectedDate && savedMeetings[selectedDate]) {
            setMeetingData(savedMeetings[selectedDate]);
            setSelectedCategory(savedMeetings[selectedDate].selectedCategory || '');
            setUnsavedChanges(false); // No unsaved changes since we loaded a saved meeting
        } else {
            setMeetingData({
                selectedCategory: '',
                meetingNotes: '',
                actionItems: [],
                summary: '', 
            });
            setSelectedCategory('');
        }
    }, [selectedDate, savedMeetings, setSelectedCategory]);

    const loadSavedMeetings = async () => {
        try {
            const meetings = await loadMeetingData(currentUser.uid);
            setSavedMeetings(meetings);
        } catch (error) {
            console.error("Error loading saved meetings:", error);
        }
    };

    const loadGoals = async () => {
        try {
            const goals = await loadGoalsData(currentUser.uid);
            setLongTermGoals(goals.longTermGoals);
            setShortTermGoals(goals.shortTermGoals);
        } catch (error) {
            console.error("Error loading goals data:", error);
        }
    };

    const handleSaveMeeting = async () => {
        if (!selectedDate) {
            alert('Please select a date to save the meeting.');
            return;
        }

        try {
            await saveMeetingData(currentUser.uid, selectedDate, meetingData);
            alert('Meeting saved successfully!');
            setUnsavedChanges(false); // Reset unsaved changes flag after saving
            loadSavedMeetings();
        } catch (error) {
            console.error("Error saving meeting:", error);
            alert('Failed to save the meeting. Please try again.');
        }
    };

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
                setSelectedDate("");
                setMeetingData({
                    selectedCategory: '',
                    meetingNotes: '',
                    actionItems: [],
                    summary: '',
                });
                setSelectedCategory('');
                setUnsavedChanges(false); // Reset unsaved changes flag after deleting
                loadSavedMeetings();
            } catch (error) {
                console.error("Error deleting meeting:", error);
                alert('Failed to delete the meeting. Please try again.');
            }
        }
    };

    const handleSaveGoals = async () => {
        try {
            await saveGoalsData(currentUser.uid, { longTermGoals, shortTermGoals });
            alert('Goals saved successfully!');
        } catch (error) {
            console.error("Error saving goals:", error);
            alert('Failed to save the goals. Please try again.');
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar
                savedMeetings={savedMeetings}
                onDateClick={(date) => {
                    if (unsavedChanges) {
                        const confirmSwitch = window.confirm("You have unsaved changes. Do you want to switch dates without saving?");
                        if (!confirmSwitch) {
                            return; // Cancel the date switch
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
                            currentUserEmail={currentUser.email} 
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
