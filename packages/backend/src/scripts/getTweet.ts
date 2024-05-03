const TWEET_ID = "1786370975501554161";

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

  console.log(data.data[0].note_tweet);
}

getTweet();
