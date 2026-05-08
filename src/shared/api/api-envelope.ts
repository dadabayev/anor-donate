/** Обёртка ответа бэкенда (поля data, message, success). */
export interface ApiEnvelope<T> {
  data: T
  message: string
  success: boolean
}
