import React, { useState, useEffect } from 'react';
import { summarizeText } from '../services/sharpApiClient';
import emailjs from 'emailjs-com';
import { useAuth } from '../context/AuthContext';
import './MeetingSummary.css';

const MeetingSummary = ({ meetingNotes, actionItems, setSummary, userName, meetingDate, initialSummary, isSummaryButtonDisabled }) => {
    const [localSummary, setLocalSummary] = useState(initialSummary || '');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        setLocalSummary(initialSummary || '');
    }, [initialSummary]);

    const handleClick = () => {
        if (isSummaryButtonDisabled) {
            alert("Please select a date first.");
        }
    };

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

            const summarizedText = await summarizeText(notes);

            let actionItemsSummary = '';
            if (actionItems.length > 0) {
                actionItemsSummary = '\n\nAction Items:\n\nHere are the key action items discussed during the meeting:\n\n';
                actionItemsSummary += actionItems.map((item, index) => `${index + 1}. ${item.text}`).join('\n');
            } else {
                actionItemsSummary = '\n\nNo specific action items were discussed during this meeting.';
            }

            const finalSummary = `Date of the Meeting: ${meetingDate}\n\n${summarizedText}\n\n${actionItemsSummary}`;

            setLocalSummary(finalSummary);
            setSummary(finalSummary);
        } catch (error) {
            if (error.message === 'API limit reached') {
                setErrorMessage('You have reached the API limit. Please try again later.');
            } else {
                console.error('Failed to generate summary:', error);
                setErrorMessage('An error occurred while generating the summary. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const sendEmail = (e) => {
        e.preventDefault();

        const templateParams = {
            message: localSummary,
            my_name: userName,
            to_email: e.target.to_email.value,
            from_email: currentUser.email,
        };

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const userId = import.meta.env.VITE_EMAILJS_USER_ID;

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
