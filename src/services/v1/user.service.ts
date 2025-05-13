import JwtHelper from '../../utils/jwtHelper';
import { ErrorHandler } from '../../utils/errorHandler';
import { HttpCode } from '../../utils/httpCode';
import { TokenEnum } from '../../constants/constants';
import userRepository from '../../database/repositories/user.repository';
import { User } from '../../../generated/prisma';

const login = async (email: string, password: string) => {
  const options = { email };

  const user = await userRepository.getOneByQuery(options);

  if (!user) {
    throw new ErrorHandler('No user found', HttpCode.NOT_FOUND);
  }

  const matched = await JwtHelper.PasswordCompare(password, user?.passwordHash);

  if (!matched) {
    throw new ErrorHandler('Invalid credentials', HttpCode.BAD_REQUEST);
  }

  const payload: TokenData = { id: user?.id };

  const token = JwtHelper.GenerateToken(payload, TokenEnum.access);
  const refreshToken = JwtHelper.GenerateToken(payload, TokenEnum.refresh);

  // create session
  await userRepository.createSession(user?.id, refreshToken);

  user.passwordHash = undefined;

  return { user, token, refreshToken };
};

const register = async (name: string, email: string, password: string) => {
  const exists = await userRepository.getOneByQuery({ email });

  if (exists) {
    throw new ErrorHandler('User already exists!', HttpCode.FORBIDDEN);
  }

  password = await JwtHelper.PasswordHashing(password);

  const user = await userRepository.create({
    username: name,
    passwordHash: password,
    email,
  } as User);

  const payload: TokenData = { id: user?.id };

  const token = JwtHelper.GenerateToken(payload, TokenEnum.access);
  const refreshToken = JwtHelper.GenerateToken(payload, TokenEnum.refresh);

  user.passwordHash = undefined;

  return { user, token, refreshToken };
};

const refreshToken = async (refreshToken: string) => {
  const decoded = JwtHelper.ExtractToken(refreshToken, TokenEnum.refresh);

  if (!decoded) {
    throw new ErrorHandler('Invalid Token!', HttpCode.UNAUTHORIZED);
  }

  const session = await userRepository.getSession(refreshToken);

  if (!session) {
    throw new ErrorHandler('Invalid session!', HttpCode.UNAUTHORIZED);
  }

  const payload: TokenData = { id: decoded?.id };

  const token = JwtHelper.GenerateToken(payload, TokenEnum.access);
  const newRefreshToken = JwtHelper.GenerateToken(payload, TokenEnum.refresh);

  // update session
  await userRepository.updateSession(session?.id, newRefreshToken);

  return { token, refreshToken: newRefreshToken };
};

const deleteSession = async (refreshToken: string) => {
  await userRepository.deleteSession(refreshToken)
}

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

// const createUser = async (name: string, email: string, password: string) => {
//   const createdUser = await userRepository.create({
//     username: name,
//     passwordHash: password,
//     email,
//   } as User);

//   return createdUser;
// };

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
  // createUser,
  updateUser,
  deleteUser,
  deleteSession
};
