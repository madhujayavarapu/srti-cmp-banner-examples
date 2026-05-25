import { useState, useRef } from 'react'
import { PageLayout, UseCaseHeader, Hero, Footer } from '../components/Layout'

function detectMimeType(b64) {
  try {
    const binary = atob(b64.replace(/\s/g, ''))
    const len = Math.min(binary.length, 8)
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)

    if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg'
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png'
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif'
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return 'image/webp'
    if (bytes[0] === 0x42 && bytes[1] === 0x4d) return 'image/bmp'
    if (binary.trimStart().startsWith('<svg') || binary.trimStart().startsWith('<?xml')) return 'image/svg+xml'
    return null
  } catch {
    return null
  }
}

function estimateBase64Size(b64) {
  const clean = b64.replace(/[^A-Za-z0-9+/]/g, '')
  return Math.floor((clean.length * 3) / 4)
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function Base64Viewer() {
  const [input, setInput] = useState('')
  const [imgSrc, setImgSrc] = useState(null)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)
  const imgRef = useRef(null)

  const renderImage = () => {
    const trimmed = input.trim()
    setError(null)
    setImgSrc(null)
    setMeta(null)

    if (!trimmed) {
      setError('Please paste a base64 string first.')
      return
    }

    let src = trimmed
    if (!trimmed.startsWith('data:')) {
      const mimeType = detectMimeType(trimmed)
      if (!mimeType) {
        setError('Invalid base64 or unsupported format.')
        return
      }
      src = `data:${mimeType};base64,${trimmed}`
    }

    setImgSrc(src)
  }

  const clearAll = () => {
    setInput('')
    setImgSrc(null)
    setError(null)
    setMeta(null)
  }

  const handleImgLoad = () => {
    const img = imgRef.current
    if (img) {
      setMeta(
        `dimensions: ${img.naturalWidth} \u00D7 ${img.naturalHeight}px \u00B7 size: ${formatBytes(estimateBase64Size(input))}`
      )
    }
  }

  const handleImgError = () => {
    setImgSrc(null)
    setError('Invalid base64 or unsupported image format.')
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') renderImage()
  }

  return (
    <PageLayout narrow>
      <UseCaseHeader badge="Base64 Viewer" badgeAccent />

      <Hero
        label="Use case"
        title="Base64 image viewer"
        description="Paste a base64-encoded image string (with or without the data URI prefix) to render and preview it instantly."
      />

      <section className="section">
        <h2 className="section-title">Input</h2>
        <div className="input-block">
          <label className="input-label" htmlFor="base64-input">Base64 string</label>
          <textarea
            id="base64-input"
            className="base64-textarea"
            placeholder="Paste base64 here — e.g. data:image/png;base64,iVBORw0KGgo... or just the raw base64 string"
            spellCheck="false"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="action-row">
            <button className="btn-render" onClick={renderImage}>Render image</button>
            <button className="btn-clear" onClick={clearAll}>Clear</button>
            {error && <span className="error-msg">{error}</span>}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Preview</h2>
        <div className="image-output">
          <div className="image-output-header">base64-image-viewer &middot; preview</div>
          <div className="image-output-body">
            {imgSrc ? (
              <img
                ref={imgRef}
                className="rendered-image"
                src={imgSrc}
                alt="Rendered base64 image"
                onLoad={handleImgLoad}
                onError={handleImgError}
              />
            ) : (
              <div className="image-placeholder">
                <div className="placeholder-icon">{'\u{1F5BC}\uFE0F'}</div>
                <p>Rendered image will appear here.</p>
              </div>
            )}
          </div>
        </div>
        {meta && <div className="image-meta">{meta}</div>}
      </section>

      <Footer />
    </PageLayout>
  )
}
