import { Router } from 'express';
import { RolesEnum } from '../../constants/constants';

import Authorization from '../../middlewares/auth';
import AuthorizeRole from '../../middlewares/authorizeRole';
import TeamValidator from '../../validators/team.validator';
import validator from '../../validators';
import TeamController from '../../controllers/v1/team.controller';

const router: Router = Router();

router
  .route('/teams')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    TeamController.getAll,
  )
  .post(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    validator(TeamValidator.teamSchema),
    TeamController.create,
  );

router
  .route('/teams/:id')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    TeamController.getById,
  )
  .put(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    validator(TeamValidator.teamSchema.partial()),
    TeamController.edit,
  )
  .delete(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    TeamController.remove,
  );

export default router;
