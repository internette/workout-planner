import Link from 'next/link';
import { Lockup } from '@/components/brand/Lockup';
import { DesignSystemNav } from './DesignSystemNav';
import { StayLight } from './StayLight';
import styles from './design-system.module.css';

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell} data-design-system>
      <StayLight />
      <header className={styles.top}>
        <Link href="/" className={styles.brand} aria-label="Moonshot home">
          <Lockup height={28} />
        </Link>
      </header>
      <div className={styles.body}>
        <DesignSystemNav />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
