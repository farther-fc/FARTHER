import { TOTAL_AIRDROP_SUPPLY, airdropConfig } from "@common/constants";

// Airdrop 1: 23% of airdrop supply
// 7 subsequent airdrops: 11% of of airdrop supply

export const CURRENT_AIRDROP_SUPPLY =
  TOTAL_AIRDROP_SUPPLY * airdropConfig.RATIO;

async function updatePendingRecipients() {
  // Fetch users from DB with unclaimed airdrop tokens
  // Check Neynar to see if ^those users have connected wallet
  // Check airdrop contract logs to see if they've claimed
  // Update database
}

// Calculate allocation per user for the *current* airdrop (new power users)
async function prepareNewRecipients() {
  // Fetch all power users Warpcast API.
  // Get users from DB who have been allocated airdrop tokens (claimed or unclaimed). Remove the matches from the previous step.
  // Check Neynar to see if ^those users have connected wallet
  // If any users are in filtered list...
  // Upsert Airdrop
  // Upsert User records (connected wallet address)
  // Create Allocation records
}

// TODO: Put this on an hourly cron
async function updateAirdropRecipients() {
  try {
    await updatePendingRecipients();
    await prepareNewRecipients();
  } catch (e) {
    console.error(e);
  }
}
