import { useEffect } from 'react'

export default function useExternalScript(
  src,
  attributes = {},
  target = 'body',
  enabled = true,
  resetKey = '',
) {
  const attributesKey = JSON.stringify(attributes)

  useEffect(() => {
    if (!enabled) return

    const script = document.createElement('script')
    script.src = src
    script.defer = true

    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value)
    })

    const parent = target === 'head' ? document.head : document.body
    parent.appendChild(script)

    return () => {
      script.remove()
    }
  }, [src, attributesKey, target, enabled, resetKey])
}
