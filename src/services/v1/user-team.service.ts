import { UserTeam } from '../../../generated/prisma';
import { ErrorHandler } from '../../utils/errorHandler';
import { HttpCode } from '../../utils/httpCode';

import userTeamRepository from '../../database/repositories/user-team.repository';

const getAll = async (userId: string, name: string, page: number, pageSize: number) => {
  // create options object to filter data
  const options = {
    page,
    limit: pageSize,
  };

  // get docs and meta
  const {
    docs,
    totalDocs,
    limit,
    page: currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = await userTeamRepository.getAll(options, { search: name });

  const meta = {
    totalDocs,
    page: currentPage,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };

  // return data
  return { docs, meta };
};

const getById = async (userId: string, teamId: string) => {
  // get item by options
  const userTeam = await userTeamRepository.getById(userId, teamId, {
    user: true,
    team: true,
  });

  // throw error if item not found
  if (!userTeam) {
    throw new ErrorHandler('team-project not found!', HttpCode.NOT_FOUND);
  }

  // return data
  return userTeam;
};

const create = async (item: UserTeam) => {
  // set current authenticated userId to item
  const createdUserTeam = await userTeamRepository.create(item);

  // return data
  return createdUserTeam;
};

const remove = async (userId: string, teamId: string) => {
  // get item by options
  const userTeam = await userTeamRepository.getById(userId, teamId);

  // throw error if item not found
  if (!userTeam) {
    throw new ErrorHandler('user-team not found!', HttpCode.NOT_FOUND);
  }

  // remove item
  await userTeamRepository.remove(userId, teamId);

  // return data
  return userTeam;
};

export default {
  getAll,
  getById,
  create,
  remove,
};
