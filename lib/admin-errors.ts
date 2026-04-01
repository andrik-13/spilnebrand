export const ADMIN_ERROR_CODES = {
  configuration: 'ADMIN_CONFIGURATION',
  dataAccess: 'ADMIN_DATA_ACCESS',
  storageConfiguration: 'ADMIN_STORAGE_CONFIGURATION',
} as const;

export type AdminErrorCode = (typeof ADMIN_ERROR_CODES)[keyof typeof ADMIN_ERROR_CODES];

export type TaggedError = Error & { code: AdminErrorCode };

export function createTaggedError(code: AdminErrorCode, message: string): TaggedError {
  return Object.assign(new Error(message), { code, name: code });
}

export function isTaggedError(error: unknown, code: AdminErrorCode): error is TaggedError {
  return error instanceof Error && 'code' in error && error.code === code;
}
