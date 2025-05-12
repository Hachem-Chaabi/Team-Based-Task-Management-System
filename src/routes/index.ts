import express from 'express';
import userRoutes from './v1/user.route';
import todoRoutes from './v1/task.route';
import teamRoutes from './v1/team.route';
import projectRoutes from './v1/project.route';
import teamProjectRoutes from './v1/team-project.route';
import userTeamRoutes from './v1/user-team.route';

const router = express.Router();

router.use(
  '/',
  userRoutes,
  todoRoutes,
  teamRoutes,
  projectRoutes,
  teamProjectRoutes,
  userTeamRoutes,
);

export default router;
