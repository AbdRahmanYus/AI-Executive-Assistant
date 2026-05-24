const API = 'http://localhost:5000';
let isAuthenticated = false;
let userName = '';
let currentTab = 'chat';
let calendarDate = new Date();

const logs = {
    gmail: [],
    calendar: [],
    drive: [],
    docs: []
};

const SVG = {
    gmail: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    gmailLg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    drive: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
    driveLg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
    docs: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
    docsLg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    calSm: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
};

async function checkAuth() {
    try {
        const res = await fetch(`${API}/user`, { credentials: 'include' });
        const data = await res.json();
        console.log('Auth check:', data);
        if (data.authenticated) {
            isAuthenticated = true;
            userName = data.name;
            updateUIAuthenticated(data);
        }
    } catch (e) {
        console.log('Auth error:', e);
    }
}

function updateUIAuthenticated(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    const avatar = document.getElementById('userAvatar');
    if (user.picture) {
        avatar.innerHTML = `<img src="${user.picture}" alt="${user.name}">`;
    } else {
        avatar.textContent = user.name[0].toUpperCase();
    }
    const authSection = document.getElementById('authSection');
    authSection.innerHTML = `
        <button class="btn-logout" onclick="logout()">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Sign out
        </button>
    `;
    document.getElementById('welcome').innerHTML = `
        <div class="welcome-icon">⬡</div>
        <h2>Good to see you, ${user.name.split(' ')[0]}</h2>
        <p>What would you like to automate today?</p>
        <div class="quick-actions">
            <button class="quick-btn" onclick="sendQuick('Show me my recent emails')">
                ${SVG.email} Recent Emails
            </button>
            <button class="quick-btn" onclick="sendQuick('Show my upcoming calendar events')">
                ${SVG.calSm} Upcoming Events
            </button>
            <button class="quick-btn" onclick="sendQuick('List my recent Drive files')">
                ${SVG.file} Drive Files
            </button>
            <button class="quick-btn" onclick="sendQuick('Create a new document called Meeting Notes')">
                ${SVG.docs} New Doc
            </button>
        </div>
    `;
}

function login() { window.location.href = `${API}/login`; }
function logout() { window.location.href = `${API}/logout`; }

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    const chatContainer = document.getElementById('chatContainer');
    const tabContainer = document.getElementById('tabContainer');

    if (tab === 'chat') {
        chatContainer.style.display = 'flex';
        tabContainer.style.display = 'none';
        document.getElementById('inputArea').style.display = 'block';
    } else {
        chatContainer.style.display = 'none';
        tabContainer.style.display = 'flex';
        document.getElementById('inputArea').style.display = 'none';
        renderTabContent(tab);
    }
}

function renderTabContent(tab) {
    const tabContainer = document.getElementById('tabContainer');

    if (tab === 'calendar') {
        renderCalendar(tabContainer);
        return;
    }

    const items = logs[tab];

    const iconMap = { gmail: SVG.gmail, drive: SVG.drive, docs: SVG.docs };
    const iconLgMap = { gmail: SVG.gmailLg, drive: SVG.driveLg, docs: SVG.docsLg };
    const titles = { gmail: 'Sent Emails', drive: 'Drive Activity', docs: 'Created Documents' };
    const emptyMessages = {
        gmail: 'No emails sent yet. Ask the assistant to send an email.',
        drive: 'No drive activity yet. Ask the assistant to find or list files.',
        docs: 'No documents created yet. Ask the assistant to create a doc.'
    };

    if (items.length === 0) {
        tabContainer.innerHTML = `
            <div class="tab-empty">
                <div class="tab-empty-icon">${iconLgMap[tab]}</div>
                <h3>${titles[tab]}</h3>
                <p>${emptyMessages[tab]}</p>
            </div>
        `;
        return;
    }

    tabContainer.innerHTML = `
        <div class="tab-header">
            <h2 class="tab-title-row">${iconMap[tab]} ${titles[tab]}</h2>
            <span class="tab-count">${items.length} item${items.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="tab-list">
            ${items.map(item => `
                <div class="tab-item">
                    <div class="tab-item-header">
                        <span class="tab-item-title">${escapeHtml(item.title)}</span>
                        <span class="tab-item-time">${item.time}</span>
                    </div>
                    ${item.detail ? `<div class="tab-item-detail">${escapeHtml(item.detail)}</div>` : ''}
                    ${item.link ? `<a href="${item.link}" target="_blank" class="tab-item-link">Open ↗</a>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function renderCalendar(container) {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const today = new Date();

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const eventMap = {};
    logs.calendar.forEach(e => {
        const d = e.date ? new Date(e.date) : null;
        if (d && !isNaN(d)) {
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if (!eventMap[key]) eventMap[key] = [];
            eventMap[key].push(e);
        }
    });

    let cells = '';
    let day = 1;
    let nextDay = 1;
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
        if (i < firstDay) {
            const prevDate = daysInPrev - firstDay + i + 1;
            cells += `<div class="cal-cell other-month"><span class="cal-day-num">${prevDate}</span></div>`;
        } else if (day <= daysInMonth) {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const key = `${year}-${month}-${day}`;
            const dayEvents = eventMap[key] || [];
            const eventsHtml = dayEvents.map(e => `
                <div class="cal-event" title="${escapeHtml(e.title)}">
                    ${escapeHtml(e.title.length > 14 ? e.title.substring(0, 14) + '…' : e.title)}
                </div>
            `).join('');
            cells += `
                <div class="cal-cell ${isToday ? 'today' : ''} ${dayEvents.length ? 'has-events' : ''}">
                    <span class="cal-day-num ${isToday ? 'today-num' : ''}">${day}</span>
                    ${eventsHtml}
                </div>`;
            day++;
        } else {
            cells += `<div class="cal-cell other-month"><span class="cal-day-num">${nextDay++}</span></div>`;
        }
    }

    const upcomingEvents = logs.calendar.length > 0 ? `
        <div class="cal-upcoming">
            <h3 class="cal-upcoming-title">Scheduled via Assistant</h3>
            <div class="tab-list">
                ${logs.calendar.map(e => `
                    <div class="tab-item">
                        <div class="tab-item-header">
                            <span class="tab-item-title" style="display:flex;align-items:center;gap:6px">
                                ${SVG.calSm} ${escapeHtml(e.title)}
                            </span>
                            <span class="tab-item-time">${e.time}</span>
                        </div>
                        ${e.detail ? `<div class="tab-item-detail">${escapeHtml(e.detail)}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '<div style="padding:24px;color:var(--text-3);font-size:13px;text-align:center">No events scheduled yet via assistant.</div>';

    container.innerHTML = `
        <div class="calendar-wrapper">
            <div class="cal-header">
                <button class="cal-nav" onclick="changeMonth(-1)">&#8592;</button>
                <h2 class="cal-title">${monthNames[month]} ${year}</h2>
                <button class="cal-nav" onclick="changeMonth(1)">&#8594;</button>
                <button class="cal-today-btn" onclick="goToToday()">Today</button>
            </div>
            <div class="cal-grid">
                ${dayNames.map(d => `<div class="cal-day-header">${d}</div>`).join('')}
                ${cells}
            </div>
            ${upcomingEvents}
        </div>
    `;
}

function changeMonth(dir) {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + dir, 1);
    renderTabContent('calendar');
}

function goToToday() {
    calendarDate = new Date();
    renderTabContent('calendar');
}

function renderCalendarIfActive() {
    if (currentTab === 'calendar') renderTabContent('calendar');
}

function logActivity(response, userMessage) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = userMessage.toLowerCase();
    const res = response.toLowerCase();

    if (res.includes('email sent') || res.includes('sent to') || res.includes('sent an email') ||
        msg.includes('send email') || msg.includes('send a mail') || msg.includes('email to')) {
        const toMatch = response.match(/sent to ([^\s,]+@[^\s,]+)/i);
        const subjectMatch = response.match(/subject[:\s]+['"]?([^'".\n]+)/i);
        logs.gmail.push({
            title: subjectMatch ? subjectMatch[1].trim() : 'Email Sent',
            detail: toMatch ? `To: ${toMatch[1]}` : userMessage,
            time
        });
    }

    if (res.includes('scheduled') || (res.includes('created') && res.includes('calendar')) ||
        (res.includes('event') && (res.includes('pm') || res.includes('am'))) ||
        msg.includes('schedule') || msg.includes('create event') || msg.includes('add to calendar') ||
        msg.includes('meeting') || msg.includes('reminder')) {

        const dateMatch = response.match(/(\w+\s+\d+,?\s+\d{4})/i);
        const timeMatch = response.match(/(\d+:\d+\s*(?:am|pm))/i);
        const titleMatch = response.match(/titled?\s+["']([^"']+)["']/i) ||
                           response.match(/["']([^"']+)["']\s+(?:has been|is)\s+scheduled/i) ||
                           response.match(/meeting\s+["']([^"']+)["']/i);

        const eventDate = dateMatch ? new Date(dateMatch[1]) : new Date();

        logs.calendar.push({
            title: titleMatch ? titleMatch[1] : (userMessage.length > 40 ? userMessage.substring(0, 40) + '…' : userMessage),
            detail: `${dateMatch ? dateMatch[1] : 'Upcoming'} ${timeMatch ? '@ ' + timeMatch[1] : ''}`.trim(),
            date: eventDate,
            time
        });
        renderCalendarIfActive();
    }

    if (res.includes('drive') || (res.includes('file') && (res.includes('found') || res.includes('list'))) ||
        msg.includes('drive') || msg.includes('find file') || msg.includes('list files')) {
        logs.drive.push({
            title: 'Drive Activity',
            detail: userMessage,
            time
        });
    }

    if ((res.includes('document') && res.includes('created')) || res.includes('docs.google.com') ||
        (msg.includes('create') && msg.includes('doc'))) {
        const linkMatch = response.match(/https:\/\/docs\.google\.com\/document\/d\/[^\s)]+/);
        const titleMatch = response.match(/titled?\s+["']([^"']+)["']/i) ||
                           response.match(/document\s+["']([^"']+)["']/i);
        logs.docs.push({
            title: titleMatch ? titleMatch[1] : 'New Document',
            detail: userMessage,
            link: linkMatch ? linkMatch[0] : null,
            time
        });
    }
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message) return;
    if (!isAuthenticated) {
        addMessage('assistant', 'Please sign in with Google first to use the assistant.');
        return;
    }

    input.value = '';
    autoResize(input);
    addMessage('user', message);
    const typing = addTyping();
    document.getElementById('sendBtn').disabled = true;

    try {
        const res = await fetch(`${API}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ message })
        });
        const data = await res.json();
        typing.remove();
        if (data.error) {
            addMessage('assistant', `Error: ${data.error}`);
        } else {
            addMessage('assistant', data.response);
            logActivity(data.response, message);
        }
    } catch (e) {
        typing.remove();
        addMessage('assistant', 'Connection error. Make sure the backend is running.');
    }

    document.getElementById('sendBtn').disabled = false;
}

function sendQuick(message) {
    switchTab('chat');
    document.getElementById('messageInput').value = message;
    sendMessage();
}

function addMessage(role, content) {
    const welcome = document.getElementById('welcome');
    if (welcome) welcome.style.display = 'none';

    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = `message ${role}`;

    const initial = role === 'user' ? (userName ? userName[0].toUpperCase() : 'U') : '⬡';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    div.innerHTML = `
        <div class="msg-avatar">${initial}</div>
        <div class="msg-content">
            <div class="msg-bubble">${escapeHtml(content)}</div>
            <span class="msg-time">${time}</span>
        </div>
    `;
    messages.appendChild(div);
    document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight;
    return div;
}

function addTyping() {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = 'message assistant typing';
    div.innerHTML = `
        <div class="msg-avatar">⬡</div>
        <div class="msg-content">
            <div class="msg-bubble">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    messages.appendChild(div);
    document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight;
    return div;
}

async function clearChat() {
    document.getElementById('messages').innerHTML = '';
    await fetch(`${API}/clear`, { method: 'POST', credentials: 'include' });
}

function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

checkAuth();