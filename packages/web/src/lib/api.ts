import type { NewIdea, Idea, IdeaUpdate } from '@savetheraise/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export async function submitIdea(idea: NewIdea): Promise<Idea> {
  return fetchApi<Idea>('/ideas', {
    method: 'POST',
    body: JSON.stringify(idea),
  });
}

export async function login(
  password: string,
  role: 'initial' | 'committee'
): Promise<{ success: boolean; role: string }> {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password, role }),
  });
}

export async function logout(
  role: 'initial' | 'committee'
): Promise<{ success: boolean }> {
  return fetchApi('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
}

export async function checkAuthStatus(
  role: 'initial' | 'committee'
): Promise<{ authenticated: boolean; role: string }> {
  return fetchApi(`/auth/status?role=${role}`);
}

export async function getInitialReviewIdeas(): Promise<Idea[]> {
  return fetchApi<Idea[]>('/ideas/initial-review');
}

export async function getCommitteeReviewIdeas(): Promise<Idea[]> {
  return fetchApi<Idea[]>('/ideas/committee-review');
}

export async function updateIdeaStatus(
  id: string,
  status: string,
  reviewerNotes?: string
): Promise<Idea> {
  return fetchApi<Idea>(`/ideas/${id}/initial-review`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reviewer_notes: reviewerNotes }),
  });
}

export async function updateIdea(id: string, update: IdeaUpdate): Promise<Idea> {
  return fetchApi<Idea>(`/ideas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(update),
  });
}

export interface ScoreboardMetrics {
  total_submitted: number;
  dollar_value_approved: string;
  dollar_value_implemented: string;
}

export async function getScoreboardMetrics(): Promise<ScoreboardMetrics> {
  return fetchApi<ScoreboardMetrics>('/scoreboard');
}
