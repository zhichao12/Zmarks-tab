/*
 * 云书签面板：调用 tmarks API /api/bookmarks，使用 cloud-config.js 中的 API 基址与 X-API-Key
 * UI 复用顶部图标风格，点击左上云图标展开列表。
 */

const cloudBookmarkCont = document.getElementById('cloudBookmarkCont')
const cloudBookmarkPanel = document.getElementById('cloudBookmarksPanel')
const cloudBookmarkList = document.getElementById('cloudBookmarkList')
const cloudBookmarkStatus = document.getElementById('cloudBookmarkStatus')
const cloudBookmarkSearch = document.getElementById('cloudBookmarkSearch')
const cloudBookmarkReload = document.getElementById('cloudBookmarkReload')
const cloudBookmarkClose = document.getElementById('cloudBookmarkClose')
const cloudApiBaseInput = document.getElementById('cloudApiBaseInput')
const cloudApiKeyInput = document.getElementById('cloudApiKeyInput')
const cloudApiSave = document.getElementById('cloudApiSave')
const cloudApiClear = document.getElementById('cloudApiClear')
const cloudConfigStatus = document.getElementById('cloudConfigStatus')

function normalizeApiBase(raw) {
  if (!raw) return ''
  try {
    const url = new URL(raw)
    // 去掉末尾的 /，保持统一
    return `${url.origin}${url.pathname.replace(/\/$/, '')}`
  } catch {
    return ''
  }
}

function getApiBase() {
  return normalizeApiBase(window.ZMARKS_API_BASE || localStorage.getItem('zmarksApiBase') || '')
}
function getApiKey() {
  return window.ZMARKS_API_KEY || localStorage.getItem('zmarksApiKey') || ''
}

async function fetchCloudBookmarks(keyword = '') {
  const base = getApiBase()
  if (!base) {
    throw new Error('未配置 API Base（zmarksApiBase）')
  }
  const headers = {}
  const apiKey = getApiKey()
  if (apiKey) headers['X-API-Key'] = apiKey
  const url = new URL(`${base}/api/bookmarks`)
  url.searchParams.set('page_size', '100')
  if (keyword) url.searchParams.set('keyword', keyword)

  const res = await fetch(url.toString(), { headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text}`)
  }
  const json = await res.json()
  return json.data?.bookmarks || []
}

function renderCloudBookmarks(list) {
  if (!list || list.length === 0) {
    cloudBookmarkList.innerHTML = '<div class="cloud-empty">暂无书签</div>'
    return
  }
  const html = list
    .map(
      (b) => `
      <div class="cloud-bookmark-item">
        <div class="cloud-bookmark-main">
          <a href="${b.url}" target="_blank" rel="noreferrer">${escapeHtml(b.title || b.url)}</a>
          <span class="cloud-bookmark-domain">${escapeHtml(new URL(b.url).hostname)}</span>
        </div>
        <div class="cloud-bookmark-tags">
          ${(b.tags || [])
            .map((t) => `<span class="cloud-tag" style="${t.color ? `background:${t.color};` : ''}">${escapeHtml(t.name)}</span>`)
            .join('')}
        </div>
      </div>`
    )
    .join('')
  cloudBookmarkList.innerHTML = html
}

function escapeHtml(str) {
  if (!str) return ''
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]))
}

async function loadCloudBookmarks() {
  cloudBookmarkStatus.textContent = '加载中...'
  if (cloudConfigStatus) cloudConfigStatus.textContent = ''
  try {
    const keyword = cloudBookmarkSearch.value.trim()
    const list = await fetchCloudBookmarks(keyword)
    renderCloudBookmarks(list)
    cloudBookmarkStatus.textContent = `已加载 ${list.length} 条`
  } catch (err) {
    console.error(err)
    cloudBookmarkStatus.textContent = `加载失败：${err.message}`
    cloudBookmarkList.innerHTML = ''
    if (cloudConfigStatus) {
      const msg = err.message.includes('未配置 API Base')
        ? '请先在上方填写 API 基址并保存'
        : err.message
      setCloudConfigStatus(msg, true)
    }
  }
}

function toggleCloudPanel(show) {
  const visible = show ?? cloudBookmarkPanel.style.display !== 'grid'
  cloudBookmarkPanel.style.display = visible ? 'grid' : 'none'
  if (visible) {
    loadCloudBookmarks()
    cloudBookmarkSearch.focus()
  }
}

if (cloudBookmarkCont) {
  cloudBookmarkCont.addEventListener('click', () => toggleCloudPanel(true))
}
if (cloudBookmarkClose) {
  cloudBookmarkClose.addEventListener('click', () => toggleCloudPanel(false))
}
if (cloudBookmarkReload) {
  cloudBookmarkReload.addEventListener('click', () => loadCloudBookmarks())
}
if (cloudBookmarkSearch) {
  cloudBookmarkSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      loadCloudBookmarks()
    }
  })
}

function setCloudConfigStatus(text, isError = false) {
  if (!cloudConfigStatus) return
  cloudConfigStatus.textContent = text
  cloudConfigStatus.style.color = isError ? '#ff6b6b' : ''
}

// 云配置输入区初始化与保存
function initCloudConfigForm() {
  if (!cloudApiBaseInput || !cloudApiSave) return

  cloudApiBaseInput.value = getApiBase()
  if (cloudApiKeyInput) cloudApiKeyInput.value = getApiKey()
  if (!cloudApiBaseInput.value && cloudBookmarkStatus) {
    cloudBookmarkStatus.textContent = '未配置 API Base'
  }

  const save = () => {
    const base = normalizeApiBase(cloudApiBaseInput.value.trim())
    const key = cloudApiKeyInput ? cloudApiKeyInput.value.trim() : ''

    if (!base) {
      setCloudConfigStatus('请填写有效的 API 基址（如 https://example.com）', true)
      return
    }
    localStorage.setItem('zmarksApiBase', base)
    if (key) {
      localStorage.setItem('zmarksApiKey', key)
    } else {
      localStorage.removeItem('zmarksApiKey')
    }
    setCloudConfigStatus('已保存，可点击 ↻ 重新加载云书签')
    if (cloudBookmarkPanel && cloudBookmarkPanel.style.display !== 'none') {
      loadCloudBookmarks()
    }
  }

  cloudApiSave.addEventListener('click', save)
  cloudApiBaseInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') save()
  })
  if (cloudApiKeyInput) {
    cloudApiKeyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') save()
    })
  }
  if (cloudApiClear) {
    cloudApiClear.addEventListener('click', () => {
      localStorage.removeItem('zmarksApiBase')
      localStorage.removeItem('zmarksApiKey')
      cloudApiBaseInput.value = ''
      if (cloudApiKeyInput) cloudApiKeyInput.value = ''
      setCloudConfigStatus('已清除配置，云功能已关闭')
      cloudBookmarkStatus.textContent = '未配置 API Base'
      cloudBookmarkList.innerHTML = ''
    })
  }
}

initCloudConfigForm()

// 点击外部关闭
document.addEventListener('click', (e) => {
  if (!cloudBookmarkPanel || cloudBookmarkPanel.style.display === 'none') return
  const inside =
    cloudBookmarkPanel.contains(e.target) ||
    cloudBookmarkCont.contains(e.target)
  if (!inside) {
    toggleCloudPanel(false)
  }
})
