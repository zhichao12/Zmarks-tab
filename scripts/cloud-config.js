/*
 * 云配置存取封装
 * - 优先读写远端（D1/KV 后端接口），失败则回落到 localStorage
 * - 远端接口需由后端提供：GET/PUT {base}/api/zmarks/config/:key
 * - API 基础地址优先取 window.ZMARKS_API_BASE，其次 localStorage.zmarksApiBase
 */

const ZMARKS_CONFIG_LOCAL_PREFIX = 'zmarks_config_'

function getApiBase() {
  return window.ZMARKS_API_BASE || localStorage.getItem('zmarksApiBase') || ''
}

function getApiKey() {
  return window.ZMARKS_API_KEY || localStorage.getItem('zmarksApiKey') || ''
}

async function fetchConfigRemote(key) {
  const base = getApiBase()
  if (!base) return null
  try {
    const headers = {}
    const apiKey = getApiKey()
    if (apiKey) headers['X-API-Key'] = apiKey
    const res = await fetch(`${base}/api/zmarks/config/${encodeURIComponent(key)}`, {
      method: 'GET',
      headers,
      credentials: 'include'
    })
    if (!res.ok) throw new Error(`fetch ${key} failed: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn('[cloud-config] remote load failed', err)
    return null
  }
}

async function saveConfigRemote(key, value) {
  const base = getApiBase()
  if (!base) return false
  try {
    const headers = { 'Content-Type': 'application/json' }
    const apiKey = getApiKey()
    if (apiKey) headers['X-API-Key'] = apiKey
    const res = await fetch(`${base}/api/zmarks/config/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({ value })
    })
    if (!res.ok) throw new Error(`save ${key} failed: ${res.status}`)
    return true
  } catch (err) {
    console.warn('[cloud-config] remote save failed', err)
    return false
  }
}

function loadConfigLocal(key) {
  try {
    const raw = localStorage.getItem(`${ZMARKS_CONFIG_LOCAL_PREFIX}${key}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveConfigLocal(key, value) {
  try {
    localStorage.setItem(`${ZMARKS_CONFIG_LOCAL_PREFIX}${key}`, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn('[cloud-config] local save failed', err)
    return false
  }
}

async function loadCloudConfig(key) {
  const remote = await fetchConfigRemote(key)
  if (remote !== null && remote !== undefined) {
    saveConfigLocal(key, remote)
    return remote
  }
  return loadConfigLocal(key)
}

async function saveCloudConfig(key, value) {
  saveConfigLocal(key, value)
  await saveConfigRemote(key, value)
}
