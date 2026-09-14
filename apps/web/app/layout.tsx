import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'UNSEEN Singapore — The engineering beneath us',
  description:
    'Walk through the engineering that built a nation. An independent, sourced interactive engineering documentary.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
