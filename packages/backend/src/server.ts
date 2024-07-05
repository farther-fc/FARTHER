import { prisma } from "./prisma";

(async () => {
  const user = await prisma.user.findFirst({ where: { id: 1 } });

  console.log(user);
})();
