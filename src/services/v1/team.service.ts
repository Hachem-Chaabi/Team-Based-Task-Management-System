import { Team } from '../../../generated/prisma';
import { ErrorHandler } from '../../utils/errorHandler';
import { HttpCode } from '../../utils/httpCode';

import teamRepository from '../../database/repositories/team.repository';

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
  } = await teamRepository.getAll(options, { search: name });

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

const getById = async (userId: string, id: string) => {
  // get item by options
  const team = await teamRepository.getById(id);

  // throw error if item not found
  if (!team) {
    throw new ErrorHandler('team not found!', HttpCode.NOT_FOUND);
  }

  // return data
  return team;
};

const create = async (userId: string, item: Team) => {
  // set current authenticated userId to item
  const createdTeam = await teamRepository.create(item);

  // return data
  return createdTeam;
};

const edit = async (id: string, item: Team, userId: string) => {
  // get item by options
  const team = (await teamRepository.getById(id)) as Team | null;

  // throw error if item not found
  if (!team) {
    throw new ErrorHandler('team not found!', HttpCode.NOT_FOUND);
  }

  // update item
  const updatedTeam = await teamRepository.edit(id, item);

  // return data
  return updatedTeam;
};

const remove = async (id: string) => {
  // get item by options
  const team = await teamRepository.getById(id);

  // throw error if item not found
  if (!team) {
    throw new ErrorHandler('team not found!', HttpCode.NOT_FOUND);
  }

  // remove item
  await teamRepository.remove(id);

  // return data
  return team;
};

export default {
  getAll,
  getById,
  create,
  edit,
  remove,
};
