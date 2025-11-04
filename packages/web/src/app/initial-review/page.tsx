'use client';

import { useState, useEffect } from 'react';
import {
  login,
  checkAuthStatus,
  getInitialReviewIdeas,
  updateIdeaStatus,
} from '@/lib/api';
import type { Idea } from '@savetheraise/shared';
import ReviewNav from '@/components/ReviewNav';

export default function InitialReview() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [reviewerNotes, setReviewerNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const status = await checkAuthStatus('initial');
      if (status.authenticated) {
        setAuthenticated(true);
        await loadIdeas();
      }
    } catch (err) {
      setError('Failed to check authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(password, 'initial');
      setAuthenticated(true);
      await loadIdeas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid password');
    }
  };

  const loadIdeas = async () => {
    try {
      const data = await getInitialReviewIdeas();
      setIdeas(data);
    } catch (err) {
      setError('Failed to load ideas');
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: 'rejected_initial' | 'committee_review'
  ) => {
    try {
      await updateIdeaStatus(id, status, reviewerNotes[id]);
      await loadIdeas();
      setReviewerNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[id];
        return newNotes;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update idea');
    }
  };

  if (loading) {
    return (
      <>
        <ReviewNav />
        <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.2em', color: '#006994' }}>
          🌊 Loading...
        </div>
      </>
    );
  }

  if (!authenticated) {
    return (
      <>
        <ReviewNav />
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '40px' }}>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              padding: '40px',
              boxShadow: '0 8px 32px rgba(0, 105, 148, 0.2)',
              border: '3px solid #006994',
            }}
          >
            <h1 style={{ color: '#006994', textAlign: 'center', marginBottom: '25px' }}>
              🔍 Initial Review Login
            </h1>
            {error && (
              <div
                style={{
                  padding: '15px',
                  backgroundColor: '#ffe6e6',
                  marginBottom: '25px',
                  borderRadius: '8px',
                  border: '2px solid #dc3545',
                  color: '#721c24',
                }}
              >
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '25px' }}>
                <label>
                  <strong style={{ color: '#006994' }}>Password:</strong>
                  <br />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginTop: '8px',
                      borderRadius: '8px',
                      border: '2px solid #87CEEB',
                      fontSize: '1em',
                    }}
                  />
                </label>
              </div>
              <button
                type="submit"
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#006994',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.1em',
                  width: '100%',
                  fontWeight: '600',
                }}
              >
                🏖️ Login
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ReviewNav />
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#006994', marginBottom: '30px', fontSize: '2.2em' }}>
          🔍 Initial Review
        </h1>

        {error && (
          <div
            style={{
              padding: '15px',
              backgroundColor: '#ffe6e6',
              marginBottom: '25px',
              borderRadius: '8px',
              border: '2px solid #dc3545',
              color: '#721c24',
            }}
          >
            {error}
          </div>
        )}

      {ideas.length === 0 ? (
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '15px',
            padding: '40px',
            textAlign: 'center',
            color: '#006994',
            fontSize: '1.2em',
          }}
        >
          🌊 No ideas pending initial review
        </div>
      ) : (
        <div>
          {ideas.map((idea) => (
            <div
              key={idea.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #87CEEB',
                padding: '25px',
                marginBottom: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 105, 148, 0.1)',
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <strong>Submitter:</strong> {idea.submitter_names}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Type:</strong>{' '}
                {idea.type === 'part_change' ? 'Part Change' : 'Process Change'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Dollar Value:</strong> ${idea.dollar_value}
              </div>

              {idea.type === 'part_change' && (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Old P/N:</strong> {idea.old_pn} - ${idea.old_cost}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>New P/N:</strong> {idea.new_pn} - ${idea.new_cost}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>EAU:</strong> {idea.eau}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Calculated Impact:</strong> ${idea.calculated_impact}
                  </div>
                </>
              )}

              {idea.type === 'process_change' && (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Area to Improve:</strong> {idea.area_to_improve}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Customers Affected:</strong> {idea.customers_affected}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Impact:</strong> {idea.impact_description}
                  </div>
                </>
              )}

              {idea.notes && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Notes:</strong> {idea.notes}
                </div>
              )}

              <div style={{ marginTop: '15px' }}>
                <label>
                  <strong>Reviewer Notes:</strong>
                  <br />
                  <textarea
                    value={reviewerNotes[idea.id] || ''}
                    onChange={(e) =>
                      setReviewerNotes({ ...reviewerNotes, [idea.id]: e.target.value })
                    }
                    rows={3}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </label>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleUpdateStatus(idea.id, 'committee_review')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1em',
                    flex: 1,
                  }}
                >
                  ✅ Send to Committee
                </button>
                <button
                  onClick={() => handleUpdateStatus(idea.id, 'rejected_initial')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1em',
                    flex: 1,
                  }}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
