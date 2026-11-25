import sdk from '@stackblitz/sdk'
import { getProject } from './index'
import type { Framework, ProjectInput } from './types'

/** Builds the StackBlitz project for `framework` in the browser and opens it in a new tab. */
export function openStackBlitz(framework: Framework, input: ProjectInput): void {
  const build = getProject[framework]
  if (!build) throw new Error(`No StackBlitz project builder for "${framework}"`)
  sdk.openProject(build(input), { newWindow: true })
}
