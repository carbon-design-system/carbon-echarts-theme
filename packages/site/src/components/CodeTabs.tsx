import React from 'react'

type Tab = 'echarts' | 'carbon' | 'json'

interface CodeTabsProps {
  echartsCode: string
  carbonCode?: string
  optionsJson?: string
}

export function CodeTabs({ echartsCode, carbonCode, optionsJson }: CodeTabsProps) {
  const [activeTab, setActiveTab] = React.useState<Tab>('echarts')

  const tabs: { id: Tab; label: string; content: string | undefined }[] = [
    { id: 'echarts', label: 'ECharts', content: echartsCode },
    { id: 'carbon', label: 'Carbon Charts', content: carbonCode },
    { id: 'json', label: 'Options (JSON)', content: optionsJson },
  ].filter((t) => t.content != null) as { id: Tab; label: string; content: string }[]

  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  function handleCopy() {
    if (active?.content) {
      void navigator.clipboard.writeText(active.content)
    }
  }

  return (
    <div className="code-tabs">
      <div className="code-tabs__bar" role="tablist" aria-label="Code examples">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active?.id === t.id}
            className={`code-tabs__tab${active?.id === t.id ? ' code-tabs__tab--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          className="code-tabs__copy"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
        >
          Copy
        </button>
      </div>
      <pre className="code-tabs__content" role="tabpanel">
        <code>{active?.content}</code>
      </pre>
    </div>
  )
}
