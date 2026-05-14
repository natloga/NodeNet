import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import Papa from 'papaparse'
import type { CsvRow } from '../lib/buildGraph'

interface Props {
  onData: (rows: CsvRow[]) => void
}

export function FileUpload({ onData }: Props) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function parseFile(file: File) {
    setError(null)
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fields = results.meta.fields ?? []
        if (!fields.includes('source') || !fields.includes('target')) {
          setError('CSV must have `source` and `target` columns.')
          return
        }
        if (results.data.length === 0) {
          setError('File appears to be empty.')
          return
        }
        onData(results.data)
      },
      error: () => setError('Could not parse CSV. Check that your file is comma-separated.'),
    })
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) parseFile(file)
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
    e.target.value = ''
  }

  return (
    <div>
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 13V3M10 3L7 6M10 3L13 6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 13v3a1 1 0 001 1h12a1 1 0 001-1v-3" strokeLinecap="round" />
        </svg>
        <span>Upload CSV</span>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={onChange}
        />
      </div>
      {error && <div className="upload-error">{error}</div>}
    </div>
  )
}
