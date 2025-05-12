import { TeamProject } from '../../../generated/prisma';
import { ErrorHandler } from '../../utils/errorHandler';
import { HttpCode } from '../../utils/httpCode';

import teamProjectRepository from '../../database/repositories/team-project.repository';

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
  } = await teamProjectRepository.getAll(options, { search: name });

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

const getById = async (teamId: string, projectId: string) => {
  // get item by options
  const teamProject = await teamProjectRepository.getById(teamId, projectId, {
    team: true,
    project: true,
  });

  // throw error if item not found
  if (!teamProject) {
    throw new ErrorHandler('team-project not found!', HttpCode.NOT_FOUND);
  }

  // return data
  return teamProject;
};

const create = async (item: TeamProject) => {
  // set current authenticated userId to item
  const createdTeamProject = await teamProjectRepository.create(item);

  // return data
  return createdTeamProject;
};

const remove = async (teamId: string, projectId: string) => {
  // get item by options
  const teamProject = await teamProjectRepository.getById(teamId, projectId);

  // throw error if item not found
  if (!teamProject) {
    throw new ErrorHandler('team-project not found!', HttpCode.NOT_FOUND);
  }

  // remove item
  await teamProjectRepository.remove(teamId, projectId);

  // return data
  return teamProject;
};

export default {
  getAll,
  getById,
  create,
  remove,
};
