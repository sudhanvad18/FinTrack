import { useState } from 'react'
import '../styles/Metrics.css'

function Metrics() {
  const [tab, setTab] = useState('code')
  return (
    <div className="metrics-panel">
      <div className="tab-buttons">
        <button className={tab === 'code' ? 'active' : ''} onClick={() => setTab('code')}>Code</button>
        <button className={tab === 'chart' ? 'active' : ''} onClick={() => setTab('chart')}>Chart</button>
        <button className={tab === 'metrics' ? 'active' : ''} onClick={() => setTab('metrics')}>Metrics</button>
      </div>
      <div className="tab-content">
        {tab === 'code' && <pre>{`function backtest() {
  // strategy here
}`}</pre>}
        {tab === 'chart' && <p>[Chart output goes here]</p>}
        {tab === 'metrics' && (
          <ul>
            <li>Return: 10%</li>
            <li>Sharpe: 1.4</li>
            <li>Max Drawdown: 5%</li>
          </ul>
        )}
      </div>
    </div>
  )
}

export default Metrics