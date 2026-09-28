import { Button } from '@moonshot/design-system/buttons';

/** Deleting the thing a page is about (an exercise, a saved workout, a Chronicle entry): a quiet danger button, apart
 * from the rest below a divider. It asks first where the page's handler does. */
export function DeleteSection({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div style={{ marginTop: 'var(--space-7)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-line)' }}>
      <Button type="danger" ghost size="md" onClick={onClick}>
        {label}
      </Button>
    </div>
  );
}
