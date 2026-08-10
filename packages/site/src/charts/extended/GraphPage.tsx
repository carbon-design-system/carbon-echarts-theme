import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { Compare } from '../../components/Compare'
import GraphMdx from '../../content/extended/graph.mdx'

// ── Les Misérables–style character network ────────────────────────────────────
// 77 characters from the novel, categorised by group (A–I), with co-appearance
// weights determining node size. Dataset is a self-contained static snapshot
// modelled after the canonical ECharts graph example.

const categories = [
  'Group A',
  'Group B',
  'Group C',
  'Group D',
  'Group E',
  'Group F',
  'Group G',
  'Group H',
  'Group I',
]

// [id, name, symbolSize, category index]
type RawNode = [string, string, number, number]
const rawNodes: RawNode[] = [
  ['0', 'Myriel', 28, 0],
  ['1', 'Napoleon', 10, 0],
  ['2', 'Mlle.Baptistine', 14, 0],
  ['3', 'Mme.Magloire', 14, 0],
  ['4', 'CountessdeLo', 10, 0],
  ['5', 'Geborand', 10, 0],
  ['6', 'Champtercier', 10, 0],
  ['7', 'Cravatte', 10, 0],
  ['8', 'Count', 10, 0],
  ['9', 'OldMan', 10, 0],
  ['10', 'Labarre', 10, 1],
  ['11', 'Valjean', 60, 1],
  ['12', 'Marguerite', 10, 1],
  ['13', 'Mme.deR', 10, 1],
  ['14', 'Isabeau', 10, 1],
  ['15', 'Gervais', 10, 1],
  ['16', 'Tholomyes', 22, 2],
  ['17', 'Listolier', 14, 2],
  ['18', 'Fameuil', 14, 2],
  ['19', 'Blacheville', 14, 2],
  ['20', 'Favourite', 14, 2],
  ['21', 'Dahlia', 14, 2],
  ['22', 'Zephine', 14, 2],
  ['23', 'Fantine', 38, 2],
  ['24', 'Mme.Thenardier', 28, 3],
  ['25', 'Thenardier', 40, 3],
  ['26', 'Cosette', 34, 3],
  ['27', 'Javert', 50, 3],
  ['28', 'Fauchelevent', 20, 4],
  ['29', 'Bamatabois', 14, 4],
  ['30', 'Perpetue', 10, 4],
  ['31', 'Simplice', 14, 4],
  ['32', 'Scaufflaire', 10, 4],
  ['33', 'Woman1', 10, 4],
  ['34', 'Judge', 14, 4],
  ['35', 'Champmathieu', 14, 4],
  ['36', 'Brevet', 14, 4],
  ['37', 'Chenildieu', 14, 4],
  ['38', 'Cochepaille', 14, 4],
  ['39', 'Pontmercy', 20, 5],
  ['40', 'Boulatruelle', 10, 6],
  ['41', 'Eponine', 30, 5],
  ['42', 'Anzelma', 10, 5],
  ['43', 'Woman2', 10, 5],
  ['44', 'MotherInnocent', 14, 4],
  ['45', 'Gribier', 10, 4],
  ['46', 'Jondrette', 10, 7],
  ['47', 'Mme.Burgon', 14, 7],
  ['48', 'Gavroche', 48, 7],
  ['49', 'Gillenormand', 24, 6],
  ['50', 'Magnon', 10, 6],
  ['51', 'Mlle.Gillenormand', 14, 6],
  ['52', 'Mme.Pontmercy', 10, 6],
  ['53', 'Mlle.Vaubois', 10, 6],
  ['54', 'Lt.Gillenormand', 10, 6],
  ['55', 'Marius', 52, 6],
  ['56', 'BaronessT', 10, 6],
  ['57', 'Mabeuf', 24, 7],
  ['58', 'Enjolras', 38, 7],
  ['59', 'Combeferre', 22, 7],
  ['60', 'Prouvaire', 18, 7],
  ['61', 'Feuilly', 18, 7],
  ['62', 'Courfeyrac', 22, 7],
  ['63', 'Bahorel', 18, 7],
  ['64', 'Bossuet', 22, 7],
  ['65', 'Joly', 18, 7],
  ['66', 'Grantaire', 18, 7],
  ['67', 'MotherPlutarch', 10, 7],
  ['68', 'Gueulemer', 20, 8],
  ['69', 'Babet', 20, 8],
  ['70', 'Claquesous', 20, 8],
  ['71', 'Montparnasse', 24, 8],
  ['72', 'Toussaint', 10, 1],
  ['73', 'Child1', 10, 8],
  ['74', 'Child2', 10, 8],
  ['75', 'Brujon', 18, 8],
  ['76', 'Mme.Hucheloup', 14, 7],
]

// [source, target]
type RawLink = [string, string]
const rawLinks: RawLink[] = [
  ['1', '0'],
  ['2', '0'],
  ['3', '0'],
  ['3', '2'],
  ['4', '0'],
  ['5', '0'],
  ['6', '0'],
  ['7', '0'],
  ['8', '0'],
  ['9', '0'],
  ['11', '10'],
  ['11', '3'],
  ['11', '2'],
  ['11', '0'],
  ['12', '11'],
  ['13', '11'],
  ['14', '11'],
  ['15', '11'],
  ['17', '16'],
  ['18', '16'],
  ['18', '17'],
  ['19', '16'],
  ['19', '17'],
  ['19', '18'],
  ['20', '16'],
  ['20', '17'],
  ['20', '18'],
  ['20', '19'],
  ['21', '16'],
  ['21', '17'],
  ['21', '18'],
  ['21', '19'],
  ['21', '20'],
  ['22', '16'],
  ['22', '17'],
  ['22', '18'],
  ['22', '19'],
  ['22', '20'],
  ['22', '21'],
  ['23', '16'],
  ['23', '17'],
  ['23', '18'],
  ['23', '19'],
  ['23', '20'],
  ['23', '21'],
  ['23', '22'],
  ['23', '12'],
  ['23', '11'],
  ['24', '23'],
  ['24', '11'],
  ['25', '24'],
  ['25', '23'],
  ['25', '11'],
  ['26', '24'],
  ['26', '11'],
  ['26', '16'],
  ['27', '11'],
  ['27', '23'],
  ['27', '25'],
  ['27', '24'],
  ['28', '11'],
  ['28', '27'],
  ['29', '23'],
  ['29', '27'],
  ['29', '11'],
  ['30', '23'],
  ['31', '30'],
  ['31', '11'],
  ['31', '23'],
  ['32', '11'],
  ['33', '11'],
  ['33', '27'],
  ['34', '11'],
  ['34', '29'],
  ['35', '11'],
  ['35', '34'],
  ['35', '29'],
  ['36', '34'],
  ['36', '35'],
  ['36', '11'],
  ['36', '29'],
  ['37', '34'],
  ['37', '35'],
  ['37', '36'],
  ['37', '11'],
  ['37', '29'],
  ['38', '34'],
  ['38', '35'],
  ['38', '36'],
  ['38', '37'],
  ['38', '11'],
  ['38', '29'],
  ['39', '25'],
  ['40', '25'],
  ['41', '24'],
  ['41', '25'],
  ['42', '41'],
  ['42', '25'],
  ['43', '11'],
  ['43', '26'],
  ['43', '27'],
  ['44', '28'],
  ['44', '11'],
  ['45', '28'],
  ['45', '44'],
  ['47', '46'],
  ['48', '47'],
  ['48', '25'],
  ['48', '27'],
  ['48', '11'],
  ['49', '26'],
  ['50', '49'],
  ['51', '49'],
  ['51', '26'],
  ['52', '51'],
  ['52', '39'],
  ['53', '51'],
  ['54', '51'],
  ['55', '51'],
  ['55', '49'],
  ['55', '39'],
  ['55', '26'],
  ['55', '11'],
  ['55', '16'],
  ['55', '25'],
  ['55', '41'],
  ['55', '48'],
  ['56', '55'],
  ['56', '49'],
  ['57', '55'],
  ['57', '41'],
  ['57', '48'],
  ['58', '55'],
  ['58', '48'],
  ['58', '27'],
  ['59', '58'],
  ['60', '48'],
  ['60', '58'],
  ['61', '48'],
  ['61', '58'],
  ['61', '60'],
  ['62', '55'],
  ['62', '58'],
  ['62', '59'],
  ['63', '48'],
  ['63', '58'],
  ['63', '59'],
  ['63', '62'],
  ['64', '55'],
  ['64', '62'],
  ['64', '48'],
  ['64', '63'],
  ['64', '58'],
  ['64', '59'],
  ['65', '63'],
  ['65', '64'],
  ['65', '48'],
  ['65', '62'],
  ['65', '58'],
  ['66', '64'],
  ['66', '58'],
  ['66', '59'],
  ['66', '62'],
  ['66', '65'],
  ['67', '57'],
  ['68', '25'],
  ['68', '27'],
  ['68', '48'],
  ['69', '25'],
  ['69', '68'],
  ['69', '27'],
  ['70', '25'],
  ['70', '69'],
  ['70', '68'],
  ['70', '27'],
  ['71', '27'],
  ['71', '69'],
  ['71', '68'],
  ['71', '70'],
  ['72', '26'],
  ['72', '11'],
  ['73', '48'],
  ['74', '48'],
  ['74', '73'],
  ['75', '68'],
  ['75', '69'],
  ['75', '25'],
  ['75', '71'],
  ['76', '64'],
  ['76', '65'],
  ['76', '66'],
  ['76', '63'],
  ['76', '62'],
]

// Build the nodes array (labels shown only on large nodes, like the official example)
const graphNodes = rawNodes.map(([id, name, size, catIdx]) => ({
  id,
  name,
  symbolSize: size,
  category: catIdx,
  label: { show: size > 30 },
}))

const graphLinks = rawLinks.map(([source, target]) => ({ source, target }))

// ── Option 1: Force-directed layout ──────────────────────────────────────────
// Uses ECharts' built-in physics simulation to spread nodes naturally.
// `layout: 'force'` positions nodes automatically — no manual x/y needed.
const graphForceOption = {
  tooltip: { trigger: 'item' as const },
  legend: [{ data: categories }],
  series: [
    {
      name: 'Les Misérables',
      type: 'graph' as const,
      layout: 'force' as const,
      data: graphNodes,
      links: graphLinks,
      categories: categories.map((name) => ({ name })),
      roam: true,
      // White text on black pill — matches the alluvial preset label style and
      // ensures readable contrast against any node color or background.
      label: {
        show: false,
        position: 'right' as const,
        formatter: '{b}',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: [2, 4],
      },
      labelLayout: { hideOverlap: true },
      force: {
        repulsion: 200,
        gravity: 0.1,
        edgeLength: [30, 100],
        layoutAnimation: true,
      },
      lineStyle: {
        color: 'source' as const,
        curveness: 0.3,
        opacity: 0.7,
      },
      emphasis: { focus: 'adjacency' as const },
      selectedMode: false,
    },
  ],
}

// ── Option 2: Circular layout ─────────────────────────────────────────────────
// `center` + generous inset keep the ring and its rotated labels inside the
// canvas. `rotateLabel: true` rotates each label tangentially to the ring so
// it reads outward — far better than a fixed `position: 'right'` which only
// works for nodes on the right half.
const graphCircularOption = {
  tooltip: { trigger: 'item' as const },
  legend: [{ data: categories }],
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut' as const,
  series: [
    {
      name: 'Les Misérables',
      type: 'graph' as const,
      layout: 'circular' as const,
      // Pull the ring in from all edges so rotated labels don't clip
      center: ['50%', '52%'],
      // Leave ~15 % on each side for the labels that extend beyond the ring
      left: '15%',
      right: '15%',
      top: '8%',
      bottom: '12%',
      circular: { rotateLabel: true },
      data: graphNodes,
      links: graphLinks,
      categories: categories.map((name) => ({ name })),
      roam: true,
      // White text on black pill — matches the alluvial preset label style.
      label: {
        show: true,
        formatter: '{b}',
        fontSize: 10,
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: [2, 4],
      },
      labelLayout: { hideOverlap: true },
      lineStyle: {
        color: 'source' as const,
        curveness: 0.3,
        opacity: 0.6,
      },
      emphasis: { focus: 'adjacency' as const },
    },
  ],
}

const codeDefault = `const option = {
  tooltip: { trigger: 'item' },
  legend: [{ data: categories }],
  series: [{
    type: 'graph',
    layout: 'force',
    data: nodes, // [{ id, name, symbolSize, category }]
    links: links, // [{ source, target }]
    categories: categories.map(name => ({ name })),
    roam: true,
    label: { show: false, position: 'right', formatter: '{b}', color: '#ffffff', backgroundColor: '#000000', padding: [2, 4] },
    labelLayout: { hideOverlap: true },
    force: { repulsion: 200, gravity: 0.1, edgeLength: [30, 100] },
    lineStyle: { color: 'source', curveness: 0.3, opacity: 0.7 },
    emphasis: { focus: 'adjacency' },
  }],
}`

const codeCircular = `const option = {
  tooltip: { trigger: 'item' },
  legend: [{ data: categories }],
  series: [{
    type: 'graph',
    layout: 'circular',
    center: ['50%', '52%'],
    left: '15%', right: '15%', top: '8%', bottom: '12%',
    circular: { rotateLabel: true },
    data: nodes,
    links: links,
    categories: categories.map(name => ({ name })),
    roam: true,
    label: { show: true, formatter: '{b}', fontSize: 10, color: '#ffffff', backgroundColor: '#000000', padding: [2, 4] },
    labelLayout: { hideOverlap: true },
    lineStyle: { color: 'source', curveness: 0.3, opacity: 0.6 },
    emphasis: { focus: 'adjacency' },
  }],
}`

export function GraphPage() {
  return (
    <ChartPage
      title="Graph (Network)"
      description="Visualize relationships between entities as nodes and edges."
      overview={<GraphMdx />}
      examples={
        <>
          <Compare
            title="Character co-appearance network — force layout"
            echartsOption={graphForceOption}
            extended
            height="560px"
            optionCode={codeDefault}
          />
          <Compare
            title="Character co-appearance network — circular layout"
            echartsOption={graphCircularOption}
            extended
            height="600px"
            optionCode={codeCircular}
          />
        </>
      }
    />
  )
}
