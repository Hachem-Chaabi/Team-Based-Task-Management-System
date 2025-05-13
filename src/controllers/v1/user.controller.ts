import { Request, Response, RequestHandler } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';
import { DAY_IN_MILLISECOND, EnvironmentEnum } from '../../constants/constants';
import { HttpCode } from '../../utils/httpCode';

import AsyncHandler from 'express-async-handler';
import UserService from '../../services/v1/user.service';
import userService from '../../services/v1/user.service';

// @desc    Auth user & get token
// @route   POST /api/login
// @access  Public
const login: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req?.body;
  let result = await UserService.login(email.trim().toLowerCase(), password);
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE === EnvironmentEnum.prod,
    maxAge: Number(process.env.COOKIE_EXPIRES_TIME) * DAY_IN_MILLISECOND,
  });
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Register a new user
// @route   POST /api/register
// @access  Public
const register: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req?.body;

    const result = await UserService.register(name, email.trim().toLowerCase(), password);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE === EnvironmentEnum.prod,
      maxAge: Number(process.env.COOKIE_EXPIRES_TIME) * DAY_IN_MILLISECOND,
    });
    res.status(HttpCode.CREATED).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  },
);

// @desc    Logout user
// @route   GET /api/logout
// @access  Private
const logout: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await userService.deleteSession(refreshToken);
  }

  res.cookie('refreshToken', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE === EnvironmentEnum.prod,
  });

  res.status(HttpCode.OK).json({ success: true, message: 'Logged out', data: null });
});

// @desc    Get new access token
// @route   GET /api/refresh-token
// @access  Private
const refreshToken: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req?.body;

    if (!refreshToken) {
      throw new ErrorHandler('Unauthorized!', HttpCode.UNAUTHORIZED);
    }

    const result = await UserService.refreshToken(refreshToken);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE === EnvironmentEnum.prod,
      maxAge: Number(process.env.COOKIE_EXPIRES_TIME) * DAY_IN_MILLISECOND,
    });
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await UserService.getUserProfile(req?.user?.id);
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Update user profile
// @route   PUT /api/profile-update
// @access  Private
const updateProfile: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email } = req?.body;
    const result = await UserService.updateProfile(req?.user?.id, name, email);
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await UserService.getAllUsers();
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await UserService.getUserById(id);
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private/Admin
// const createUser: RequestHandler = AsyncHandler(
//   async (req: Request, res: Response): Promise<void> => {
//     const { name, email, password } = req?.body;
//     const result = await UserService.createUser(name, email, password);
//     res
//       .status(HttpCode.CREATED)
//       .json({ success: true, message: 'User created successfully', data: result });
//   },
// );

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await UserService.updateUser(id, req?.body);
    res
      .status(HttpCode.OK)
      .json({ success: true, message: 'User updated successfully', data: result });
  },
);

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await UserService.deleteUser(id);
    res
      .status(HttpCode.OK)
      .json({ success: true, message: 'User deleted successfully', data: result });
  },
);

export default {
  login,
  register,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  // createUser,
  updateUser,
  deleteUser,
};
