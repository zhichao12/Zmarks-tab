/*
 * Material You NewTab
 * 壁纸改为使用 URL 配置，优先云端（D1/KV），失败回落本地
 */

const RANDOM_IMAGE_URL = "https://picsum.photos/1920/1080";
let wallpaperConfig = null;

function toggleBackgroundType(hasWallpaper) {
    document.body.setAttribute("data-bg", hasWallpaper ? "wallpaper" : "color");
}

async function saveWallpaperConfig(config) {
    wallpaperConfig = { ...config, updatedAt: new Date().toISOString() };
    localStorage.setItem("wallpaperConfig", JSON.stringify(wallpaperConfig));
    if (typeof saveCloudConfig === "function") {
        saveCloudConfig("wallpaperConfig", wallpaperConfig).catch((err) => console.warn("saveCloudConfig wallpaper failed", err));
    }
}

async function loadWallpaperConfig() {
    try {
        if (typeof loadCloudConfig === "function") {
            const remote = await loadCloudConfig("wallpaperConfig");
            if (remote && remote.url) {
                wallpaperConfig = remote;
                localStorage.setItem("wallpaperConfig", JSON.stringify(remote));
                return remote;
            }
        }
        const local = JSON.parse(localStorage.getItem("wallpaperConfig") || "null");
        wallpaperConfig = local;
        return local;
    } catch (err) {
        console.error("load wallpaper config failed", err);
        return null;
    }
}

function applyWallpaperUrl(url) {
    if (!url) {
        document.body.style.removeProperty("--bg-image");
        toggleBackgroundType(false);
        return;
    }
    document.body.style.setProperty("--bg-image", `url(${url})`);
    toggleBackgroundType(true);
}

async function applyRandomImage(showConfirmation = true) {
    if (showConfirmation && !(await confirmPrompt(
        translations[currentLanguage]?.confirmWallpaper || translations["en"].confirmWallpaper
    ))) {
        return;
    }
    const url = `${RANDOM_IMAGE_URL}?t=${Date.now()}`;
    applyWallpaperUrl(url);
    saveWallpaperConfig({ type: "random", url });
}

// Handle file input: 仍允许本地文件，但存储其对象 URL；如需持久网络地址，请使用远端 URL 方式
document.getElementById("imageUpload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file); // Create temporary Blob URL
        const image = new Image();

        image.onload = function () {
            applyWallpaperUrl(imageUrl);
            saveWallpaperConfig({ type: "upload", url: imageUrl });
            setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);
        };

        image.src = imageUrl;
    }
});

// 允许通过输入框设置网络图片 URL（若页面已有 id 为 customImageUrlInput 的元素）
const customImageInput = document.getElementById("customImageUrlInput");
const customImageApply = document.getElementById("customImageUrlApply");
if (customImageInput && customImageApply) {
    customImageApply.addEventListener("click", () => {
        const url = customImageInput.value.trim();
        if (!url) return;
        applyWallpaperUrl(url);
        saveWallpaperConfig({ type: "url", url });
    });
}

document.getElementById("uploadTrigger").addEventListener("click", () =>
    document.getElementById("imageUpload").click()
);

document.getElementById("clearImage").addEventListener("click", async function () {
    const config = wallpaperConfig || {};
    if (!config.url) {
        await alertPrompt(translations[currentLanguage]?.Nobackgroundset || translations["en"].Nobackgroundset);
        return;
    }

    const confirmationMessage = translations[currentLanguage]?.clearbackgroundimage || translations["en"].clearbackgroundimage;
    if (await confirmPrompt(confirmationMessage)) {
        try {
            wallpaperConfig = null;
            localStorage.removeItem("wallpaperConfig");
            if (typeof saveCloudConfig === "function") {
                saveCloudConfig("wallpaperConfig", null).catch(() => {});
            }
            document.body.style.removeProperty("--bg-image");
            toggleBackgroundType(false);
        } catch (error) {
            console.error(error);
        }
    }
});
document.getElementById("randomImageTrigger").addEventListener("click", applyRandomImage);

async function initWallpaper() {
    const config = await loadWallpaperConfig();
    if (config && config.url) {
        applyWallpaperUrl(config.url);
    } else {
        toggleBackgroundType(false);
    }
}

// Start image check on page load
initWallpaper();
// ------------------------ End of BG Image --------------------------
