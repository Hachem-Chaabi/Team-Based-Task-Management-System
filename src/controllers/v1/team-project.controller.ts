import { Response, Request, RequestHandler } from 'express';
import AsyncHandler from 'express-async-handler';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants/constants';
import TeamProjectService from '../../services/v1/team-project.service';
import { HttpCode } from '../../utils/httpCode';

// @desc    Get All
// @route   GET /api/teams-projects
// @access  Private
const getAll: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, page, pageSize } = req?.query;
  const result = await TeamProjectService.getAll(
    req?.user?.id,
    String(name || ''),
    Number(page || DEFAULT_CURRENT_PAGE),
    Number(pageSize || DEFAULT_PAGE_SIZE),
  );
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Get By Id
// @route   GET /api/teams-projects/:id
// @access  Private
const getById: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { teamId, projectId } = req?.params;
  const result = await TeamProjectService.getById(teamId, projectId);
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Create
// @route   POST /api/teams-projects
// @access  Private
const create: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await TeamProjectService.create(req?.body);
  res.status(HttpCode.CREATED).json({
    success: true,
    message: 'Team-Project created successfully',
    data: result,
  });
});

// @desc    Delete
// @route   DELETE /api/teams-projects/:id
// @access  Private
const remove: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { teamId, projectId } = req?.body;
  const result = await TeamProjectService.remove(teamId, projectId);
  res.status(HttpCode.OK).json({
    success: true,
    message: 'Team-Project deleted successfully',
    data: result,
  });
});

export default {
  getAll,
  getById,
  create,
  remove,
};
