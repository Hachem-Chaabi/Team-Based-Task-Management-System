import { Router } from 'express';
import { RolesEnum } from '../../constants/constants';

import Authorization from '../../middlewares/auth';
import AuthorizeRole from '../../middlewares/authorizeRole';
import TeamProjectValidator from '../../validators/team-project.validator';
import validator from '../../validators';
import TeamProjectController from '../../controllers/v1/team-project.controller';

const router: Router = Router();

router
  .route('/teams-projects')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    TeamProjectController.getAll,
  )
  .post(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    validator(TeamProjectValidator.teamProjectSchema),
    TeamProjectController.create,
  );

router
  .route('/teams-projects/:teamId/:projectId')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    TeamProjectController.getById,
  )
  .delete(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    TeamProjectController.remove,
  );

export default router;
