import Explorer from '../../components/explorer/explorer';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Enter the engineering world — UNSEEN Singapore',
  description:
    'Nine engineering stories. Five eras. Explore the structures, construction sequences and decisions that shaped Singapore.',
};
export default function Page() {
  return <Explorer />;
}
