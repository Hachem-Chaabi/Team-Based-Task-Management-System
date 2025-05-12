import { z } from 'zod';

const teamSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export default { teamSchema };
