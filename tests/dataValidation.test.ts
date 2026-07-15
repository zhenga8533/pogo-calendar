import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseRaidBossData,
  parseResearchTaskData,
} from '../src/services/dataValidation.ts';

test('accepts leak-duck resource rewards and nullable assets', () => {
  const parsed = parseResearchTaskData({
    Tasks: [
      {
        task: 'Power up a Pokémon',
        rewards: [
          {
            type: 'resource',
            name: 'Stardust',
            quantity: 500,
            asset_url: null,
          },
        ],
      },
    ],
  });

  assert.equal(parsed.Tasks[0].rewards[0].type, 'resource');
  assert.equal(parsed.Tasks[0].rewards[0].asset_url, null);
});

test('accepts string raid tiers and nullable CP ranges', () => {
  const parsed = parseRaidBossData({
    'Mega Raids': [
      {
        name: 'Mega Example',
        tier: 'Mega Raids',
        shiny_available: false,
        cp_range: null,
        boosted_cp_range: null,
        types: ['Water'],
        asset_url: null,
      },
    ],
  });

  assert.equal(parsed['Mega Raids'][0].tier, 'Mega Raids');
  assert.equal(parsed['Mega Raids'][0].cp_range, null);
});

test('rejects malformed remote records with a useful path', () => {
  assert.throws(
    () =>
      parseResearchTaskData({
        Tasks: [{ task: 'Broken', rewards: [{ type: 'item' }] }],
      }),
    /research_tasks\.Tasks\[0\]\.rewards\[0\]\.name/
  );
});
