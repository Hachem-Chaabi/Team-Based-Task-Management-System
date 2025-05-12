import { User } from '../../../generated/prisma';
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

export default {
  getAll,
  getById,
  getByQuery,
  getOneByQuery,
  create,
  edit,
  remove,
};
