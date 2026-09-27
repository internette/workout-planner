import { redirect } from 'next/navigation';

// The front address opens the calendar.
export default function Page() {
  redirect('/calendar');
}
