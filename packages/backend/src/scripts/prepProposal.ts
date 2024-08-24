import { Interface, parseUnits } from "ethers";

function prepProposal() {
  const iface = new Interface(["function transfer(address,uint256)"]);

  const calldata = iface.encodeFunctionData("transfer(address,uint256)", [
    "0xCa27037CeD432fadF54Dee9bC210DfD5ab2F13C8",
    parseUnits("1", 18),
  ]);

  console.log(calldata);
}

prepProposal();
