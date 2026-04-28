import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const chatWithAI = async (message: string) => {
  if (!OPENAI_API_KEY) {
    console.error("OpenAI API Key is missing");
    return "I'm currently in offline mode. Please configure my brain!";
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful STEM Lab Assistant for Drishti RC Jain Innovative Public School. You are encouraging, knowledgeable about robotics, AI, and science, and speak in a way that is engaging for students from classes 2 to 10.' },
          { role: 'user', content: message }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return "Oops! I'm having trouble thinking right now. Maybe check the internet connection?";
  }
};
