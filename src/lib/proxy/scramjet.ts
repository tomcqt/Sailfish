import type * as ControllerModule from '@mercuryworkshop/scramjet-controller';

/** The shape of the global set by /controller/controller.api.js */
export type ScramjetControllerGlobal = typeof ControllerModule;
export type Controller = ControllerModule.Controller;
export type Frame = ControllerModule.Frame;

// The packages own types already declare a global `$scramjetController` as
// always defined. Read it through a loose view of globalThis instead so a
// missing script produces a clear error rather than a TypeError.
const scope = globalThis as { $scramjetController?: ScramjetControllerGlobal };

/**
 * Gets the Scramjet controller.
 * @returns the controller module from its global.
 *
 * We read the global instead of importing the npm entry at runtime as the npm
 * entry is a stub that reads the same global at import time, which can run too
 * early in dev. Type-only imports above stay safe.
 * @throws if index.html did not load the runtime scripts.
 */
export function getScramjetController(): ScramjetControllerGlobal {
  const mod = scope.$scramjetController;
  if (!mod) {
    throw new Error(
      'Scramjet controller not loaded. Check that index.html loads ' +
        '/scramjet/scramjet.js and /controller/controller.api.js before the ' +
        'app.',
    );
  }
  return mod;
}
