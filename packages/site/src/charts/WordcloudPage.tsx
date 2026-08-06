import React from 'react'
import 'echarts-wordcloud'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import WordcloudMdx from '../content/wordcloud.mdx'
import {
  wordcloudBasic,
  wordcloudCircular,
  wordcloudDiamond,
  wordData,
} from '../data/echarts/wordcloud'

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
            optionCode={circleCode}
            chartData={wordData}
          />
          <Compare
            title="Word cloud — diamond"
            echartsOption={wordcloudDiamond}
            extended
            optionCode={diamondCode}
            chartData={wordData}
          />
          <Compare
            title="Word cloud — basic"
            echartsOption={wordcloudBasic}
            extended
            optionCode={basicCode}
            chartData={wordData}
          />
        </>
      }
    />
  )
}
