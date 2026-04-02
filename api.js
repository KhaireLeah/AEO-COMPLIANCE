const API_BASE_URL = 'https://69ccc9cfddc3cabb7bd18d7f.mockapi.io/api/v1';
const DOCS_URL = `${API_BASE_URL}/documents`;
const ACTIVITIES_URL = `${API_BASE_URL}/activities`;
const NOTIFICATIONS_URL = `${API_BASE_URL}/notifications`;

if (typeof window !== 'undefined' && window && typeof window.alert === 'function') {
    window.alert = function() {};
}

// --- Document Functions ---

async function getDocs() {
    try {
        const response = await fetch(DOCS_URL + '?sortBy=createdAt&order=desc');
        if (!response.ok) throw new Error('Network response was not ok.');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch docs:', error);
        alert('无法从服务器获取单据数据，请检查网络连接。');
        return [];
    }
}

async function getDoc(id) {
    try {
        const response = await fetch(`${DOCS_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch doc.');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch doc:', error);
        alert('无法从服务器获取单据详情，请检查网络连接。');
        return null;
    }
}

async function addDoc(doc) {
    try {
        const payload = {...doc, createdAt: new Date().toISOString()};
        if (typeof payload.projectId === 'string') payload.projectId = payload.projectId.trim();
        const response = await fetch(DOCS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to add doc.');
        return await response.json();
    } catch (error) {
        console.error('Failed to add doc:', error);
        alert('上传单据失败，请稍后重试。');
    }
}

async function updateDoc(id, updatedData) {
    try {
        const response = await fetch(`${DOCS_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error('Failed to update doc.');
        return await response.json();
    } catch (error) {
        console.error('Failed to update doc:', error);
        alert('更新单据失败，请稍后重试。');
    }
}

async function deleteDocAPI(id) {
    try {
        const response = await fetch(`${DOCS_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete doc.');
        return await response.json();
    } catch (error) {
        console.error('Failed to delete doc:', error);
        alert('删除单据失败，请稍后重试。');
    }
}

// --- Activity Functions ---

async function getActivities() {
    try {
        const response = await fetch(ACTIVITIES_URL + '?sortBy=createdAt&order=desc&limit=200');
        if (!response.ok) throw new Error('Network response was not ok.');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch activities:', error);
        alert('无法从服务器获取动态数据，请检查网络连接。');
        return [];
    }
}

async function getActivitiesPage(page, limit) {
    const p = Number(page) || 1;
    const l = Number(limit) || 200;
    const response = await fetch(ACTIVITIES_URL + `?page=${p}&limit=${l}&sortBy=createdAt&order=desc`);
    if (!response.ok) throw new Error('Network response was not ok.');
    return await response.json();
}

async function addActivity(activity) {
    try {
        const payload = {...activity, createdAt: new Date().toISOString()};
        if (typeof payload.projectId === 'string') payload.projectId = payload.projectId.trim();
        const response = await fetch(ACTIVITIES_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to add activity.');
        return await response.json();
    } catch (error) {
        console.error('Failed to add activity:', error);
        alert('记录动态失败：动态面板可能不会更新。请检查网络连接。');
    }
}

async function deleteActivityAPI(id) {
    try {
        const response = await fetch(`${ACTIVITIES_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete activity.');
        return await response.json();
    } catch (error) {
        console.error('Failed to delete activity:', error);
    }
}

async function updateActivityAPI(id, data) {
    try {
        const response = await fetch(`${ACTIVITIES_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update activity.');
        return await response.json();
    } catch (error) {
        console.error('Failed to update activity:', error);
    }
}

// --- Notification Functions ---

async function getNotifications() {
    try {
        const response = await fetch(NOTIFICATIONS_URL + '?sortBy=createdAt&order=desc&limit=500');
        if (!response.ok) throw new Error('Failed to fetch notifications.');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return [];
    }
}

async function addNotification(notification) {
    try {
        const payload = {...notification};
        if (payload && payload.createdAt == null) payload.createdAt = new Date().toISOString();
        if (payload && payload.isRead == null) payload.isRead = false;
        if (typeof payload.projectId === 'string') payload.projectId = payload.projectId.trim();
        const response = await fetch(NOTIFICATIONS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to add notification.');
        return await response.json();
    } catch (error) {
        console.error('Failed to add notification:', error);
    }
}

async function updateNotification(id, data) {
    try {
        const response = await fetch(`${NOTIFICATIONS_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update notification.');
        return await response.json();
    } catch (error) {
        console.error('Failed to update notification:', error);
    }
}

async function deleteNotification(id) {
    try {
        const response = await fetch(`${NOTIFICATIONS_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete notification.');
        return await response.json();
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
