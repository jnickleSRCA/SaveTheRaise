'use client';

import { useState, useEffect } from 'react';
import { getScoreboardMetrics, type ScoreboardMetrics } from '@/lib/api';
import ReviewNav from '@/components/ReviewNav';

export default function Scoreboard() {
  const [metrics, setMetrics] = useState<ScoreboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();

    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(loadMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await getScoreboardMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Failed to load scoreboard metrics');
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <>
        <ReviewNav />
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#ffe6e6',
              borderRadius: '8px',
              border: '2px solid #dc3545',
            }}
          >
            {error}
          </div>
        </div>
      </>
    );
  }

  if (!metrics) {
    return (
      <>
        <ReviewNav />
        <div style={{ padding: '40px', textAlign: 'center' }}>No data available</div>
      </>
    );
  }

  return (
    <>
      <ReviewNav />
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '15px',
            color: '#006994',
            fontSize: '2.5em',
          }}
        >
          🏖️ Catching Some Raise Scoreboard
        </h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '40px', fontSize: '1.1em' }}>
          Track the impact of our cost-saving initiatives
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '35px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(0, 105, 148, 0.15)',
              border: '3px solid #87CEEB',
            }}
          >
            <div style={{ fontSize: '16px', color: '#006994', marginBottom: '15px', fontWeight: '600' }}>
              🌊 Total Ideas Submitted
            </div>
            <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#006994' }}>
              {metrics.total_submitted}
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '35px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(40, 167, 69, 0.15)',
              border: '3px solid #90EE90',
            }}
          >
            <div style={{ fontSize: '16px', color: '#28a745', marginBottom: '15px', fontWeight: '600' }}>
              ✅ Dollar Value Approved
            </div>
            <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#28a745' }}>
              $
              {parseFloat(metrics.dollar_value_approved).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '35px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(255, 193, 7, 0.15)',
              border: '3px solid #FFD700',
            }}
          >
            <div style={{ fontSize: '16px', color: '#FF8C00', marginBottom: '15px', fontWeight: '600' }}>
              🏆 Dollar Value Implemented
            </div>
            <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#FF8C00' }}>
              $
              {parseFloat(metrics.dollar_value_implemented).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '50px',
            textAlign: 'center',
            color: '#006994',
            fontSize: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          ⏱️ Auto-refreshes every 30 seconds
        </div>
      </div>
    </>
  );
}
