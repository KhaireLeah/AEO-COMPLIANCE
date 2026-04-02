const API_BASE_URL = 'https://69ccc9cfddc3cabb7bd18d7f.mockapi.io/api/v1';
const DOCS_URL = `${API_BASE_URL}/documents`;
const ACTIVITIES_URL = `${API_BASE_URL}/activities`;
const NOTIFICATIONS_URL = `${API_BASE_URL}/notifications`;

if (typeof window !== 'undefined' && window && typeof window.alert === 'function') {
    window.alert = function() {};
}

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function fetchJsonWithRetry(url, options) {
    const maxAttempts = 3;
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeoutMs = 8000;
        const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
        try {
            const response = await fetch(url, { ...(options || {}), signal: controller ? controller.signal : undefined });
            if (timer) clearTimeout(timer);
            if (!response.ok) {
                const err = new Error(`HTTP ${response.status}`);
                err.status = response.status;
                throw err;
            }
            return await response.json();
        } catch (e) {
            if (timer) clearTimeout(timer);
            lastError = e;
            const status = e && e.status;
            const shouldRetry = attempt < maxAttempts && (status === 429 || status >= 500 || status == null);
            if (!shouldRetry) break;
            const delay = status === 429 ? 1500 * attempt : 500 * attempt;
            await sleep(delay);
        }
    }
    throw lastError || new Error('Request failed');
}

function writeCache(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
    } catch (e) {}
}

function readCache(key) {
    try {
        const cached = safeJsonParse(localStorage.getItem(key) || '', null);
        return cached && Array.isArray(cached.data) ? cached.data : null;
    } catch (e) {
        return null;
    }
}

// --- Document Functions ---

async function getDocs() {
    try {
        const data = await fetchJsonWithRetry(DOCS_URL + '?sortBy=createdAt&order=desc&limit=500');
        writeCache('bpmCacheDocs', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch docs:', error);
        return readCache('bpmCacheDocs') || [];
    }
}

async function getDoc(id) {
    try {
        return await fetchJsonWithRetry(`${DOCS_URL}/${id}`);
    } catch (error) {
        console.error('Failed to fetch doc:', error);
        return null;
    }
}

async function addDoc(doc) {
    try {
        const payload = {...doc, createdAt: new Date().toISOString()};
        if (typeof payload.projectId === 'string') payload.projectId = payload.projectId.trim();
        return await fetchJsonWithRetry(DOCS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Failed to add doc:', error);
    }
}

async function updateDoc(id, updatedData) {
    try {
        return await fetchJsonWithRetry(`${DOCS_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
    } catch (error) {
        console.error('Failed to update doc:', error);
    }
}

async function deleteDocAPI(id) {
    try {
        return await fetchJsonWithRetry(`${DOCS_URL}/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Failed to delete doc:', error);
    }
}

// --- Activity Functions ---

async function getActivities() {
    try {
        const data = await fetchJsonWithRetry(ACTIVITIES_URL + '?sortBy=createdAt&order=desc&limit=500');
        writeCache('bpmCacheActivities', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch activities:', error);
        return readCache('bpmCacheActivities') || [];
    }
}

async function getActivitiesPage(page, limit) {
    const p = Number(page) || 1;
    const l = Number(limit) || 200;
    return await fetchJsonWithRetry(ACTIVITIES_URL + `?page=${p}&limit=${l}&sortBy=createdAt&order=desc`);
}

async function addActivity(activity) {
    try {
        const payload = {...activity, createdAt: new Date().toISOString()};
        if (typeof payload.projectId === 'string') payload.projectId = payload.projectId.trim();
        return await fetchJsonWithRetry(ACTIVITIES_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Failed to add activity:', error);
    }
}

async function deleteActivityAPI(id) {
    try {
        return await fetchJsonWithRetry(`${ACTIVITIES_URL}/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Failed to delete activity:', error);
    }
}

async function updateActivityAPI(id, data) {
    try {
        return await fetchJsonWithRetry(`${ACTIVITIES_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Failed to update activity:', error);
    }
}

// --- Notification Functions ---

async function getNotifications() {
    try {
        const data = await fetchJsonWithRetry(NOTIFICATIONS_URL + '?sortBy=createdAt&order=desc&limit=500');
        writeCache('bpmCacheNotifications', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return readCache('bpmCacheNotifications') || [];
    }
}

async function addNotification(notification) {
    try {
        const payload = {...notification};
        if (payload && payload.createdAt == null) payload.createdAt = new Date().toISOString();
        if (payload && payload.isRead == null) payload.isRead = false;
        if (typeof payload.projectId === 'string') payload.projectId = payload.projectId.trim();
        return await fetchJsonWithRetry(NOTIFICATIONS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Failed to add notification:', error);
    }
}

async function updateNotification(id, data) {
    try {
        return await fetchJsonWithRetry(`${NOTIFICATIONS_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Failed to update notification:', error);
    }
}

async function deleteNotification(id) {
    try {
        return await fetchJsonWithRetry(`${NOTIFICATIONS_URL}/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Failed to delete notification:', error);
    }
}

function safeJsonParse(text, fallback) {
    try {
        return JSON.parse(text);
    } catch (e) {
        return fallback;
    }
}

function loadUserEmails() {
    return safeJsonParse(localStorage.getItem('bpmUserEmails') || '', {}) || {};
}

function getUserEmail(userName) {
    if (!userName) return '';
    const map = loadUserEmails();
    return map && map[userName] ? String(map[userName]) : '';
}

function loadEmailJsConfig() {
    return safeJsonParse(localStorage.getItem('bpmEmailjsConfig') || '', { serviceId: '', templateId: '', publicKey: '' }) || { serviceId: '', templateId: '', publicKey: '' };
}

function hasEmailJsConfig(cfg) {
    return !!(cfg && cfg.serviceId && cfg.templateId && cfg.publicKey);
}

function getPmUserName() {
    const v = localStorage.getItem('bpmPmUserName');
    return (v && String(v).trim()) ? String(v).trim() : '项目经理D';
}

function setPmUserName(userName) {
    const v = String(userName || '').trim();
    if (!v) {
        localStorage.removeItem('bpmPmUserName');
        return;
    }
    localStorage.setItem('bpmPmUserName', v);
}

async function sendEmailByEmailJs(toEmail, subject, message) {
    const cfg = loadEmailJsConfig();
    if (!toEmail || !hasEmailJsConfig(cfg)) return false;

    const payload = {
        service_id: cfg.serviceId,
        template_id: cfg.templateId,
        user_id: cfg.publicKey,
        template_params: {
            to_email: toEmail,
            subject: subject || '',
            message: message || ''
        }
    };

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return res.ok;
}

async function trySendEmailToUser(userName, subject, content) {
    const toEmail = getUserEmail(userName);
    if (!toEmail) return false;
    try {
        return await sendEmailByEmailJs(toEmail, subject, content);
    } catch (e) {
        console.error('Email send failed:', e);
        return false;
    }
}
