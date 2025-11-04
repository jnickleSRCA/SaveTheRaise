'use client';

import { useState, useEffect } from 'react';
import { login, checkAuthStatus, getCommitteeReviewIdeas, updateIdea } from '@/lib/api';
import type { Idea, IdeaUpdate } from '@savetheraise/shared';
import ReviewNav from '@/components/ReviewNav';

export default function CommitteeReview() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Idea>>({});

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const status = await checkAuthStatus('committee');
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
      await login(password, 'committee');
      setAuthenticated(true);
      await loadIdeas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid password');
    }
  };

  const loadIdeas = async () => {
    try {
      const data = await getCommitteeReviewIdeas();
      setIdeas(data);
    } catch (err) {
      setError('Failed to load ideas');
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: 'approved' | 'implemented' | 'rejected_committee'
  ) => {
    try {
      await updateIdea(id, { status });
      await loadIdeas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update idea');
    }
  };

  const startEditing = (idea: Idea) => {
    setEditingIdea(idea);
    setEditFormData(idea);
  };

  const cancelEditing = () => {
    setEditingIdea(null);
    setEditFormData({});
  };

  const handleSaveEdit = async () => {
    if (!editingIdea) return;

    try {
      const update: IdeaUpdate = {
        submitter_names: editFormData.submitter_names,
        dollar_value: editFormData.dollar_value,
        old_pn: editFormData.old_pn,
        old_cost: editFormData.old_cost,
        new_pn: editFormData.new_pn,
        new_cost: editFormData.new_cost,
        eau: editFormData.eau,
        area_to_improve: editFormData.area_to_improve,
        customers_affected: editFormData.customers_affected,
        impact_description: editFormData.impact_description,
        notes: editFormData.notes,
        reviewer_notes: editFormData.reviewer_notes,
      };

      await updateIdea(editingIdea.id, update);
      await loadIdeas();
      cancelEditing();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
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
              ⭐ Committee Review Login
            </h1>
            {error && (
              <div style={{ padding: '15px', backgroundColor: '#ffe6e6', marginBottom: '25px', borderRadius: '8px', border: '2px solid #dc3545', color: '#721c24' }}>
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
                    style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '8px', border: '2px solid #87CEEB', fontSize: '1em' }}
                  />
                </label>
              </div>
              <button type="submit" style={{ padding: '12px 30px', backgroundColor: '#006994', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1em', width: '100%', fontWeight: '600' }}>
                🏖️ Login
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  if (editingIdea) {
    return (
      <>
        <ReviewNav />
        <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px', padding: '40px', boxShadow: '0 8px 32px rgba(0, 105, 148, 0.2)', border: '3px solid #006994' }}>
            <h1 style={{ color: '#006994', marginBottom: '30px', fontSize: '2em' }}>✏️ Edit Idea</h1>

        {error && (
          <div
            style={{ padding: '10px', backgroundColor: '#f8d7da', marginBottom: '20px' }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label>
            <strong>Submitter Names:</strong>
            <br />
            <input
              type="text"
              value={editFormData.submitter_names || ''}
              onChange={(e) =>
                setEditFormData({ ...editFormData, submitter_names: e.target.value })
              }
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            <strong>Dollar Value:</strong>
            <br />
            <input
              type="number"
              step="0.01"
              value={editFormData.dollar_value || ''}
              onChange={(e) =>
                setEditFormData({ ...editFormData, dollar_value: e.target.value })
              }
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        {editingIdea.type === 'part_change' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label>
                <strong>Old Part Number:</strong>
                <br />
                <input
                  type="text"
                  value={editFormData.old_pn || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, old_pn: e.target.value })
                  }
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>
                <strong>Old Cost:</strong>
                <br />
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.old_cost || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, old_cost: e.target.value })
                  }
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>
                <strong>New Part Number:</strong>
                <br />
                <input
                  type="text"
                  value={editFormData.new_pn || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, new_pn: e.target.value })
                  }
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>
                <strong>New Cost:</strong>
                <br />
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.new_cost || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, new_cost: e.target.value })
                  }
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>
                <strong>EAU:</strong>
                <br />
                <input
                  type="number"
                  value={editFormData.eau || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, eau: parseInt(e.target.value) })
                  }
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>
          </>
        )}

        {editingIdea.type === 'process_change' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label>
                <strong>Area to Improve:</strong>
                <br />
                <input
                  type="text"
                  value={editFormData.area_to_improve || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, area_to_improve: e.target.value })
                  }
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>
                <strong>Customers Affected:</strong>
                <br />
                <input
                  type="text"
                  value={editFormData.customers_affected || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      customers_affected: e.target.value,
                    })
                  }
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>
                <strong>Impact Description:</strong>
                <br />
                <textarea
                  value={editFormData.impact_description || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      impact_description: e.target.value,
                    })
                  }
                  rows={4}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>
          </>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label>
            <strong>Notes:</strong>
            <br />
            <textarea
              value={editFormData.notes || ''}
              onChange={(e) =>
                setEditFormData({ ...editFormData, notes: e.target.value })
              }
              rows={4}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            <strong>Reviewer Notes:</strong>
            <br />
            <textarea
              value={editFormData.reviewer_notes || ''}
              onChange={(e) =>
                setEditFormData({ ...editFormData, reviewer_notes: e.target.value })
              }
              rows={4}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <button onClick={handleSaveEdit} style={{ padding: '12px 30px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1em', fontWeight: '600', flex: 1 }}>
                ✅ Save Changes
              </button>
              <button onClick={cancelEditing} style={{ padding: '12px 30px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1em', fontWeight: '600', flex: 1 }}>
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ReviewNav />
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#006994', marginBottom: '30px', fontSize: '2.2em' }}>⭐ Committee Review</h1>

        {error && (
          <div style={{ padding: '15px', backgroundColor: '#ffe6e6', marginBottom: '25px', borderRadius: '8px', border: '2px solid #dc3545', color: '#721c24' }}>
            {error}
          </div>
        )}

        {ideas.length === 0 ? (
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px', padding: '40px', textAlign: 'center', color: '#006994', fontSize: '1.2em' }}>
            🌊 No ideas pending committee review
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

              {idea.reviewer_notes && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Reviewer Notes:</strong> {idea.reviewer_notes}
                </div>
              )}

              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => startEditing(idea)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#006994',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95em',
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleUpdateStatus(idea.id, 'approved')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95em',
                  }}
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(idea.id, 'implemented')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#FF8C00',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95em',
                  }}
                >
                  🏆 Implemented
                </button>
                <button
                  onClick={() => handleUpdateStatus(idea.id, 'rejected_committee')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95em',
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
