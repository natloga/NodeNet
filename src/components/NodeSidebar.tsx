import Graph from 'graphology'
import { communityColor } from '../lib/colors'

interface Props {
  graph: Graph
  nodeId: string
  onClose: () => void
}

export function NodeSidebar({ graph, nodeId, onClose }: Props) {
  if (!graph.hasNode(nodeId)) return null

  const attrs = graph.getNodeAttributes(nodeId)
  const label = attrs.label || nodeId
  const degree = graph.degree(nodeId)
  const community = attrs.community ?? 0
  const color = communityColor(community)
  const neighbors = graph.neighbors(nodeId).sort()

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="node-dot" style={{ background: color }} />
          <span>{label}</span>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div className="stat-grid">
        <StatItem label="Connections" value={degree.toLocaleString()} />
        <StatItem label="Community" value={`Cluster ${community + 1}`} accent={color} />
      </div>

      <div className="neighbors-section">
        <div className="neighbors-label">
          Connected to ({neighbors.length.toLocaleString()})
        </div>
        <ul className="neighbors-list">
          {neighbors.slice(0, 50).map((n) => (
            <li key={n} className="neighbor-item">
              <span
                className="neighbor-dot"
                style={{
                  background: communityColor(
                    graph.getNodeAttribute(n, 'community') ?? 0
                  ),
                }}
              />
              {graph.getNodeAttribute(n, 'label') || n}
            </li>
          ))}
          {neighbors.length > 50 && (
            <li className="neighbor-more">
              +{neighbors.length - 50} more
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

function StatItem({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: string
}) {
  return (
    <div className="stat-item">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
    </div>
  )
}
