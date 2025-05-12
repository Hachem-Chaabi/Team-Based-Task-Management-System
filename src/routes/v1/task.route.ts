import { Router } from 'express';
import { RolesEnum } from '../../constants/constants';

import Authorization from '../../middlewares/auth';
import AuthorizeRole from '../../middlewares/authorizeRole';
import TaskValidator from '../../validators/task.validator';
import validator from '../../validators';
import TaskController from '../../controllers/v1/task.controller';
import isTaskOwner from '../../middlewares/isTaskOwner';

const router: Router = Router();

// User assigned tasks
router
  .route('/tasks')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.user, RolesEnum.superAdmin]),
    TaskController.getAll,
  )
  .post(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.user, RolesEnum.superAdmin]),
    validator(TaskValidator.taskSchema),
    TaskController.create,
  );

// All tasks by task id
router
  .route('/tasks/:id')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.user, RolesEnum.superAdmin]),
    isTaskOwner,
    TaskController.getById,
  )
  .put(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.user, RolesEnum.superAdmin]),
    validator(TaskValidator.taskSchema),
    isTaskOwner,
    TaskController.edit,
  )
  .delete(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
    isTaskOwner,
    TaskController.remove,
  );

// All tasks
router
  .route('/superadmin/tasks')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
    TaskController.getAllSuperAdmin,
  );

// All tasks by task id
router
  .route('/superadmin/tasks/:id')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
    TaskController.getByIdSuperAdmin,
  )
  .put(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
    validator(TaskValidator.taskSchema.partial()),
    TaskController.editSuperAdmin,
  )
  .delete(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
    TaskController.removeSuperAdmin,
  );

// Tasks by non-current logged in user id
router
  .route('/superadmin/users-tasks/:id')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.superAdmin]),
    TaskController.getAllUserTasksAdmin,
  );

export default router;
