// hooks/useEditorShareCodeFlow.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { decodeBuildFromShareCode, encodeBuildToShareCode } from '@/lib/shareCodec'

export function useEditorShareCodeFlow(options: { hydrationDone: boolean }) {
  const { hydrationDone } = options
  const [codeInput, setCodeInput] = useState('')
  const didImportFromUrlRef = useRef(false)

  const importSnapshot = useBuildStore((s) => s.importSnapshot)
  const exportSnapshot = useBuildStore((s) => s.exportSnapshot)

  const handleImport = useCallback(() => {
    const raw = codeInput.trim()
    if (!raw) {
      alert('請先貼上流派碼。')
      return
    }
    try {
      const parsed = decodeBuildFromShareCode(raw)
      importSnapshot(parsed)
    } catch (e) {
      console.error(e)
      alert('匯入失敗：請確認為有效的流派碼字串。')
    }
  }, [codeInput, importSnapshot])

  const handleExport = useCallback(() => {
    try {
      const code = encodeBuildToShareCode(exportSnapshot())
      setCodeInput(code)
    } catch (e) {
      console.error(e)
      alert('匯出失敗。')
    }
  }, [exportSnapshot])

  const handleCopy = useCallback(async () => {
    const raw = codeInput.trim()
    if (!raw) {
      alert('請先匯出或貼上流派碼。')
      return
    }
    try {
      await navigator.clipboard.writeText(raw)
    } catch {
      alert('無法複製到剪貼簿。')
    }
  }, [codeInput])

  useEffect(() => {
    if (!hydrationDone) return
    if (didImportFromUrlRef.current) return

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) return

    didImportFromUrlRef.current = true
    try {
      const parsed = decodeBuildFromShareCode(code)
      importSnapshot(parsed)
      setCodeInput(code)
    } catch (error) {
      console.error(error)
      alert('從網址匯入分享碼失敗，請確認網址內容。')
    }
  }, [hydrationDone, importSnapshot])

  return {
    codeInput,
    setCodeInput,
    handleImport,
    handleExport,
    handleCopy,
  }
}
