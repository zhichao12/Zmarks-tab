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

function getApiBase() {
  return window.ZMARKS_API_BASE || localStorage.getItem('zmarksApiBase') || ''
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
  try {
    const keyword = cloudBookmarkSearch.value.trim()
    const list = await fetchCloudBookmarks(keyword)
    renderCloudBookmarks(list)
    cloudBookmarkStatus.textContent = `已加载 ${list.length} 条`
  } catch (err) {
    console.error(err)
    cloudBookmarkStatus.textContent = `加载失败：${err.message}`
    cloudBookmarkList.innerHTML = ''
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
