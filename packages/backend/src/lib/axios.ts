import a from "axios";
import axiosRetry from "axios-retry";

// Configure axios to use retry logic
axiosRetry(a, {
  retries: 5,
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * 2000; // exponential backoff
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return (
      axiosRetry.isNetworkError(error) ||
      error.response?.status === 503 ||
      error.response?.status === 504
    );
  },
});

export const axios = a;
