import api from '../lib/apiClient'

export const signIn = ({ email, password }: { email: string; password: string }) => api.post('/auth/sign-in', { email, password })

export const signOut = () => api.post('/auth/sign-out')

export const getProtectedPage = () => api.get('/auth/protected')

export const refreshToken = () => api.post('/auth/refresh')