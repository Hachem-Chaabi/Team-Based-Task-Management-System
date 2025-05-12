import { Router } from 'express';
import { RolesEnum } from '../../constants/constants';

import Authorization from '../../middlewares/auth';
import AuthorizeRole from '../../middlewares/authorizeRole';
import UserTeamValidator from '../../validators/user-team.validator';
import validator from '../../validators';
import UserTeamController from '../../controllers/v1/user-team.controller';

const router: Router = Router();

router
  .route('/users-teams')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    UserTeamController.getAll,
  )
  .post(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    validator(UserTeamValidator.userTeamSchema),
    UserTeamController.create,
  )
  .delete(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    UserTeamController.remove,
  );

router
  .route('/users-teams/:userId/:teamId')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    UserTeamController.getById,
  );

export default router;
