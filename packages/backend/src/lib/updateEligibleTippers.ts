import { getEligibleTippers } from "./getEligibleTippers";

export async function updateEligibleTippers() {
  const tippers = await getEligibleTippers();

  console.log("tippers", tippers.length);
}

updateEligibleTippers();
