import Graph from 'graphology'
import louvain from 'graphology-communities-louvain'
import { communityColor } from './colors'

export interface CsvRow {
  source: string
  target: string
  weight?: string
  label?: string
}

export function buildGraph(rows: CsvRow[]): Graph {
  const graph = new Graph({ multi: false, type: 'undirected' })

  for (const row of rows) {
    const src = row.source?.trim()
    const tgt = row.target?.trim()
    if (!src || !tgt || src === tgt) continue

    if (!graph.hasNode(src)) graph.addNode(src, { label: row.label || src })
    if (!graph.hasNode(tgt)) graph.addNode(tgt, { label: row.label || tgt })

    try {
      if (!graph.hasEdge(src, tgt)) graph.addEdge(src, tgt)
    } catch {
      // skip duplicate or invalid edges
    }
  }

  if (graph.order === 0) return graph

  // Community detection
  const communities = louvain(graph)

  graph.forEachNode((node) => {
    const deg = graph.degree(node)
    const community = communities[node] ?? 0
    graph.mergeNodeAttributes(node, {
      community,
      color: communityColor(community),
      size: Math.max(2, Math.sqrt(deg) * 1.5),
      // Random starting positions for FA2
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
    })
  })

  graph.forEachEdge((edge) => {
    graph.setEdgeAttribute(edge, 'size', 0.3)
    graph.setEdgeAttribute(edge, 'color', 'rgba(255,255,255,0.06)')
  })

  return graph
}
