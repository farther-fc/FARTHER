import { keccak256, toBytes } from "viem";

export function dummyCast({
  tipperFid,
  tippeeFid,
  amount,
  createdAtSeconds,
}: {
  tipperFid: number;
  tippeeFid: number;
  amount: number;
  createdAtSeconds?: number;
}) {
  return {
    created_at: createdAtSeconds || getTimeStamp(),
    data: {
      object: "cast",
      hash: keccak256(toBytes(new Date().getTime().toString())),
      thread_hash: "0xa445f43421a4deda275a75bb86cdbcde343ce311",
      parent_hash: "0xa445f43421a4deda275a75bb86cdbcde343ce311",
      parent_url: null,
      root_parent_url:
        "chain://eip155:1/erc721:0xc18f6a34019f5ba0fc5bc8cb6fe52e898d6bbbee",
      parent_author: { fid: tippeeFid },
      author: {
        object: "user",
        fid: tipperFid,
        custody_address: "0xe16384f1c89730785477d7027f61c55d578a18c7",
        username: "farther",
        display_name: "Farther✨",
        pfp_url:
          "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/54e5fe29-73b3-4bb9-da86-4149dcfeac00/original",
        profile: { bio: [null] },
        follower_count: 3170,
        following_count: 171,
        verifications: ["0x97e3b75b2eebcc722b504851416e1410b32180a3"],
        verified_addresses: { eth_addresses: [null], sol_addresses: [] },
        active_status: "inactive",
        power_badge: true,
      },
      text: `${amount} $ftest`,
      timestamp: "2024-05-31T01:35:59.000Z",
      embeds: [],
      reactions: {
        likes_count: 0,
        recasts_count: 0,
        likes: [],
        recasts: [],
      },
      replies: { count: 0 },
      mentioned_profiles: [],
    } as const,
  } as const;
}

function getTimeStamp() {
  return Math.floor(new Date().getTime() / 1000);
}
