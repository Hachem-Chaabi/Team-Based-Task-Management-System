import JwtHelper from '../../utils/jwtHelper';
import { ErrorHandler } from '../../utils/errorHandler';
import { HttpCode } from '../../utils/httpCode';
import { TokenEnum } from '../../constants/constants';
import userRepository from '../../database/repositories/user.repository';
import { User } from '../../../generated/prisma';

const login = async (email: string, password: string) => {
  const user = await userRepository.getOneByQuery({ email });

  if (!user) {
    throw new ErrorHandler('No user found', HttpCode.NOT_FOUND);
  }

  const matched = await JwtHelper.PasswordCompare(password, user.passwordHash);

  if (!matched) {
    throw new ErrorHandler('Invalid credentials', HttpCode.BAD_REQUEST);
  }

  await userRepository.deleteSession({ userId: user?.id });

  const session = await userRepository.createSession(user.id);

  const payload: TokenData = {
    id: user.id,
    sessionId: session?.id,
  };

  const refreshToken = JwtHelper.GenerateToken(payload, TokenEnum.refresh);

  const accessToken = JwtHelper.GenerateToken(payload, TokenEnum.access);

  user.passwordHash = undefined;

  return {
    user,
    token: accessToken,
    refreshToken: refreshToken,
  };
};

const register = async (name: string, email: string, password: string) => {
  const exists = await userRepository.getOneByQuery({ email });

  if (exists) {
    throw new ErrorHandler('User already exists!', HttpCode.FORBIDDEN);
  }

  // Hash the password
  const hashedPassword = await JwtHelper.PasswordHashing(password);

  // Create the user
  const user = await userRepository.create({
    username: name,
    passwordHash: hashedPassword,
    email,
  } as User);

  const session = await userRepository.createSession(user.id);

  const payload: TokenData = {
    id: user.id,
    sessionId: session.id,
  };

  const refreshToken = JwtHelper.GenerateToken(payload, TokenEnum.refresh);

  const accessToken = JwtHelper.GenerateToken(payload, TokenEnum.access);

  user.passwordHash = undefined;

  return {
    user,
    token: accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const decoded = JwtHelper.ExtractToken(refreshToken, TokenEnum.refresh);

  if (!decoded) {
    throw new ErrorHandler('Invalid Token!', HttpCode.UNAUTHORIZED);
  }

  const session = await userRepository.getSession(decoded.sessionId);

  if (!session) {
    throw new ErrorHandler('Invalid session!', HttpCode.UNAUTHORIZED);
  }

  await userRepository.deleteSession({ userId: decoded?.id });

  const newSession = await userRepository.createSession(decoded.id);

  const payload: TokenData = { id: decoded?.id, sessionId: newSession?.id };

  const newRefreshToken = JwtHelper.GenerateToken(payload, TokenEnum.refresh);

  const token = JwtHelper.GenerateToken(payload, TokenEnum.access);

  return { token, refreshToken: newRefreshToken };
};

const deleteSession = async (userId: string) => {
  await userRepository.deleteSession({ userId });
};

const getUserProfile = async (id: string) => {
  const user = await userRepository.getById(id);

  if (!user) {
    throw new ErrorHandler('User not found!', HttpCode.NOT_FOUND);
  }

  return user;
};

const updateProfile = async (id: string, name: string, email: string) => {
  const user = await userRepository.getById(id);

  if (!user) {
    throw new ErrorHandler('User not found!', HttpCode.NOT_FOUND);
  }

  if (name) user.username = name;
  if (email) user.email = email;

  const updatedUser = await userRepository.edit(id, { name, email });

  user.passwordHash = undefined;

  return updatedUser;
};

const getAllUsers = async () => {
  const users = await userRepository.getAll();

  return users;
};

const getUserById = async (id: string) => {
  const user = await userRepository.getById(id);

  if (!user) {
    throw new ErrorHandler('User not found!', HttpCode.NOT_FOUND);
  }

  return user;
};

const updateUser = async (id: string, item: User) => {
  const user = await userRepository.getById(id);

  if (!user) {
    throw new ErrorHandler('User not found!', HttpCode.NOT_FOUND);
  }

  const updatedUser = await userRepository.edit(id, item);

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const user = await userRepository.getById(id);

  if (!user) {
    throw new ErrorHandler('User not found!', HttpCode.NOT_FOUND);
  }

  await userRepository.remove(id);

  return user;
};

export default {
  login,
  register,
  refreshToken,
  getUserProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteSession,
};
