import { Response, Request, RequestHandler } from 'express';
import AsyncHandler from 'express-async-handler';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants/constants';
import UserTeamService from '../../services/v1/user-team.service';
import { HttpCode } from '../../utils/httpCode';

// @desc    Get All
// @route   GET /api/users-teams
// @access  Private
const getAll: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, page, pageSize } = req?.query;
  const result = await UserTeamService.getAll(
    req?.user?.id,
    String(name || ''),
    Number(page || DEFAULT_CURRENT_PAGE),
    Number(pageSize || DEFAULT_PAGE_SIZE),
  );
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Get By Id
// @route   GET /api/users-teams/:userId/:teamId
// @access  Private
const getById: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId, teamId } = req?.params;
  const result = await UserTeamService.getById(userId, teamId);
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Create
// @route   POST /api/users-teams
// @access  Private
const create: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await UserTeamService.create(req?.body);
  res.status(HttpCode.CREATED).json({
    success: true,
    message: 'User-Team created successfully',
    data: result,
  });
});

// @desc    Delete
// @route   DELETE /api/users-teams
// @access  Private
const remove: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId, teamId } = req?.params;
  const result = await UserTeamService.remove(userId, teamId);
  res.status(HttpCode.OK).json({
    success: true,
    message: 'User-Team deleted successfully',
    data: result,
  });
});

export default {
  getAll,
  getById,
  create,
  remove,
};
