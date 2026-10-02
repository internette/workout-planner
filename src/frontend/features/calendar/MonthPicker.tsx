import { Button } from '@moonshot/design-system/buttons';
import { vars } from '@moonshot/design-system/colors';
import { ChevronDown, Sparkle } from '@moonshot/design-system/icons';
import { Popover } from '@moonshot/design-system/popover';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import { StepButton } from '@/frontend/components/StepButton';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** The month name that opens a month-and-year picker, with Today. */
export function MonthPicker({ v }: { v: PlannerVals }) {
  return (
    <Popover
      open={!!v.monthOpen}
      onClose={v.closeMonth}
      width={300}
      top={40}
      align="center"
      content={
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--color-line)',
            }}
          >
            <StepButton dir="prev" unit="year" onClick={v.prevYear} />
            <Text variant="subheading">{v.yearLabel}</Text>
            <StepButton dir="next" unit="year" onClick={v.nextYear} />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
              gap: '4px',
              marginTop: '10px',
            }}
          >
            {(v.months ?? []).map((m, i) => (
              <button key={i}
                onClick={m?.pick}
                aria-label={m?.name}
                aria-current={m?.current ? 'date' : undefined}
                style={css(m?.style)}
              >
                {m?.short}
              </button>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid var(--color-line)',
            }}
          >
            <Button type="secondary" ghost size="sm" onClick={v.goToday}>
              Go to today
            </Button>
          </div>
        </>
      }
    >
      <button
        onClick={v.toggleMonth}
        aria-expanded={!!v.monthOpen}
        aria-haspopup="true"
        style={css(v.monthBtn)}
        className="hv1"
      >
        <Text variant="heading" tone="ink">
          {v.monthName}
        </Text>
        <ChevronDown color="var(--color-muted)" strokeWidth={2.2} size={17} />
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 'none',
            marginLeft: '9px',
            pointerEvents: 'none',
          }}
        >
          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-9px)' }}>
            <Sparkle
              size={11}
              color={vars.pink}
              glow={0.45}
              glowBlur={3}
              style={{ animation: 'twinkle 3.4s ease-in-out 0s infinite' }}
            />
          </span>
          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(3px)' }}>
            <Sparkle
              size={8}
              color={vars.periwinkle}
              glow={0.45}
              glowBlur={3}
              style={{ animation: 'twinkle 4.6s ease-in-out .4s infinite' }}
            />
          </span>
          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-4px)' }}>
            <Sparkle
              size={9}
              color={vars.teal}
              glow={0.45}
              glowBlur={3}
              style={{ animation: 'twinkle 5.4s ease-in-out .15s infinite' }}
            />
          </span>
          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(7px)' }}>
            <Sparkle
              size={6}
              color={vars.pink}
              glow={0.4}
              glowBlur={3}
              style={{ animation: 'twinkle 6s ease-in-out .9s infinite' }}
            />
          </span>
          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-7px)' }}>
            <Sparkle
              size={7}
              color={vars.periwinkle}
              glow={0.42}
              glowBlur={3}
              style={{ animation: 'twinkle 4.2s ease-in-out 1.1s infinite' }}
            />
          </span>
          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(1px)' }}>
            <Sparkle
              size={5}
              color={vars.teal}
              glow={0.4}
              glowBlur={3}
              style={{ animation: 'twinkle 5.2s ease-in-out 1.3s infinite' }}
            />
          </span>
          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-2px)' }}>
            <Sparkle
              size={6}
              color={vars.pink}
              glow={0.38}
              glowBlur={3}
              style={{ animation: 'twinkle 6.6s ease-in-out 1.7s infinite' }}
            />
          </span>
          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(5px)' }}>
            <Sparkle
              size={4}
              color={vars.periwinkle}
              glow={0.36}
              glowBlur={3}
              style={{ animation: 'twinkle 4.8s ease-in-out 2s infinite' }}
            />
          </span>
          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-5px)' }}>
            <Sparkle
              size={3}
              color={vars.teal}
              glow={0.34}
              glowBlur={3}
              style={{ animation: 'twinkle 5.8s ease-in-out 2.4s infinite' }}
            />
          </span>
        </span>
      </button>
    </Popover>
  );
}
