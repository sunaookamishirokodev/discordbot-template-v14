const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
    log: ["info"],
});

prisma.$connect();

module.exports = prisma;

