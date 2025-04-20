export function createSuccessResponse<T>(
  data: T,
  options?: ResponseInit,
): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })
}

export function createErrorResponse(
  error: string,
  status: number = 500,
  options?: ResponseInit,
): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })
}
