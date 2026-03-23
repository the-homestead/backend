import { z } from 'zod';

export const ListFilesSchema = z.object({
    /**
     * Directory path to list, e.g. `/mods/my-mod/` or `/` for the zone root.
     */
    path: z
        .string()
        .min(1, 'Path is required')
        .refine((v) => v.startsWith('/'), { message: 'Path must start with /' }),
});

export type ListFilesDto = z.infer<typeof ListFilesSchema>;
