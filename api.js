const API_BASE_URL = 'https://69ccc9cfddc3cabb7bd18d7f.mockapi.io/api/v1';
const DOCS_URL = `${API_BASE_URL}/documents`;
const ACTIVITIES_URL = `${API_BASE_URL}/activities`;

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

async function addDoc(doc) {
    try {
        const response = await fetch(DOCS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...doc, createdAt: new Date().toISOString()}),
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
        const response = await fetch(ACTIVITIES_URL + '?sortBy=createdAt&order=desc&limit=15');
        if (!response.ok) throw new Error('Network response was not ok.');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch activities:', error);
        return [];
    }
}

async function addActivity(activity) {
     try {
        const response = await fetch(ACTIVITIES_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...activity, createdAt: new Date().toISOString()}),
        });
        if (!response.ok) throw new Error('Failed to add activity.');
        return await response.json();
    } catch (error) {
        console.error('Failed to add activity:', error);
    }
}
