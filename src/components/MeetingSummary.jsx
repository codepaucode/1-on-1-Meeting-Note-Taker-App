import React, { useState, useEffect } from 'react';
import { summarizeText } from '../services/sharpApiClient';
import emailjs from 'emailjs-com';
import { useAuth } from '../context/AuthContext';
import './MeetingSummary.css';

const MeetingSummary = ({ meetingNotes, actionItems, setSummary, userName, meetingDate, initialSummary, isSummaryButtonDisabled }) => {
  const [localSummary, setLocalSummary] = useState(initialSummary || ''); // Local state for the summary text
  const [isLoading, setIsLoading] = useState(false); // Loading state for the summary generation
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const { currentUser } = useAuth(); // Get current user from auth context

  useEffect(() => {
    setLocalSummary(initialSummary || ''); // Reset the summary when the initial summary changes
  }, [initialSummary]);

  // Handle click for the summary generation button
  const handleClick = () => {
    if (isSummaryButtonDisabled) {
      alert("Please select a date first.");
    }
  };

  // Function to generate the meeting summary
  const generateSummary = async () => {
    if (isSummaryButtonDisabled) {
      alert("Please select a date first.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const notes = meetingNotes.trim();

      if (!notes) {
        alert("There is no content to summarize.");
        setIsLoading(false);
        return;
      }

    // Wait for summarized notes from API and then append Action Items and Date of Meeting for the final output of the summary generator
      const summarizedText = await summarizeText(notes);

      let actionItemsSummary = '';
      if (actionItems.length > 0) {
        actionItemsSummary = '\n\nAction Items:\n\nHere are the key action items discussed during the meeting:\n\n';
        actionItemsSummary += actionItems.map((item, index) => `${index + 1}. ${item.text}`).join('\n');
      } else {
        actionItemsSummary = '\n\nNo specific action items were discussed during this meeting.';
      }

      const finalSummary = `Date of the Meeting: ${meetingDate}\n\n${summarizedText}\n\n${actionItemsSummary}`;

      setLocalSummary(finalSummary); // Update local summary state
      setSummary(finalSummary); // Update parent component's summary state
    } catch (error) {
      if (error.message === 'API limit reached') {
        setErrorMessage('You have reached the API limit. Please try again later.');
      } else {
        console.error('Failed to generate summary:', error);
        setErrorMessage('An error occurred while generating the summary. Please try again.');
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Function to send the summary via email
  const sendEmail = (e) => {
    e.preventDefault();

    //Initialize variables that will be used in the html template of emailJS (to send personalized emails)
    const templateParams = {
      message: localSummary,
      my_name: userName,
      to_email: e.target.to_email.value,
      from_email: currentUser.email,
    };

    // Using environment variables for email service configuration
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;


    //cheking of email sending status
    emailjs.send(serviceId, templateId, templateParams, userId)
      .then((result) => {
        console.log(result.text);
        alert('Email sent successfully!');
      }, (error) => {
        console.log(error.text);
        setErrorMessage('An error occurred while sending the email. Please try again.');
      });
  };

  return (
    <div className="meeting-summary">
      <h2>Send Meeting Summary</h2>
      <button onClick={generateSummary} disabled={isLoading || isSummaryButtonDisabled}>
        {isLoading ? 'Generating...' : 'Generate Summary'} 
      </button> 
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={sendEmail}>
        <textarea
          name="message"
          value={localSummary}
          onChange={(e) => setLocalSummary(e.target.value)}
          onClick={handleClick}
          placeholder="Modify your meeting summary here"
        />
        <div className="form-group">
          <button type="submit">Send Email</button>
          <input type="email" name="to_email" placeholder="Supervisor's Email" required />
        </div>
      </form>
    </div>
  );
};

export default MeetingSummary;
