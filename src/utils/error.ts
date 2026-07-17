export interface ValidationErrorResponse {
  error: string
  details?: {
    formErrors?: string[]
    fieldErrors?: Record<string, string[]>
  }
}

export interface ParsedApiError {
  message: string
  fieldErrors: Record<string, string>
  hasFieldErrors: boolean
}

export function parseApiError(err: unknown, fallback = 'Something went wrong'): ParsedApiError {
  const axiosError = err as { response?: { data?: ValidationErrorResponse } } | undefined
  const data = axiosError?.response?.data

  if (!data) {
    return { message: fallback, fieldErrors: {}, hasFieldErrors: false }
  }

  const fieldErrors: Record<string, string> = {}
  if (data.details?.fieldErrors) {
    for (const [field, messages] of Object.entries(data.details.fieldErrors)) {
      if (messages.length > 0 && messages[0]) {
        fieldErrors[field] = messages[0]
      }
    }
  }

  return {
    message: data.error || fallback,
    fieldErrors,
    hasFieldErrors: Object.keys(fieldErrors).length > 0,
  }
}

export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  return parseApiError(err, fallback).message
}
