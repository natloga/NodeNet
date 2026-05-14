import { useState, useEffect, useCallback } from 'react'
import Graph from 'graphology'
import { SigmaContainer } from '@react-sigma/core'
import '@react-sigma/core/lib/style.css'
import './App.css'
import { GraphInner } from './components/GraphInner'
import { NodeSidebar } from './components/NodeSidebar'
import { FileUpload } from './components/FileUpload'
import { buildGraph, type CsvRow } from './lib/buildGraph'

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

export default function App() {
  const [graph, setGraph] = useState<Graph | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [nodeCount, setNodeCount] = useState(0)
  const [edgeCount, setEdgeCount] = useState(0)

  // Load default airport dataset on mount
  useEffect(() => {
    fetch('/airports.csv')
      .then((r) => r.text())
      .then((text) => {
        const lines = text.trim().split('\n')
        const rows: CsvRow[] = lines.slice(1).map((line) => {
          const [source, target] = line.split(',')
          return { source, target }
        })
        const g = buildGraph(rows)
        setGraph(g)
        setNodeCount(g.order)
        setEdgeCount(g.size)
        setLoadState('ready')
      })
      .catch(() => setLoadState('error'))
  }, [])

  const handleData = useCallback((rows: CsvRow[]) => {
    setSelectedNode(null)
    setLoadState('loading')
    // Build on next tick so the loading state renders
    setTimeout(() => {
      const g = buildGraph(rows)
      setGraph(g)
      setNodeCount(g.order)
      setEdgeCount(g.size)
      setLoadState('ready')
    }, 50)
  }, [])

  const handleNodeClick = useCallback((node: string | null) => {
    setSelectedNode(node)
  }, [])

  return (
    <div className="app-shell">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-left">
          <span className="logo-mark">◈</span>
          <span className="logo-name">NodeNet</span>
        </div>
        <div className="topbar-center">
          {loadState === 'ready' && (
            <span className="graph-stats">
              {nodeCount.toLocaleString()} nodes · {edgeCount.toLocaleString()} edges
            </span>
          )}
          {loadState === 'loading' && (
            <span className="graph-stats">Loading…</span>
          )}
        </div>
        <div className="topbar-right">
          <FileUpload onData={handleData} />
        </div>
      </header>

      {/* Graph area */}
      <div className="graph-area">
        {loadState === 'loading' && (
          <div className="overlay-center">
            <div className="spinner" />
            <div className="overlay-label">Building graph…</div>
          </div>
        )}
        {loadState === 'error' && (
          <div className="overlay-center">
            <div className="overlay-label">Failed to load default dataset.</div>
          </div>
        )}

        {graph && (
          <SigmaContainer
            graph={graph}
            style={{ width: '100%', height: '100%', background: '#0f0f14' }}
            settings={{
              defaultEdgeColor: 'rgba(255,255,255,0.06)',
              defaultNodeColor: '#6366f1',
              labelColor: { color: '#9ca3af' },
              labelSize: 11,
              labelWeight: '400',
              labelFont: 'system-ui, sans-serif',
              renderEdgeLabels: false,
              minCameraRatio: 0.05,
              maxCameraRatio: 20,
            }}
          >
            <GraphInner
              graph={graph}
              selectedNode={selectedNode}
              onNodeClick={handleNodeClick}
            />
          </SigmaContainer>
        )}

        {/* Node sidebar */}
        {selectedNode && graph && graph.hasNode(selectedNode) && (
          <NodeSidebar
            graph={graph}
            nodeId={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}

        {/* Empty state hint */}
        {loadState === 'ready' && !selectedNode && (
          <div className="hint">Click any node to explore</div>
        )}
      </div>
    </div>
  )
}
