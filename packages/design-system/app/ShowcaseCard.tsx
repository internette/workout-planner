import type { CSSProperties, ReactNode } from 'react';
import { Card } from '../src/card';
import { Text } from '../src/typography';
import styles from './design-system.module.css';

/** A card on the overview's Brand shelf: something shown on a stage, what it is, and what it's for. */
export function ShowcaseCard({ stage, stageStyle, title, use, children }: { stage: ReactNode; stageStyle?: CSSProperties; title: string; use: ReactNode; children?: ReactNode }) {
  return (
    <Card pad="sm">
      <div className={styles.brandStage} style={stageStyle}>
        {stage}
      </div>
      <Text variant="itemTitle" tone="ink" as="h3" style={{ margin: 0 }}>
        {title}
      </Text>
      <Text variant="caption" tone="muted" as="p" style={{ margin: '4px 0 10px' }}>
        {use}
      </Text>
      {children}
    </Card>
  );
}
