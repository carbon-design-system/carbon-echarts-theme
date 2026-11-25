import type { Project } from '@stackblitz/sdk'

export type Framework = 'react' | 'vanilla' | 'vue' | 'svelte' | 'angular'

export const FRAMEWORKS: readonly Framework[] = ['react', 'vanilla', 'vue', 'svelte', 'angular']

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: 'React',
  vanilla: 'Vanilla JS',
  vue: 'Vue',
  svelte: 'Svelte',
  angular: 'Angular',
}

export interface ProjectInput {
  /** Human-readable chart title, used for the page and toolbar/export file names. */
  title: string
  /** Verbatim source of the variant file; it `export`s a single `option`. */
  optionSource: string
}

export type ProjectBuilder = (input: ProjectInput) => Project
