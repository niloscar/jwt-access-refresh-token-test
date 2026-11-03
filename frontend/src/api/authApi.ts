import api from '../lib/apiClient'

export const signIn = ({ email, password }: { email: string; password: string }) => api.post('/auth/sign-in', { email, password })

export const signOut = () => api.post('/auth/sign-out')