// This file acts as a serverless function proxy to bypass CORS issues with Google Apps Script.
// It assumes a Vercel-like hosting environment.

// The target URL of the Google Apps Script Web App
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6T6Nmx0L_72v5n9a-Z5etbXlA4s2-yVFLBwKllGshcg26W2R1-e2Lq8BtTqU2kE3wJQ/exec';

/**
 * Handles incoming requests and forwards them to the Google Apps Script.
 * @param {object} req - The incoming request object.
 * @param {object} res - The response object.
 */
export default async function handler(req, res) {
  // Handle GET requests (e.g., fetching voting tours)
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getVotingTours`);
      const data = await response.json();
      // Add caching to reduce requests to Google
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      res.status(200).json(data);
    } catch (error) {
      console.error('Proxy GET Error:', error);
      res.status(500).json({ error: 'Failed to fetch data from Google Script.' });
    }
  } 
  // Handle POST requests (e.g., submitting a vote)
  else if (req.method === 'POST') {
    try {
      const postResponse = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        redirect: 'follow' // Important for Google Script POST requests
      });
      const resultData = await postResponse.json();
      res.status(200).json(resultData);
    } catch (error) {
      console.error('Proxy POST Error:', error);
      res.status(500).json({ error: 'Failed to submit data to Google Script.' });
    }
  } 
  // Handle other methods
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 