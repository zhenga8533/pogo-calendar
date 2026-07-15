import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatInstantInTimeZone,
  getEventInstant,
  localDateTimeToInstant,
} from '../src/utils/eventTimeUtils.ts';

test('formats an absolute instant in the selected timezone', () => {
  assert.equal(
    formatInstantInTimeZone(
      new Date('2026-07-08T20:00:00.000Z'),
      'America/New_York'
    ),
    '2026-07-08T16:00:00'
  );
});

test('converts a local wall time to its canonical instant', () => {
  assert.equal(
    localDateTimeToInstant(
      '2026-07-20T10:00:00',
      'America/New_York'
    ).toISOString(),
    '2026-07-20T14:00:00.000Z'
  );
});

test('rejects wall times skipped by daylight saving transitions', () => {
  assert.throws(() =>
    localDateTimeToInstant(
      '2026-03-08T02:30:00',
      'America/New_York'
    )
  );
});

test('prefers canonical event instants for calculations', () => {
  const instant = getEventInstant(
    {
      title: 'Global event',
      start: '2026-07-08T16:00:00',
      end: '2026-07-08T17:00:00',
      extendedProps: {
        category: 'Event',
        article_url: 'https://example.com',
        banner_url: 'https://example.com/banner.png',
        start_instant: '2026-07-08T20:00:00.000Z',
      },
    },
    'start'
  );

  assert.equal(instant?.toISOString(), '2026-07-08T20:00:00.000Z');
});
