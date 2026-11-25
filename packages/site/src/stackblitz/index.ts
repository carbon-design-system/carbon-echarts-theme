import type { Framework, ProjectBuilder } from './types'
import { getAngularProject } from './angular'
import { getReactProject } from './react'
import { getSvelteProject } from './svelte'
import { getVanillaProject } from './vanilla'
import { getVueProject } from './vue'

export { FRAMEWORKS, FRAMEWORK_LABELS } from './types'
export type { Framework, ProjectInput, ProjectBuilder } from './types'

/** Builders that exist so far; frameworks are added one at a time. */
export const getProject: Partial<Record<Framework, ProjectBuilder>> = {
  react: getReactProject,
  angular: getAngularProject,
  vanilla: getVanillaProject,
  svelte: getSvelteProject,
  vue: getVueProject,
}
