import { Response, Request, RequestHandler } from 'express';
import AsyncHandler from 'express-async-handler';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants/constants';
import TaskService from '../../services/v1/task.service';
import { HttpCode } from '../../utils/httpCode';

// @desc    Get All
// @route   GET /api/tasks
// @access  Private
const getAll: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, page, pageSize } = req?.query;
  const result = await TaskService.getAll(
    req?.user?.id,
    String(name || ''),
    Number(page || DEFAULT_CURRENT_PAGE),
    Number(pageSize || DEFAULT_PAGE_SIZE),
  );
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Get By Id
// @route   GET /api/tasks/:id
// @access  Private
const getById: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req?.params;
  const result = await TaskService.getById(req?.user?.id, id);
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Create
// @route   POST /api/tasks
// @access  Private
const create: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await TaskService.create(req?.user?.id, req?.body);
  res.status(HttpCode.CREATED).json({
    success: true,
    message: 'Task created successfully',
    data: result,
  });
});

// @desc    Update
// @route   PUT /api/tasks/:id
// @access  Private
const edit: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req?.params;
  const result = await TaskService.edit(id, req?.body, req?.user?.id);
  res.status(HttpCode.OK).json({
    success: true,
    message: 'Task updated successfully',
    data: result,
  });
});

// @desc    Delete
// @route   DELETE /api/tasks/:id
// @access  Private
const remove: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req?.params;
  const result = await TaskService.remove(id);
  res.status(HttpCode.OK).json({
    success: true,
    message: 'Task deleted successfully',
    data: result,
  });
});

// @desc    Get All superAdmin Tasks
// @route   GET /api/superadmin/tasks
// @access  Private/superAdmin
const getAllSuperAdmin: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, page, pageSize } = req?.query;
    const result = await TaskService.getAllSuperAdmin(
      String(name || ''),
      Number(page || DEFAULT_CURRENT_PAGE),
      Number(pageSize || DEFAULT_PAGE_SIZE),
    );
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Get superAdmin Task By Id
// @route   GET /api/superadmin/tasks/:id
// @access  Private/superAdmin
const getByIdSuperAdmin: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await TaskService.getByIdSuperAdmin(id);
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Update superAdmin Task
// @route   PUT /api/superadmin/tasks/:id
// @access  Private/superAdmin
const editSuperAdmin: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await TaskService.editSuperAdmin(id, req?.body);
    res.status(HttpCode.OK).json({
      success: true,
      message: 'Task updated successfully',
      data: result,
    });
  },
);

// @desc    Delete superAdmin Task
// @route   DELETE /api/superadmin/tasks/:id
// @access  Private/superAdmin
const removeSuperAdmin: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await TaskService.removeSuperAdmin(id);
    res.status(HttpCode.OK).json({
      success: true,
      message: 'Task deleted successfully',
      data: result,
    });
  },
);

// @desc    Get User Tasks By superAdmin
// @route   GET /api/superadmin/users-tasks/:id
// @access  Private/superAdmin
const getAllUserTasksAdmin: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const { name, page, pageSize } = req?.query;
    const result = await TaskService.getAllUserTasksAdmin(
      id,
      String(name || ''),
      Number(page || DEFAULT_CURRENT_PAGE),
      Number(pageSize || DEFAULT_PAGE_SIZE),
    );
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

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
