import { Project } from '../../../generated/prisma';
import { ErrorHandler } from '../../utils/errorHandler';
import { HttpCode } from '../../utils/httpCode';

import projectRepository from '../../database/repositories/project.repository';

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
  } = await projectRepository.getAll(options, { search: name });

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
  const team = await projectRepository.getById(id);

  // throw error if item not found
  if (!team) {
    throw new ErrorHandler('team not found!', HttpCode.NOT_FOUND);
  }

  // return data
  return team;
};

const create = async (userId: string, item: Project) => {
  // set current authenticated userId to item
  const createdTeam = await projectRepository.create({...item, createdBy: userId});

  // return data
  return createdTeam;
};

const edit = async (id: string, item: Project, userId: string) => {
  // get item by options
  const team = (await projectRepository.getById(id)) as Project | null;

  // throw error if item not found
  if (!team) {
    throw new ErrorHandler('team not found!', HttpCode.NOT_FOUND);
  }

  // update item
  const updatedTeam = await projectRepository.edit(id, item);

  // return data
  return updatedTeam;
};

const remove = async (id: string) => {
  // get item by options
  const team = await projectRepository.getById(id);

  // throw error if item not found
  if (!team) {
    throw new ErrorHandler('team not found!', HttpCode.NOT_FOUND);
  }

  // remove item
  await projectRepository.remove(id);

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
