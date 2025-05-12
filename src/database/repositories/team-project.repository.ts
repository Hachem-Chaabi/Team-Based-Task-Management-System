import { TeamProject } from '../../../generated/prisma';
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
    prisma.teamProject.findMany({
      where,
      skip,
      take: limit,
      orderBy: query.sort ? { [query.sort]: query.order === 'asc' ? 'asc' : 'desc' } : undefined,
      select: {
        team: true,
        project: true,
      },
    }),
    prisma.teamProject.count({ where }),
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

const getById = async (teamId: string, projectId: string, select: object = {}) => {
  return prisma.teamProject.findUnique({
    where: { teamId_projectId: { teamId, projectId } },
    select: Object.keys(select).length ? select : undefined,
  });
};

const getByQuery = async (where: QueryObj, select: object = {}) => {
  return prisma.teamProject.findMany({
    where,
    select: Object.keys(select).length ? select : undefined,
  });
};

const getOneByQuery = async (where: QueryObj, select: object = {}) => {
  return prisma.teamProject.findFirst({
    where,
    select: Object.keys(select).length ? select : undefined,
  });
};

const create = async (data: TeamProject) => {
  return prisma.teamProject.create({
    data,
    select: {
      team: true,
      project: true,
    },
  });
};

const remove = async (teamId: string, projectId: string) => {
  return prisma.teamProject.delete({
    where: { teamId_projectId: { teamId, projectId } },
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
