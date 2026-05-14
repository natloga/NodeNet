export const COMMUNITY_COLORS = [
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#84cc16', // lime
  '#06b6d4', // cyan
  '#a855f7', // purple
  '#fb7185', // rose
  '#34d399', // green
  '#fbbf24', // yellow
  '#60a5fa', // light blue
]

export function communityColor(community: number): string {
  return COMMUNITY_COLORS[community % COMMUNITY_COLORS.length]
}
