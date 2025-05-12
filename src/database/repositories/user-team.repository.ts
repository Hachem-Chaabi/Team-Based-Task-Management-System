import { UserTeam } from '../../../generated/prisma';
import { prisma } from '../config';

type PagingObj = {
  limit?: number;
  page?: number;
};

type QueryObj = {
  [key: string]: any;
};

// Get all with pagination, filtering, sorting
const getAll = async (paging: PagingObj = {}, query: QueryObj = {}) => {
  const page = paging.page || 1;
  const limit = paging.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {
    ...(query.search
      ? {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.userTeam.findMany({
      where,
      skip,
      take: limit,
      orderBy: query.sort ? { [query.sort]: query.order === 'asc' ? 'asc' : 'desc' } : undefined,
      select: {
        user: true,
        team: true,
      },
    }),
    prisma.userTeam.count({ where }),
  ]);

  return {
    docs: items,
    totalDocs: total,
    limit,
    page,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
};

const getById = async (userId: string, teamId: string, select: object = {}) => {
  return prisma.userTeam.findUnique({
    where: { userId_teamId: { userId, teamId } },
    select: Object.keys(select).length ? select : undefined,
  });
};

const getByQuery = async (where: QueryObj, select: object = {}) => {
  return prisma.userTeam.findMany({
    where,
    select: Object.keys(select).length ? select : undefined,
  });
};

const getOneByQuery = async (where: QueryObj, select: object = {}) => {
  return prisma.userTeam.findFirst({
    where,
    select: Object.keys(select).length ? select : undefined,
  });
};

const create = async (data: UserTeam) => {
  return prisma.userTeam.create({
    data,
    select: {
      user: true,
      team: true,
    },
  });
};

const remove = async (userId: string, teamId: string) => {
  return prisma.userTeam.delete({
    where: { userId_teamId: { userId, teamId } },
  });
};

export default {
  getAll,
  getById,
  getByQuery,
  getOneByQuery,
  create,
  remove,
};
