import React from 'react'
import { ChartPage } from '../components/ChartPage'
import WordcloudMdx from '../content/wordcloud.mdx'

export function WordcloudPage() {
  return (
    <ChartPage
      title="Word cloud"
      description="Display text data where word size encodes frequency or weight."
      overview={<WordcloudMdx />}
      v2Only
    />
  )
}
