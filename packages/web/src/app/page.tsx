'use client';

import { useState } from 'react';
import { submitIdea } from '@/lib/api';
import type { NewIdea } from '@savetheraise/shared';

export default function SubmissionForm() {
  const [type, setType] = useState<'part_change' | 'process_change'>('part_change');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    submitter_names: '',
    dollar_value: '',
    old_pn: '',
    old_cost: '',
    new_pn: '',
    new_cost: '',
    eau: '',
    area_to_improve: '',
    customers_affected: '',
    impact_description: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const calculatedImpact =
        type === 'part_change' && formData.eau && formData.old_cost && formData.new_cost
          ? (
              parseFloat(formData.eau) *
              (parseFloat(formData.new_cost) - parseFloat(formData.old_cost))
            ).toString()
          : null;

      const idea: NewIdea = {
        submitter_names: formData.submitter_names,
        type,
        status: 'submitted',
        dollar_value: formData.dollar_value,
        old_pn: type === 'part_change' ? formData.old_pn : null,
        old_cost: type === 'part_change' ? formData.old_cost : null,
        new_pn: type === 'part_change' ? formData.new_pn : null,
        new_cost: type === 'part_change' ? formData.new_cost : null,
        eau: type === 'part_change' ? parseInt(formData.eau) : null,
        calculated_impact: calculatedImpact,
        area_to_improve: type === 'process_change' ? formData.area_to_improve : null,
        customers_affected:
          type === 'process_change' ? formData.customers_affected : null,
        impact_description:
          type === 'process_change' ? formData.impact_description : null,
        notes: formData.notes || null,
        reviewer_notes: null,
      };

      await submitIdea(idea);
      setSuccess(true);
      setFormData({
        submitter_names: '',
        dollar_value: '',
        old_pn: '',
        old_cost: '',
        new_pn: '',
        new_cost: '',
        eau: '',
        area_to_improve: '',
        customers_affected: '',
        impact_description: '',
        notes: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit idea');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 8px 32px rgba(0, 105, 148, 0.2)',
          border: '3px solid #006994',
        }}
      >
        <h1
          style={{
            color: '#006994',
            textAlign: 'center',
            marginBottom: '10px',
            fontSize: '2.5em',
          }}
        >
          🌊 Catching Some Raise 🌊
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: '#555',
            marginBottom: '30px',
            fontSize: '1.1em',
          }}
        >
          Share your cost-saving ideas and help us build a better future!
        </p>

        {success && (
          <div
            style={{
              padding: '15px',
              backgroundColor: '#d4f4dd',
              marginBottom: '25px',
              borderRadius: '8px',
              border: '2px solid #28a745',
              color: '#155724',
            }}
          >
            🎉 Idea submitted successfully! Thank you for contributing!
          </div>
        )}

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
            ⚠️ Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>
              <strong>Name/s:</strong>
              <br />
              <input
                type="text"
                value={formData.submitter_names}
                onChange={(e) =>
                  setFormData({ ...formData, submitter_names: e.target.value })
                }
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>
              <strong>Idea Type:</strong>
              <br />
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as 'part_change' | 'process_change')
                }
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="part_change">Part Change Proposal</option>
                <option value="process_change">Process Change Proposal</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>
              <strong>Estimated Dollar Value:</strong>
              <br />
              <input
                type="number"
                step="0.01"
                value={formData.dollar_value}
                onChange={(e) =>
                  setFormData({ ...formData, dollar_value: e.target.value })
                }
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </label>
          </div>

          {type === 'part_change' && (
            <>
              <h3>Part Change Details</h3>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  <strong>Old Part Number:</strong>
                  <br />
                  <input
                    type="text"
                    value={formData.old_pn}
                    onChange={(e) => setFormData({ ...formData, old_pn: e.target.value })}
                    required
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
                    value={formData.old_cost}
                    onChange={(e) =>
                      setFormData({ ...formData, old_cost: e.target.value })
                    }
                    required
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
                    value={formData.new_pn}
                    onChange={(e) => setFormData({ ...formData, new_pn: e.target.value })}
                    required
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
                    value={formData.new_cost}
                    onChange={(e) =>
                      setFormData({ ...formData, new_cost: e.target.value })
                    }
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label>
                  <strong>EAU (Estimated Annual Usage):</strong>
                  <br />
                  <input
                    type="number"
                    value={formData.eau}
                    onChange={(e) => setFormData({ ...formData, eau: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </label>
              </div>

              {formData.eau && formData.old_cost && formData.new_cost && (
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#e7f3ff',
                    marginBottom: '20px',
                  }}
                >
                  <strong>Calculated Impact:</strong> $
                  {(
                    parseFloat(formData.eau) *
                    (parseFloat(formData.new_cost) - parseFloat(formData.old_cost))
                  ).toFixed(2)}
                </div>
              )}
            </>
          )}

          {type === 'process_change' && (
            <>
              <h3>Process Change Details</h3>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  <strong>Area to Improve:</strong>
                  <br />
                  <input
                    type="text"
                    value={formData.area_to_improve}
                    onChange={(e) =>
                      setFormData({ ...formData, area_to_improve: e.target.value })
                    }
                    required
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
                    value={formData.customers_affected}
                    onChange={(e) =>
                      setFormData({ ...formData, customers_affected: e.target.value })
                    }
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label>
                  <strong>Impact:</strong>
                  <br />
                  <textarea
                    value={formData.impact_description}
                    onChange={(e) =>
                      setFormData({ ...formData, impact_description: e.target.value })
                    }
                    required
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
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Explain your idea in detail. Include part numbers, needs, and the impact."
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '15px 40px',
              backgroundColor: '#006994',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1em',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 8px rgba(0, 105, 148, 0.3)',
              width: '100%',
              marginTop: '10px',
            }}
          >
            {submitting ? '🌊 Submitting...' : '🏖️ Submit Your Idea'}
          </button>
        </form>
      </div>
    </div>
  );
}
