//================================
// SCOLEX VIDEO TUTORIALS
//================================

const TOPICS = [
    "Fundamental",
    "Windows",
    "Microsoft Word",
    "Microsoft Excel",
    "Microsoft Powerpoint",
    "Internet & E-mail"
];

const TOPIC_ICONS = {
    "Fundamental": "💻",
    "Windows": "🪟",
    "Microsoft Word": "📄",
    "Microsoft Excel": "📊",
    "Microsoft Powerpoint": "📽️",
    "Internet & E-mail": "🌐"
};

const DEFAULT_VIDEOS = [
    {
        id: "a-7cXh1MEPI",
        title: "Computer Fundamental_01 || What is Computer? || History of computer",
        desc: "Learn computer basics, origin, definitions, and classification starting from 8:58.",
        start: 538,
        topic: "Fundamental"
    },
    {
        id: "a-7cXh1MEPI",
        title: "Computer Fundamental_02 || Components & Hardware",
        desc: "Introduction to core components, CPU, memory units, and peripheral devices.",
        start: 0,
        topic: "Fundamental"
    },
    {
        id: "a-7cXh1MEPI",
        title: "Computer Fundamental_03 || Operating Systems Overview",
        desc: "Understanding System Software, Application Software, and OS functions.",
        start: 0,
        topic: "Windows"
    },
    {
        id: "a-7cXh1MEPI",
        title: "Computer Fundamental_04 || Networking & Internet Basics",
        desc: "Learn LAN, WAN, IP addresses, Web Browsers, and Search Engines.",
        start: 0,
        topic: "Internet & E-mail"
    },
    {
        id: "a-7cXh1MEPI",
        title: "Computer Fundamental_05 || Cybersecurity & Safety",
        desc: "Overview of malware, antivirus tools, password safety, and online privacy.",
        start: 0,
        topic: "Internet & E-mail"
    }
];

const STORAGE_KEY = "scolexVideoTutorials";
let currentFilter = "All";

function extractVideoId(input) {
    if (!input) return null;
    input = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /[?&]v=([a-zA-Z0-9_-]{11})/
    ];
    for (let i = 0; i < patterns.length; i++) {
        const m = input.match(patterns[i]);
        if (m) return m[1];
    }
    return null;
}

function getVideos() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const list = JSON.parse(saved);
            if (Array.isArray(list) && list.length > 0) {
                return list.map(function (v) {
                    if (!v.topic) v.topic = "Fundamental";
                    return v;
                });
            }
        }
    } catch (e) {}
    return DEFAULT_VIDEOS.slice();
}

function saveVideos(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function isAdmin() {
    return (localStorage.getItem("userRole") || "").toLowerCase() === "admin";
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function videoCardHtml(v, index) {
    const thumb = "https://img.youtube.com/vi/" + v.id + "/hqdefault.jpg";
    const start = v.start || 0;
    const admin = isAdmin();
    return (
        '<div class="video-card" data-index="' + index + '">' +
            (admin ? '<button type="button" class="delete-video-btn" title="Delete" onclick="deleteVideo(' + index + ')"><i class="fa-solid fa-trash"></i></button>' : '') +
            '<div class="video-player-box" onclick="playInWindow(this, \'' + v.id + '\', ' + start + ')">' +
                '<img src="' + thumb + '" alt="' + escapeHtml(v.title) + '">' +
                '<i class="fa-solid fa-circle-play play-btn"></i>' +
            '</div>' +
            '<div class="video-details">' +
                '<div class="video-topic-badge">' + escapeHtml(v.topic || "Fundamental") + '</div>' +
                '<h4>' + escapeHtml(v.title) + '</h4>' +
                '<p>' + escapeHtml(v.desc || '') + '</p>' +
            '</div>' +
        '</div>'
    );
}

function renderTopicTabs(videos) {
    const tabs = document.getElementById("topicTabs");
    if (!tabs) return;
    let html = '<button type="button" class="topic-tab' + (currentFilter === "All" ? " active" : "") + '" onclick="setFilter(\'All\')">All</button>';
    TOPICS.forEach(function (t) {
        const count = videos.filter(function (v) { return v.topic === t; }).length;
        html += '<button type="button" class="topic-tab' + (currentFilter === t ? " active" : "") + '" onclick="setFilter(\'' + t.replace(/'/g, "\\'") + '\')">' +
            (TOPIC_ICONS[t] || "") + " " + t + (count ? " (" + count + ")" : "") +
            "</button>";
    });
    tabs.innerHTML = html;
}

function setFilter(topic) {
    currentFilter = topic;
    renderVideos();
}

function renderVideos() {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;

    const videos = getVideos();
    const admin = isAdmin();

    const countEl = document.getElementById("videoCount");
    if (countEl) countEl.textContent = "(" + videos.length + ")";

    // Admin-only controls: Add Video + Logout
    const adminControls = document.getElementById("adminControls");
    const logoutBtn = document.getElementById("logoutBtn");

    if (admin) {
        if (adminControls) adminControls.style.display = "block";
        if (logoutBtn) logoutBtn.style.display = "inline-flex";
        document.body.classList.add("admin-mode");
    } else {
        if (adminControls) adminControls.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
        document.body.classList.remove("admin-mode");
        const panel = document.getElementById("adminPanel");
        if (panel) panel.classList.remove("open");
    }

    renderTopicTabs(videos);

    if (!videos.length) {
        container.innerHTML = '<div class="empty-state">No videos yet. Admin can add YouTube links above.</div>';
        return;
    }

    let html = "";
    const topicsToShow = currentFilter === "All" ? TOPICS : [currentFilter];

    topicsToShow.forEach(function (topic) {
        const items = [];
        videos.forEach(function (v, index) {
            if (v.topic === topic) items.push({ v: v, index: index });
        });
        if (!items.length && currentFilter === "All") return;

        html += '<div class="topic-section">';
        html += '<div class="topic-section-title">' +
            (TOPIC_ICONS[topic] || "📁") + " " + escapeHtml(topic) +
            ' <span class="count">' + items.length + ' video' + (items.length !== 1 ? "s" : "") + '</span>' +
            '</div>';

        if (!items.length) {
            html += '<div class="empty-state">No videos in this section yet.</div>';
        } else {
            html += '<div class="video-grid">';
            items.forEach(function (item) {
                html += videoCardHtml(item.v, item.index);
            });
            html += '</div>';
        }
        html += '</div>';
    });

    if (!html) {
        html = '<div class="empty-state">No videos in this section yet.</div>';
    }

    container.innerHTML = html;
}

function playInWindow(container, videoId, startTime) {
    if (!container || !videoId) return;
    let embedUrl = "https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1&rel=0";
    if (startTime) embedUrl += "&start=" + startTime;

    container.innerHTML =
        '<iframe src="' + embedUrl + '" title="YouTube Video Player" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
        'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    container.style.cursor = "default";
    container.removeAttribute("onclick");
    container.onclick = null;
}

function toggleAdminPanel() {
    if (!isAdmin()) {
        alert("Only Admin can add videos. Please login as Admin.");
        return;
    }
    document.getElementById("adminPanel").classList.toggle("open");
}

function addVideo() {
    if (!isAdmin()) {
        alert("Only Admin can add videos.");
        return;
    }

    const link = document.getElementById("ytLink").value.trim();
    const title = document.getElementById("ytTitle").value.trim();
    const desc = document.getElementById("ytDesc").value.trim();
    const topic = document.getElementById("ytTopic").value;
    const start = parseInt(document.getElementById("ytStart").value, 10) || 0;

    const videoId = extractVideoId(link);
    if (!videoId) {
        alert("Please paste a valid YouTube link or 11-character Video ID.");
        document.getElementById("ytLink").focus();
        return;
    }
    if (!title) {
        alert("Please enter a video title.");
        document.getElementById("ytTitle").focus();
        return;
    }

    const list = getVideos();
    list.unshift({
        id: videoId,
        title: title,
        desc: desc,
        start: start,
        topic: topic
    });
    saveVideos(list);

    document.getElementById("ytLink").value = "";
    document.getElementById("ytTitle").value = "";
    document.getElementById("ytDesc").value = "";
    document.getElementById("ytStart").value = "0";
    document.getElementById("adminPanel").classList.remove("open");

    renderVideos();
    alert("✅ Video added under \"" + topic + "\"!");
}

function deleteVideo(index) {
    if (!isAdmin()) return;
    if (!confirm("Delete this video?")) return;
    const list = getVideos();
    list.splice(index, 1);
    saveVideos(list);
    renderVideos();
}

function doLogout() {
    if (!confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("userRole");
    localStorage.removeItem("student");
    localStorage.removeItem("ScolexStudentSavedData");
    localStorage.removeItem("scolex_last_activity");
    if (typeof window.scolexLogout === "function") {
        window.scolexLogout();
        return;
    }
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", renderVideos);