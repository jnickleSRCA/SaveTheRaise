import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catching Some Raise - Idea Submission',
  description: 'Cost Savings Idea Submission Tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          margin: 0,
          padding: 0,
          background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #F0E68C 100%)',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
