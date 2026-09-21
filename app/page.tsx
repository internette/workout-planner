import PlannerLoader from '@/components/PlannerLoader';
import { AuthGate } from '@/components/auth/AuthGate';

export default function Page() {
  return (
    <AuthGate>
      <PlannerLoader />
    </AuthGate>
  );
}
