'use client';

import dynamic from 'next/dynamic';
import type { Account } from '@/lib/auth';
import { StatusScreen } from './planner/StatusScreen';

// The planner sizes its layout from window.innerWidth, so it renders on the client only.
const Planner = dynamic(() => import('./Planner'), { ssr: false, loading: () => <StatusScreen kind="loading" /> });

export default function PlannerLoader({ account = null }: { account?: Account | null }) {
  return <Planner account={account} />;
}
