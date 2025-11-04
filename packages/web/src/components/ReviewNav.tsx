export default function ReviewNav() {
  return (
    <nav
      style={{
        backgroundColor: '#006994',
        color: 'white',
        padding: '15px 30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
        }}
      >
        <a
          href="/scoreboard"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'opacity 0.2s',
          }}
        >
          🏖️ Scoreboard
        </a>
        <a
          href="/initial-review"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'opacity 0.2s',
          }}
        >
          🔍 Initial Review
        </a>
        <a
          href="/committee-review"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'opacity 0.2s',
          }}
        >
          ⭐ Committee Review
        </a>
      </div>
    </nav>
  );
}
