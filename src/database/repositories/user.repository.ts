import { User } from '../../../generated/prisma';
import { DAY_IN_MILLISECOND } from '../../constants/constants';
import { prisma } from '../config';

const getAll = async () => {
  const res = await prisma.user.findMany();
  return res;
};

const getById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

const getByQuery = async (options: object) => {
  const user = await prisma.user.findMany({
    where: options,
  });
  return user;
};

const getOneByQuery = async (options: object) => {
  const user = await prisma.user.findFirst({
    where: options,
  });
  return user;
};

const create = async (item: User) => {
  const user = await prisma.user.create({
    data: item,
  });
  return user;
};

const edit = async (id: string, item: object) => {
  const user = await prisma.user.update({
    where: { id },
    data: item,
  });
  return user;
};

const remove = async (id: string) => {
  const user = await prisma.user.delete({
    where: { id },
  });
  return user;
};

// Sessions
const createSession = async (userId: string, refreshToken: string) => {
  const session = await prisma.session.create({
    data: {
      userId,
      refreshToken,
      expiresAt: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRES_TIME) * DAY_IN_MILLISECOND,
      ),
    },
  });

  return session;
};

const getSession = async (refreshToken: string) => {
  const session = await prisma.session.findFirst({
    where: { refreshToken, expiresAt: { gt: new Date() } },
  });

  return session;
};

const deleteSession = async (options: object) => {
  await prisma.session.deleteMany({ where: options });
};

export default {
  getAll,
  getById,
  getByQuery,
  getOneByQuery,
  create,
  edit,
  remove,
  createSession,
  getSession,
  deleteSession
};
