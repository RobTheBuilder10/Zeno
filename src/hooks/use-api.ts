'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Generic fetch wrapper
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

// User hooks
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => fetchApi<{ user: any }>('/api/user'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) =>
      fetchApi('/api/user', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

// Snapshot hook
export function useSnapshot() {
  return useQuery({
    queryKey: ['snapshot'],
    queryFn: () => fetchApi<{ snapshot: any }>('/api/snapshot'),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Accounts hooks
export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetchApi<{ accounts: any[] }>('/api/accounts'),
  })
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => fetchApi<{ account: any }>(`/api/accounts/${id}`),
    enabled: !!id,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) =>
      fetchApi('/api/accounts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['snapshot'] })
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      fetchApi(`/api/accounts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['snapshot'] })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/api/accounts/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['snapshot'] })
    },
  })
}

// Transactions hooks
export function useTransactions(params?: {
  page?: number
  limit?: number
  accountId?: string
  category?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.accountId) searchParams.set('accountId', params.accountId)
  if (params?.category) searchParams.set('category', params.category)

  const url = `/api/transactions${searchParams.toString() ? `?${searchParams}` : ''}`

  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => fetchApi<{ transactions: any[]; pagination: any }>(url),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) =>
      fetchApi('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['snapshot'] })
    },
  })
}

// Debts hooks
export function useDebts() {
  return useQuery({
    queryKey: ['debts'],
    queryFn: () => fetchApi<{ debts: any[]; summary: any }>('/api/debts'),
  })
}

export function useCreateDebt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) =>
      fetchApi('/api/debts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
      queryClient.invalidateQueries({ queryKey: ['snapshot'] })
    },
  })
}

// Bills hooks
export function useBills() {
  return useQuery({
    queryKey: ['bills'],
    queryFn: () => fetchApi<{ bills: any[]; summary: any }>('/api/bills'),
  })
}

export function useCreateBill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) =>
      fetchApi('/api/bills', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] })
      queryClient.invalidateQueries({ queryKey: ['snapshot'] })
    },
  })
}

// Goals hooks
export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: () => fetchApi<{ goals: any[]; summary: any }>('/api/goals'),
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) =>
      fetchApi('/api/goals', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['snapshot'] })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      fetchApi(`/api/goals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

// Actions hooks
export function useActions(status?: string) {
  const url = status ? `/api/actions?status=${status}` : '/api/actions'

  return useQuery({
    queryKey: ['actions', status],
    queryFn: () => fetchApi<{ actions: any[]; counts: any }>(url),
  })
}

export function useUpdateAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetchApi(`/api/actions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
  })
}

// Insights hooks
export function useInsights(limit?: number) {
  const url = limit ? `/api/insights?limit=${limit}` : '/api/insights'

  return useQuery({
    queryKey: ['insights', limit],
    queryFn: () => fetchApi<{ insights: any[] }>(url),
  })
}

export function useGenerateInsight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => fetchApi('/api/insights', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] })
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
  })
}

// Onboarding hook
export function useOnboarding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { step: number; data: any }) =>
      fetchApi('/api/user/onboarding', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}
