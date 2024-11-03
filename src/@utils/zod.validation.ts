import dayjs from 'dayjs';
import z from 'zod';

export const zDateSchema = z.string().refine((value) => {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  switch (true) {
    case !pattern.test(value): return false
    case !dayjs(value, 'YYYY-MM-DD').isValid(): return false
    default: return true
  }
}, { message: 'Invalid date format. Expected "yyyy-mm-dd".' })

export const zPathSchema = z.string().nonempty('File path cannot be empty').refine(
  (value) => /^(\/[^\/\0]+)+\/?$/.test(value),
  { message: 'Invalid Linux file directory path' }
)

// Regular expression to match a filename with an extension
const filenameRegex = /^(?!.*[<>:"/\\|?*\x00-\x1F])[^.]+(?:\.[^.]+)?$/;
export const zFilenameSchema = z.string().refine((value) => filenameRegex.test(value), { message: "Invalid filename" });

export const zPhoneSchema = z.string().refine(value => /^(0\d{9,15}|\+\d{1,3}\d{7,14})$/.test(value))
export const zPasswordSchema = z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d).+$/, { message: "Password must contain at least one uppercase letter, one number, and be at least 8 characters long" });

// Define a regular expression to match the DATABASE_URL format
export const databaseUrlPattern = /^postgresql:\/\/(?<username>[^:]+):(?<password>[^@]+)@(?<host>[^:]+):(?<port>\d+)\/(?<database>[^/]+)$/;

// Define the Zod schema
export const zDatabaseUrlSchema = z.string().regex(databaseUrlPattern, {
  message: "Invalid DATABASE_URL format. Expected format: postgresql://<username>:<password>@<host>:<port>/<database>",
});

export const zEnvSchema = z.object({
  NODE_ENV: z.enum(['PRODUCTION', 'DEVELOPMENT', 'LOCAL']),
  APP_PORT: z.number({ coerce: true }).min(1000),
  DATABASE_URL: zDatabaseUrlSchema,


  // OBJECT STORAGE
  // AUTH
  USER_JWT_SECRET: z.string(),
})
