import { StatusScreen, type StatusScreenProps } from '@moonshot/design-system/status-screen';

// The planner's loading, slow and error screens: the design system's StatusScreen with the planner's words.

const COPY = {
  loading: { title: 'Loading your plan', note: 'Setting up your week, streak and chronicle.' },
  slow: { title: 'Still loading your plan', note: 'This is taking longer than usual. It may be your connection.' },
  error: { title: 'Couldn’t reach your plan', note: 'Your plan is safe. Check your connection, then try again.' },
};

export function PlannerStatus(props: Omit<StatusScreenProps, 'title' | 'note' | 'inline'>) {
  return <StatusScreen {...props} {...COPY[props.kind]} />;
}
