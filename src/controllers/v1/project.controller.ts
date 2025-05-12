import { Response, Request, RequestHandler } from 'express';
import AsyncHandler from 'express-async-handler';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants/constants';
import ProjectService from '../../services/v1/project.service';
import { HttpCode } from '../../utils/httpCode';

// @desc    Get All
// @route   GET /api/projects
// @access  Private
const getAll: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, page, pageSize } = req?.query;
  const result = await ProjectService.getAll(
    req?.user?.id,
    String(name || ''),
    Number(page || DEFAULT_CURRENT_PAGE),
    Number(pageSize || DEFAULT_PAGE_SIZE),
  );
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Get By Id
// @route   GET /api/projects/:id
// @access  Private
const getById: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req?.params;
  const result = await ProjectService.getById(req?.user?.id, id);
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Create
// @route   POST /api/projects
// @access  Private
const create: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await ProjectService.create(req?.user?.id, req?.body);
  res.status(HttpCode.CREATED).json({
    success: true,
    message: 'Project created successfully',
    data: result,
  });
});

// @desc    Update
// @route   PUT /api/projects/:id
// @access  Private
const edit: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req?.params;
  const result = await ProjectService.edit(id, req?.body, req?.user?.id);
  res.status(HttpCode.OK).json({
    success: true,
    message: 'Project updated successfully',
    data: result,
  });
});

// @desc    Delete
// @route   DELETE /api/projects/:id
// @access  Private
const remove: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req?.params;
  const result = await ProjectService.remove(id);
  res.status(HttpCode.OK).json({
    success: true,
    message: 'Project deleted successfully',
    data: result,
  });
});

export default {
  getAll,
  getById,
  create,
  edit,
  remove
};