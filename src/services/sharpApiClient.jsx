import axios from 'axios';

// Get the API key from environment variables
const apiKey = import.meta.env.VITE_APYHUB_API_KEY;

// Function to summarize text using an external API
export const summarizeText = async (text) => {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('Text content for summarization must be a non-empty string.');
  }

  try {
    // Send the text content to the API for summarization
    const response = await axios.post(
      'https://api.apyhub.com/sharpapi/api/v1/content/summarize',
      { // input template by sharpApi
        content: text,
        voice_tone: 'Serious', // Customize the tone as needed
        max_length: 500,        // Customize the max length as needed
        language: 'English',    // Specify the language
      },
      {
        headers: {
          'apy-token': apiKey, // API authentication token
          'Content-Type': 'application/json',
        },
      }
    );

    const { status_url } = response.data; // Get the URL to check the summarization status

    // Poll the status URL to get the summarization result
    let result = null;
    for (let i = 0; i < 5; i++) {
      const statusResponse = await axios.get(status_url, {
        headers: {
          'apy-token': apiKey,
        },
      });

      if (statusResponse.data && statusResponse.data.data && statusResponse.data.data.attributes.status === 'success') {
        result = statusResponse.data.data.attributes.result.summary; // Retrieve the summary result
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }

    if (!result) {
      throw new Error('Failed to retrieve summary after retries.');
    }

    return result; // Return the summarized text
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('API limit reached'); // Handle API limit error
    }
    console.error('Error summarizing text:', error.response?.data || error.message);
    throw error; // Re-throw the error for handling in the calling component
  }
};
