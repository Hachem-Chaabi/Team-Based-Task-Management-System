import { z } from 'zod';

const taskSchema = z.object({
  id: z.string().uuid().optional(),
  projectId: z.string().uuid(),
  title: z.string().min(3),
  description: z.string(),
  dueDate: z.string().or(z.date()),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  important: z.boolean().optional(),
  assignedTo: z.string().uuid().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export default { taskSchema };
