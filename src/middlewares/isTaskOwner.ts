import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/config';
import { HttpCode } from '../utils/httpCode';
import { ErrorHandler } from '../utils/errorHandler';

const isTaskOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.id;

    if (!taskId || !userId) {
      return next(new ErrorHandler('Task ID or User ID is missing.', HttpCode.BAD_REQUEST));
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { assignedTo: true },
    });

    if (!task) {
      return next(new ErrorHandler('Task not found.', HttpCode.NOT_FOUND));
    }

    if (task.assignedTo !== userId) {
      return next(new ErrorHandler('Access denied. Not your task.', HttpCode.FORBIDDEN));
    }

    next();
  } catch (error) {
    console.error('isTaskOwner error:', error);
    return next(new ErrorHandler('Internal server error.', HttpCode.INTERNAL_SERVER_ERROR));
  }
};

export default isTaskOwner;
