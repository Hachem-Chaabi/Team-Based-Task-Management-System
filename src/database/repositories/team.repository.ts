import { Team } from "../../../generated/prisma";
import { prisma } from "../config";


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
    prisma.team.findMany({
      where,
      skip,
      take: limit,
      orderBy: query.sort
        ? { [query.sort]: query.order === 'asc' ? 'asc' : 'desc' }
        : { createdAt: 'desc' },
    }),
    prisma.team.count({ where }),
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

const getById = async (id: string, select: object = {}) => {
  return prisma.team.findUnique({
    where: { id },
    select: Object.keys(select).length ? select : undefined,
  });
};

const getByQuery = async (where: QueryObj, select: object = {}) => {
  return prisma.team.findMany({
    where,
    select: Object.keys(select).length ? select : undefined,
  });
};

const getOneByQuery = async (where: QueryObj, select: object = {}) => {
  return prisma.team.findFirst({
    where,
    select: Object.keys(select).length ? select : undefined,
  });
};

const create = async (data: Team) => {
  return prisma.team.create({ data });
};

const edit = async (id: string, data: Team) => {
  return prisma.team.update({
    where: { id },
    data,
  });
};

const remove = async (id: string) => {
  return prisma.team.delete({ where: { id } });
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
