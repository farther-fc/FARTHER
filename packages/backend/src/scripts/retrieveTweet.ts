const TWEET_ID = "1785864050670473496";

const twitterConfig = {
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
  },
};

async function retrieveTweet() {
  const response = await fetch(
    `https://api.twitter.com/2/tweets?ids=${TWEET_ID}&tweet.fields=text,author_id`,
    twitterConfig,
  );

  const data = await response.json();

  console.log(data);
}

retrieveTweet();
