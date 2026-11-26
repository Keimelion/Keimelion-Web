import { apiClient } from '@/data-access/_shared/client'

export async function logout(refreshToken: string | null): Promise<void> {
  await apiClient.auth.logout(refreshToken === null ? {} : { refreshToken })
}
