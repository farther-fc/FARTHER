const TWEET_ID = "1785821659406225812";

const twitterConfig = {
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
  },
};

async function getTweet() {
  const response = await fetch(
    `https://api.twitter.com/2/tweets?ids=${TWEET_ID}&tweet.fields=text,author_id,note_tweet`,
    twitterConfig,
  );

  const data = await response.json();

  // For tweets longer than 280 chars, this contains the full text
  const noteTweet = data.data[0].note_tweet;
  const tweetText = noteTweet.text || (data.data[0].text as string);
}

getTweet();
