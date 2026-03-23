import { z } from 'zod';

export const DownloadFileSchema = z.object({
    /**
     * Full path to the file inside the storage zone, e.g. `/mods/my-mod/v1.0.0/mod.zip`
     */
    path: z
        .string()
        .min(1, 'Path is required')
        .refine((v) => v.startsWith('/'), { message: 'Path must start with /' }),
});

export type DownloadFileDto = z.infer<typeof DownloadFileSchema>;
