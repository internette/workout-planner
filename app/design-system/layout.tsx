import Link from 'next/link';
import { DesignSystemNav } from './DesignSystemNav';
import styles from './design-system.module.css';

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <Link href="/">← Planner</Link>
      </header>
      <div className={styles.body}>
        <DesignSystemNav />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
