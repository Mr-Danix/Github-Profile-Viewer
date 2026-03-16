const searchBtn = document.getElementById('search-btn');
const usernameInput = document.getElementById('username-input');
const profileContainer = document.getElementById('profile-container');

async function getUser(username) {
    profileContainer.innerHTML = `<div class="profile-card" style="text-align:center;">Analyzing ${username}'s profile...</div>`;
    
    try {
        const resp = await fetch(`https://api.github.com/users/${username}`);
        if (!resp.ok) throw new Error('User not found');
        const user = await resp.json();

        const repoResp = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await repoResp.json();

        displayUser(user, repos);
    } catch (err) {
        profileContainer.innerHTML = `<div class="profile-card">Error: ${err.message}</div>`;
    }
}

function displayUser(user, repos) {
    // Trophy API URL using the ryo-ma/github-profile-trophy service
    const trophyUrl = `https://github-profile-trophy.vercel.app/?username=${user.login}&theme=darkhub&column=6`;

    profileContainer.innerHTML = `
        <div class="profile-card">
            <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem;">
                <img src="${user.avatar_url}" style="width: 120px; border-radius: 50%; border: 3px solid var(--accent);">
                <div>
                    <h2 style="font-size: 2rem;">${user.name || user.login}</h2>
                    <p style="color: var(--accent);">@${user.login}</p>
                    <p style="margin-top: 10px; color: var(--text-secondary);">${user.bio || 'No bio available'}</p>
                </div>
            </div>

            <div class="trophies-container">
                <h3 style="margin-bottom: 1rem; font-size: 1.1rem;">Achievements & Trophies</h3>
                <img src="${trophyUrl}" alt="GitHub Trophies">
            </div>

            <div class="info-grid">
                <div class="info-item"><label>Followers</label>${user.followers}</div>
                <div class="info-item"><label>Following</label>${user.following}</div>
                <div class="info-item"><label>Public Repos</label>${user.public_repos}</div>
                <div class="info-item"><label>Location</label>${user.location || 'Remote'}</div>
                <div class="info-item"><label>Company</label>${user.company || 'Freelance'}</div>
                <div class="info-item"><label>Twitter</label>${user.twitter_username ? '@' + user.twitter_username : 'N/A'}</div>
            </div>

            <h3 style="margin: 2rem 0 1rem; font-size: 1.2rem;">Latest Projects</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                ${repos.map(r => `
                    <div class="info-item">
                        <a href="${r.html_url}" target="_blank" style="color: #58a6ff; text-decoration: none; font-weight: 600;">${r.name}</a>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 5px;">${r.description || 'No description'}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

searchBtn.addEventListener('click', () => {
    if (usernameInput.value) getUser(usernameInput.value);
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && usernameInput.value) getUser(usernameInput.value);
});