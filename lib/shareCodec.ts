// lib/shareCodec.ts
import LZString from 'lz-string'
import type { BuildSnapshot } from '@/types/build'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'

export function encodeBuildToShareCode(snapshot: BuildSnapshot): string {
  const json = JSON.stringify(snapshot)
  return LZString.compressToEncodedURIComponent(json)
}

export function decodeBuildFromShareCode(code: string): BuildSnapshot {
  if (!code?.trim()) {
    throw new Error('EMPTY_SHARE_CODE')
  }

  const json = LZString.decompressFromEncodedURIComponent(code)
  if (!json) {
    throw new Error('INVALID_COMPRESSED_DATA')
  }

  let snapshot: BuildSnapshot
  try {
    snapshot = JSON.parse(json) as BuildSnapshot
  } catch {
    throw new Error('INVALID_JSON_PAYLOAD')
  }

  if (snapshot.schemaVersion !== '1.0.0') {
    throw new Error('UNSUPPORTED_SCHEMA_VERSION')
  }

  return normalizeBuildSnapshot(snapshot)
}
