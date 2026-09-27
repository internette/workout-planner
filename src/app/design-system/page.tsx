import { DesignSystemOverview } from '@moonshot/design-system/docs/page';
import { RankUpDemo } from '@/features/progress/RankUpDemo';

// The design system lives in packages/design-system; these routes only serve its docs. The overview gets the app's own
// big moment, the rank-up transformation, for its Brand shelf.
export { metadata } from '@moonshot/design-system/docs/page';

export default function DesignSystemPage() {
  return <DesignSystemOverview showcase={<RankUpDemo />} />;
}
