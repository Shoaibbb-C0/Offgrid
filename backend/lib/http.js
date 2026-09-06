import { ZodError } from 'zod';

export function jsonError(error, validationMessage = 'Invalid request') {
  if (error instanceof ZodError) {
    return Response.json(
      { error: validationMessage, issues: error.issues },
      { status: 400 },
    );
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error.code || error.type || error.message);
  return Response.json(
    {
      error: status < 500 ? error.message : 'Request could not be processed',
      ...(error.code ? { code: error.code } : {}),
    },
    { status },
  );
}
