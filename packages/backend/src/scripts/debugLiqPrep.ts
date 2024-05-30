import { getLpAccounts } from "../utils/getLpAccounts";
import { formatNum } from "../utils/helpers";

const rawLeafData = [
  {
    index: 0,
    address: "0xeb58973193e82bf1f9d2bd6a93d68b98f9faccd8",
    amount: "40268209098613352854075",
  },
  {
    index: 1,
    address: "0x73726d9a79324888f7964d96171db1e0a7dc4266",
    amount: "5065634497568025127955",
  },
  {
    index: 2,
    address: "0xa8d04cd4e1951291740ef977d56336fdc7f394c5",
    amount: "173244624727710050120",
  },
  {
    index: 3,
    address: "0x6d0b3a3f613a65c9f9ac6809730d18ff709eb1d3",
    amount: "1058940592802724397620",
  },
  {
    index: 4,
    address: "0x605e05bf092ebd18e06d1b0f699df5b9dd85d452",
    amount: "7091838606845114052750",
  },
  {
    index: 5,
    address: "0x0ca85b489a1276ef7042f1d032d0ef3831eaf4ca",
    amount: "9108868531973701904250",
  },
  {
    index: 6,
    address: "0x002748db885d4ccfe3c7c92143f0805f4ebeec01",
    amount: "178031449055253906675",
  },
  {
    index: 7,
    address: "0xeecd97c0b9261aa1a52c3f982d828229dfb2ad20",
    amount: "21555643320843643950785",
  },
  {
    index: 8,
    address: "0x103ac82daf13da683f6251dc0c5008198fb2a402",
    amount: "1206051551150810965170",
  },
  {
    index: 9,
    address: "0x1b9ad081e4a94fbb566486f3d86f97a1da1c94b0",
    amount: "4382081430500269020980",
  },
  {
    index: 10,
    address: "0xe7d4191eb35870f5830b270dbc5f32ae64a9b78e",
    amount: "25124303527357583938490",
  },
  {
    index: 11,
    address: "0x12789c79ad0499cd9b93ae56d402c4ce4840b270",
    amount: "24626852451310917386950",
  },
  {
    index: 12,
    address: "0x1db6ad3344f1ae0a495b28b031b80cddd99f2fd0",
    amount: "21088161677029829587885",
  },
  {
    index: 13,
    address: "0x80dc27f34321223d4b4efb07de80894c35189d89",
    amount: "9899955270374252901965",
  },
  {
    index: 14,
    address: "0x795050decc0322567c4f0098209d4edc5a69b9d0",
    amount: "21104337491572216443280",
  },
  {
    index: 15,
    address: "0x403089b876128b97012aee31e3f91b4f6cfebede",
    amount: "13873297716827538559240",
  },
  {
    index: 16,
    address: "0x915b472dfa70c8fe9d074a8c859089c44252d6b8",
    amount: "8179297554879050333960",
  },
  {
    index: 17,
    address: "0x7e3a74ab669d4c5f411940e97d1c29db3d39e950",
    amount: "5341632531994396660495",
  },
  {
    index: 18,
    address: "0xb5e2e5f376c61f40485bbc11d5dc56609c2c0db3",
    amount: "412520892212471212355",
  },
  {
    index: 19,
    address: "0xe9dadd9ded105d67e6cb7aadc48be0c2d45df652",
    amount: "96375354772920735856830",
  },
  {
    index: 20,
    address: "0x4888c0030b743c17c89a8af875155cf75dcfd1e1",
    amount: "4619492193346783127128525",
  },
  {
    index: 21,
    address: "0x8cf7f8a2eb9cbf7a01dfb89f45951de4fb421d27",
    amount: "50774600017770561193215",
  },
  {
    index: 22,
    address: "0x74fa01a5d0ef8039f1e14f4d4c8f90e8602e07b4",
    amount: "15563584702190688503900",
  },
  {
    index: 23,
    address: "0x9fdfa6d223e4c81db51eec32a82e9524ea00467f",
    amount: "1699290074927774249780",
  },
  {
    index: 24,
    address: "0x1cf41ad63f67f3e7f8a1db240d812f5392b9a9c4",
    amount: "3967911030219973038300",
  },
  {
    index: 25,
    address: "0x91942026918fd219c6b62f739c4dab80dd6673b6",
    amount: "6033401750473446394525",
  },
  {
    index: 26,
    address: "0xcc64cde5f401404063066a8d63857b2354cb3d9c",
    amount: "48626732095855467175",
  },
  {
    index: 27,
    address: "0xc945795c0eaab92fd63ce49d70b61d77b84f52ca",
    amount: "28239469947126675333130",
  },
  {
    index: 28,
    address: "0xb6079178b306d2454bad91756143b772ad1f1944",
    amount: "721902105707366188635",
  },
  {
    index: 29,
    address: "0x60762ca831753d71929b4488d49392cf88e5f350",
    amount: "22797739952257804599190",
  },
  {
    index: 30,
    address: "0xb412f82383d0f9a97e3be04598ea79cd4af96d51",
    amount: "444472373565423820255",
  },
  {
    index: 31,
    address: "0xb46adfe7e10675b1e43f9132da7f00a9ad3642f3",
    amount: "1414684220840184045400",
  },
  {
    index: 32,
    address: "0x32a6f3de4d2610ec943b6c20ac3341b30dc18d23",
    amount: "12920011073081077191185",
  },
  {
    index: 33,
    address: "0xf4844a06d4f995c4c03195afcb5aa59dcbb5b4fc",
    amount: "64792615563475574457810",
  },
  {
    index: 34,
    address: "0xd958bbefb7513b083a74962e49f759745f36b008",
    amount: "2050407039569443181305",
  },
  {
    index: 35,
    address: "0x3d7863e87afd6cc4bb584c3d07f5deeaa6d26802",
    amount: "18713705844618936090695",
  },
];

async function main() {
  const addresses = rawLeafData.map((leaf) => leaf.address);
  const accounts = await getLpAccounts(addresses);

  accounts.forEach((account, i) => {
    const leaf = rawLeafData.find(
      (leaf) => leaf.address.toLowerCase() === account.id.toLowerCase(),
    );

    const diff =
      (account.rewardsClaimed + account.rewardsUnclaimed) * BigInt(5) -
      BigInt(leaf.amount);

    console.log({ account, amount: leaf.amount, diff: formatNum(diff) });
  });
}

main();
