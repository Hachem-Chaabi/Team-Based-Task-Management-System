import { PrismaClient } from '../../generated/prisma';
import logger from '../utils/logger';

const prisma = new PrismaClient();

const connection = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL Database connected successfully using Prisma');
  } catch (error: any) {
    logger.error('❌ Connection Error =>', error);
    process.exit(1);
  }
};

export { prisma, connection };