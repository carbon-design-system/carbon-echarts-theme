import React from 'react'
import 'echarts-wordcloud'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import WordcloudMdx from '../content/wordcloud.mdx'
import { wordcloudBasic, wordcloudCircular, wordcloudDiamond } from '../data/echarts/wordcloud'

const circleCode = `import { createWordCloudOptions } from '@carbon/echarts-theme/presets'

const words = [
  { name: 'Carbon', value: 100 },
  { name: 'ECharts', value: 80 },
  // ...
]

const option = createWordCloudOptions(words, { shape: 'circle' })`

const diamondCode = `import { createWordCloudOptions } from '@carbon/echarts-theme/presets'

const words = [{ name: 'Carbon', value: 100 }, /* ... */]

const option = createWordCloudOptions(words, { shape: 'diamond' })`

const basicCode = `import { createWordCloudOptions } from '@carbon/echarts-theme/presets'

const words = [{ name: 'Carbon', value: 100 }, /* ... */]

const option = createWordCloudOptions(words)`

export function WordcloudPage() {
  return (
    <ChartPage
      title="Word cloud"
      description="Display text data where word size encodes frequency or weight."
      overview={<WordcloudMdx />}
      examples={
        <>
          <Compare
            title="Word cloud — circle"
            echartsOption={wordcloudCircular}
            extended
            echartsCode={circleCode}
          />
          <Compare
            title="Word cloud — diamond"
            echartsOption={wordcloudDiamond}
            extended
            echartsCode={diamondCode}
          />
          <Compare
            title="Word cloud — basic"
            echartsOption={wordcloudBasic}
            extended
            echartsCode={basicCode}
          />
        </>
      }
    />
  )
}
