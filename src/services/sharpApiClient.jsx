import axios from 'axios';

const apiKey = import.meta.env.VITE_APYHUB_API_KEY;

export const summarizeText = async (text) => {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('Text content for summarization must be a non-empty string.');
  }

  try {
    // Submit the summarization job
    const response = await axios.post(
      'https://api.apyhub.com/sharpapi/api/v1/content/summarize',
      {
        content: text,
        voice_tone: 'Serious', // Customize as needed
        max_length: 500,        // Customize as needed
        language: 'English',    // Customize as needed
      },
      {
        headers: {
          'apy-token': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const { status_url } = response.data;

    // Polling the status URL to get the result
    let result = null;
    for (let i = 0; i < 5; i++) {
      const statusResponse = await axios.get(status_url, {
        headers: {
          'apy-token': apiKey,
        },
      });

      if (statusResponse.data && statusResponse.data.data && statusResponse.data.data.attributes.status === 'success') {
        result = statusResponse.data.data.attributes.result.summary;
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }

    if (!result) {
      throw new Error('Failed to retrieve summary after retries.');
    }

    return result;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('API limit reached');
    }
    console.error('Error summarizing text:', error.response?.data || error.message);
    throw error;
  }
};
