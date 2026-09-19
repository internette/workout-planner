'use client';

import dynamic from 'next/dynamic';

// The planner sizes its layout from window.innerWidth, so it renders on the client only.
const Planner = dynamic(() => import('./Planner'), { ssr: false });

export default function PlannerLoader() {
  return <Planner />;
}
