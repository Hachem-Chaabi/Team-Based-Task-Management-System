import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  createdBy: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});


export default { projectSchema };
