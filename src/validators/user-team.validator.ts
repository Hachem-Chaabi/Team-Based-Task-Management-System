import { z } from 'zod';

const userTeamSchema = z.object({
  userId: z.string().uuid(),
  teamId: z.string().uuid(),
});

export default { userTeamSchema };
