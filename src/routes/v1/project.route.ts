import { Router } from 'express';
import { RolesEnum } from '../../constants/constants';

import Authorization from '../../middlewares/auth';
import AuthorizeRole from '../../middlewares/authorizeRole';
import ProjectValidator from '../../validators/project.validator';
import validator from '../../validators';
import ProjectController from '../../controllers/v1/project.controller';

const router: Router = Router();

router
  .route('/projects')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    ProjectController.getAll,
  )
  .post(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    validator(ProjectValidator.projectSchema),
    ProjectController.create,
  );

router
  .route('/projects/:id')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    ProjectController.getById,
  )
  .put(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    validator(ProjectValidator.projectSchema.partial()),
    ProjectController.edit,
  )
  .delete(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.admin, RolesEnum.superAdmin]),
    ProjectController.remove,
  );

export default router;
