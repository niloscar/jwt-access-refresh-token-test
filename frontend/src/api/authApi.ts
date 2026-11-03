import api from '../lib/apiClient'

export const signIn = async ({ email, password }: { email: string; password: string }) => {
  const response = await api.post('/auth/sign-in', { email, password })
  return response.data
}
