import { z } from 'zod';

const teamProjectSchema = z.object({
  teamId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export default { teamProjectSchema };
