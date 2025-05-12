import taskRepository from '../../database/repositories/task.repository';
import userRepository from '../../database/repositories/user.repository';
import { Task } from '../../../generated/prisma';
import { ErrorHandler } from '../../utils/errorHandler';
import { HttpCode } from '../../utils/httpCode';

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
  } = await taskRepository.getAll({ assignedTo: userId }, options, { search: name });

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
  const task = await taskRepository.getById(id);

  // throw error if item not found
  if (!task) {
    throw new ErrorHandler('task not found!', HttpCode.NOT_FOUND);
  }

  // return data
  return task;
};

const create = async (userId: string, item: Task) => {
  // set current authenticated userId to item
  const createdTask = await taskRepository.create({ ...item, assignedTo: userId });

  // return data
  return createdTask;
};

const edit = async (id: string, item: Task, userId: string) => {
  // get item by options
  const task = (await taskRepository.getById(id)) as Task | null;

  // throw error if item not found
  if (!task) {
    throw new ErrorHandler('task not found!', HttpCode.NOT_FOUND);
  }

  // update item
  const updatedTask = await taskRepository.edit(id, item);

  // return data
  return updatedTask;
};

const remove = async (id: string) => {
  // get item by options
  const task = await taskRepository.getById(id);

  // throw error if item not found
  if (!task) {
    throw new ErrorHandler('task not found!', HttpCode.NOT_FOUND);
  }

  // remove item
  await taskRepository.remove(id);

  // return data
  return task;
};

const getAllSuperAdmin = async (name: string, page: number, pageSize: number) => {
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
  } = await taskRepository.getAll({}, options, { search: name });

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

const getByIdSuperAdmin = async (id: string) => {
  // get item by id
  const todo = await taskRepository.getById(id);

  // throw error if item not found
  if (!todo) {
    throw new ErrorHandler('todo not found!', HttpCode.NOT_FOUND);
  }

  // return data
  return todo;
};

const editSuperAdmin = async (id: string, item: Task) => {
  // get item by id
  const todo = await taskRepository.getById(id);

  // throw error if item not found
  if (!todo) {
    throw new ErrorHandler('todo not found!', HttpCode.NOT_FOUND);
  }

  // update item
  const updatedTodo = await taskRepository.edit(id, item);

  // return data
  return updatedTodo;
};

const removeSuperAdmin = async (id: string) => {
  // get item by id
  const todo = await taskRepository.getById(id);

  // throw error if item not found
  if (!todo) {
    throw new ErrorHandler('todo not found!', HttpCode.NOT_FOUND);
  }

  // delete item
  await taskRepository.remove(id);

  // return data
  return todo;
};

const getAllUserTasksAdmin = async (
  userId: string,
  name: string,
  page: number,
  pageSize: number,
) => {
  // get user by his id
  const user = await userRepository.getById(userId);

  // throw error if user not found
  if (!user) {
    throw new ErrorHandler('user not found!', HttpCode.NOT_FOUND);
  }

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
  } = await taskRepository.getAll({ assignedTo: userId }, options, { search: name });

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

export default {
  getAll,
  getById,
  create,
  edit,
  remove,
  getAllSuperAdmin,
  getByIdSuperAdmin,
  editSuperAdmin,
  removeSuperAdmin,
  getAllUserTasksAdmin,
};
