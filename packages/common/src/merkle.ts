import { MerkleTree } from "merkletreejs";
import { encodePacked, keccak256 } from "viem";
import { NULL_ADDRESS } from "./constants";

export function getMerkleRoot(unhashedLeaves: AirdropLeaf[]) {
  const tree = getMerkleTree({ unhashedLeaves });
  return "0x" + tree.getRoot().toString("hex");
}

export type AirdropLeaf = {
  index: number;
  address: `0x${string}`;
  amount: string;
};

export function getMerkleProof({
  unhashedLeaves,
  index,
  address,
  amount,
}: {
  unhashedLeaves: AirdropLeaf[];
  index: number;
  address: `0x${string}`;
  amount: string;
}) {
  const tree = getMerkleTree({ unhashedLeaves });
  const hashedData = keccak256(
    encodePacked(
      ["uint256", "address", "uint256"],
      [BigInt(index), address, BigInt(amount)],
    ),
  );
  return tree.getHexProof(hashedData);
}

function getMerkleTree({ unhashedLeaves }: { unhashedLeaves: AirdropLeaf[] }) {
  const hashedLeaves = (
    unhashedLeaves.length === 1
      ? [...unhashedLeaves, { address: NULL_ADDRESS, amount: "0", index: 0 }]
      : unhashedLeaves
  ).map(({ index, address, amount }) =>
    keccak256(
      encodePacked(
        ["uint256", "address", "uint256"],
        [BigInt(index), address, BigInt(amount)],
      ),
    ),
  );

  return new MerkleTree(hashedLeaves, keccak256, { sortPairs: true });
}

export function validateProof({
  proof,
  root,
  leaf,
}: {
  proof: string[];
  root: string;
  leaf: AirdropLeaf;
}) {
  const hashedLeaf = keccak256(
    encodePacked(
      ["uint256", "address", "uint256"],
      [BigInt(leaf.index), leaf.address, BigInt(leaf.amount)],
    ),
  );
  return MerkleTree.verify(proof, hashedLeaf, root, keccak256, {
    sortPairs: true,
  });
}
