import assert from 'node:assert/strict';
import { test } from 'node:test';
// @ts-expect-error Node uses explicit TypeScript extensions for this test command.
import { permitsLocalMedia, permittedMediaId } from './local-media-policy.ts';
test('local screenshot access is available only in development', () => {
  assert.equal(permitsLocalMedia('development'), true);
  for (const mode of ['production', 'test', '', undefined]) assert.equal(permitsLocalMedia(mode), false);
});
test('only known screenshot identifiers and their thumbnail variants resolve', () => {
  const ids = ['steam-screenshot-0', 'steam-screenshot-1'];
  assert.equal(permittedMediaId('steam-screenshot-0', ids), true);
  assert.equal(permittedMediaId('steam-screenshot-0-thumb', ids), true);
  assert.equal(permittedMediaId('reference-equipment-packager', [...ids, 'reference-equipment-packager']), true);
  assert.equal(permittedMediaId('reference-equipment-unknown', ids), false);
  assert.equal(permittedMediaId('reference-content-toothbrush', ['reference-content-toothbrush']), true);
  assert.equal(permittedMediaId('reference-content-../toothbrush', ['reference-content-toothbrush']), false);
  assert.equal(permittedMediaId('reference-equipment-../packager', [...ids, 'reference-equipment-packager']), false);
  for (const id of ['steam-screenshot-2', '../steam-screenshot-0', 'steam-screenshot-0.webp', '%2e%2e%2fsteam-screenshot-0', 'steam-screenshot-0/thumb', 'steam-screenshot-0-thumb-thumb']) assert.equal(permittedMediaId(id, ids), false);
});
