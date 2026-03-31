import cn from '../memes-shared.module.css'

import classNames from 'classnames'

export type MemeEditorTab = 'own' | 'ready'

interface TabSwitchProps {
  activeTab: MemeEditorTab
  onChange: (tab: MemeEditorTab) => void
}

export const TabSwitch = ({
  activeTab,
  onChange,
}: Readonly<TabSwitchProps>) => (
  <div className={cn.tabSwitch} role="tablist" aria-label="Meme type tabs">
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === 'own'}
      className={classNames(
        cn.tabItem,
        activeTab === 'own' && cn.tabItemActive,
      )}
      onClick={() => onChange('own')}
    >
      O'zining memi
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === 'ready'}
      className={classNames(
        cn.tabItem,
        activeTab === 'ready' && cn.tabItemActive,
      )}
      onClick={() => onChange('ready')}
    >
      Tayyor memlar
    </button>
  </div>
)
