import express from 'express';

const router = express.Router();

import { RolesEnum } from '../../constants/constants';

import Authorization from '../../middlewares/auth';
import AuthorizeRole from '../../middlewares/authorizeRole';
import limiter from '../../middlewares/limiter';

import UserValidator from '../../validators/user.validator';
import validator from '../../validators';

import UserController from '../../controllers/v1/user.controller';

router.post('/login', validator(UserValidator.loginSchema), UserController.login);

router.post('/register', validator(UserValidator.registerSchema), UserController.register);

router.get('/logout', Authorization.Authenticated, UserController.logout);

router.post('/refresh-token', UserController.refreshToken);

router.get('/profile', Authorization.Authenticated, UserController.getProfile);

// router.post(
//   '/forgot-password',
//   validator(UserValidator.forgotPasswordSchema),
//   UserController.forgotPassword,
// );

// router.put(
//   '/reset-password/',
//   validator(UserValidator.resetPasswordSchema),
//   UserController.resetPassword,
// );

// router.put(
//   '/profile-update',
//   Authorization.Authenticated,
//   validator(UserValidator.updateProfile),
//   UserController.updateProfile,
// );

// router.put(
//   '/profile-password-update',
//   Authorization.Authenticated,
//   validator(UserValidator.updateProfilePassword),
//   UserController.updateUserPassword,
// );

router
  .route('/superadmin/users')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
    UserController.getAllUsers,
  )
  // .post(
  //   Authorization.Authenticated,
  //   AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
  //   UserController.createUser,
  // );

router
  .route('/superadmin/users/:id')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
    UserController.getUserById,
  )
  .put(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
    UserController.updateUser,
  )
  .delete(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
    UserController.deleteUser,
  );

export default router;
