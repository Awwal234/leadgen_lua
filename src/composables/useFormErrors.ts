import { reactive } from 'vue'
import { parseApiError } from '@/utils/error'

export function useFormErrors() {
  const errors = reactive<Record<string, string>>({})

  function setFromApi(err: unknown) {
    const parsed = parseApiError(err)
    for (const key of Object.keys(errors)) {
      delete errors[key]
    }
    for (const [field, msg] of Object.entries(parsed.fieldErrors)) {
      errors[field] = msg
    }
    return parsed
  }

  function clear(field?: string) {
    if (field) {
      delete errors[field]
    } else {
      for (const key of Object.keys(errors)) {
        delete errors[key]
      }
    }
  }

  function has(field: string): boolean {
    return field in errors
  }

  function get(field: string): string | undefined {
    return errors[field]
  }

  return { errors, setFromApi, clear, has, get }
}
