const API_URL = "http://localhost:3000/api/v1/public.tips.leaderboard"; // Replace with your API URL
const TOTAL_REQUESTS = 10; // Total number of requests to send
const DELAY_MS = 20; // Delay between requests in milliseconds

async function sendRequest(index: number) {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(`Request ${index + 1}: Status ${response.status}`);
  } catch (error: any) {
    console.error(`Request ${index + 1} failed:`, error.message);
  }
}

async function runTest() {
  console.log(`Sending ${TOTAL_REQUESTS} requests to ${API_URL}`);

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    await sendRequest(i);
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }
}

runTest();
