import { useEffect, useRef } from 'react'
import Graph from 'graphology'
import {
  useLoadGraph,
  useRegisterEvents,
  useSigma,
  useSetSettings,
} from '@react-sigma/core'
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2'

interface Props {
  graph: Graph | null
  selectedNode: string | null
  onNodeClick: (node: string | null) => void
}

const DIM_COLOR = 'rgba(20,20,30,0.92)'
const DIM_EDGE = 'rgba(255,255,255,0.01)'
const HIGHLIGHT_EDGE = 'rgba(255,255,255,0.55)'

export function GraphInner({ graph, selectedNode, onNodeClick }: Props) {
  const sigma = useSigma()
  const loadGraph = useLoadGraph()
  const registerEvents = useRegisterEvents()
  const setSettings = useSetSettings()
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevGraphRef = useRef<Graph | null>(null)

  const { start, stop, kill } = useWorkerLayoutForceAtlas2({
    settings: { barnesHutOptimize: true, slowDown: 5 },
  })

  // On first mount the graph is already loaded via SigmaContainer's `graph` prop.
  // On subsequent mounts (new CSV) we reload and restart FA2.
  useEffect(() => {
    if (!graph) return

    if (prevGraphRef.current !== null) {
      // Replacing graph — reload into Sigma
      loadGraph(graph, true)
    }
    prevGraphRef.current = graph

    // Clear any previous stop timer and restart FA2
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
    start()
    stopTimerRef.current = setTimeout(() => stop(), 6000)

    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
    }
  }, [graph]) // eslint-disable-line react-hooks/exhaustive-deps

  // Kill FA2 worker on unmount
  useEffect(() => {
    return () => { kill() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Click events
  useEffect(() => {
    registerEvents({
      clickNode: ({ node }) => onNodeClick(node),
      clickStage: () => onNodeClick(null),
    })
  }, [registerEvents, onNodeClick])

  // Highlight selected node + neighbors; dim everything else
  useEffect(() => {
    if (!selectedNode) {
      setSettings({ nodeReducer: null, edgeReducer: null })
      sigma.refresh()
      return
    }

    const g = sigma.getGraph()

    setSettings({
      nodeReducer: (node, data) => {
        if (node === selectedNode) return { ...data, highlighted: true, zIndex: 2 }
        if (g.hasNode(selectedNode) && g.neighbors(selectedNode).includes(node)) {
          return { ...data, highlighted: true, zIndex: 1 }
        }
        return { ...data, color: DIM_COLOR, label: undefined, zIndex: 0 }
      },
      edgeReducer: (edge, data) => {
        if (g.extremities(edge).includes(selectedNode)) {
          return { ...data, color: HIGHLIGHT_EDGE, size: 1.5, zIndex: 1 }
        }
        return { ...data, color: DIM_EDGE, zIndex: 0 }
      },
    })
    sigma.refresh()
  }, [selectedNode, sigma]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
