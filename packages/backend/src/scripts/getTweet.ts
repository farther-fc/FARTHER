const TWEET_ID = "1787897650932822451";

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

  if (!data.data || !data.data.length) {
    throw new Error("No data returned from Twitter API");
  }

  // For tweets longer than 280 chars, this contains the full text
  const noteTweet = data.data[0].note_tweet;
  const tweetText =
    (noteTweet && noteTweet.text) || (data.data[0].text as string);

  const authorId = data.data[0].author_id as string;

  // Fetch user's follower count
  const twitterResponse = await fetch(
    `https://api.twitter.com/2/users/${authorId}?user.fields=public_metrics`,
    twitterConfig,
  );

  const json = await twitterResponse.json();

  const followerCount =
    (json &&
      json.data &&
      (json.data.public_metrics.followers_count as number)) ||
    0;

  console.info({ authorId, tweetText, followerCount });
}

getTweet();
