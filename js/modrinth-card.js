/**
 * Modrinth Card Widget
 * Usage: <div class="modrinth-card" data-slug="plugin-slug"></div>
 */

async function loadModrinthCards() {
  const cards = document.querySelectorAll('.modrinth-card');
  if (!cards.length) return;

  await Promise.all([...cards].map(async (el) => {
    const slug = el.dataset.slug;
    if (!slug) return;

    // Loading skeleton
    el.innerHTML = `
      <div class="mc-inner mc-loading">
        <div class="mc-icon-wrap mc-skeleton"></div>
        <div class="mc-body">
          <div class="mc-skeleton mc-skeleton-title"></div>
          <div class="mc-skeleton mc-skeleton-desc"></div>
        </div>
      </div>`;

    try {
      const res = await fetch(`https://api.modrinth.com/v2/project/${slug}`, {
        headers: { 'User-Agent': 'PelmeniSMPWiki/1.0' }
      });
      if (!res.ok) throw new Error();
      const d = await res.json();

      const typeLabel = { mod: 'Mod', plugin: 'Plugin', modpack: 'Modpack', resourcepack: 'Ressourcepack', shader: 'Shader' };
      const downloads = d.downloads >= 1_000_000
        ? (d.downloads / 1_000_000).toFixed(1) + 'M'
        : d.downloads >= 1_000
        ? (d.downloads / 1_000).toFixed(0) + 'K'
        : d.downloads;

      const cats = (d.categories || []).slice(0, 3)
        .map(c => `<span class="mc-tag">${c}</span>`).join('');

      el.innerHTML = `
        <a class="mc-inner" href="https://modrinth.com/${d.project_type}/${slug}" target="_blank" rel="noopener">
          <div class="mc-icon-wrap">
            ${d.icon_url
              ? `<img class="mc-icon" src="${d.icon_url}" alt="${d.title}" loading="lazy" />`
              : `<div class="mc-icon-fallback">⬡</div>`}
          </div>
          <div class="mc-body">
            <div class="mc-header">
              <span class="mc-name">${d.title}</span>
              <span class="mc-type">${typeLabel[d.project_type] ?? d.project_type}</span>
            </div>
            <p class="mc-desc">${d.description}</p>
            <div class="mc-footer">
              <span class="mc-downloads">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                ${downloads}
              </span>
              ${cats}
              <span class="mc-modrinth-badge">
                <svg width="12" height="12" viewBox="0 0 512 514" fill="currentColor"><path d="M503.16 323.56a90.86 90.86 0 0 1-40.73 53.86L357.21 440.7a91 91 0 0 1-91 0l-21.68-12.5a17.56 17.56 0 0 0 2.43-8.53v-72.14l83.48-48.2a48 48 0 0 0 24-41.57V218.3l49.48 28.57a8.84 8.84 0 0 1 4.42 7.66v102.08a8.82 8.82 0 0 1-4.42 7.64l-37.83 21.84a8.88 8.88 0 0 1-8.84 0l-37.86-21.84a8.83 8.83 0 0 1-4.42-7.64V320.8l-22.51-13v53.35a8.82 8.82 0 0 1-4.42 7.64l-37.84 21.84a8.84 8.84 0 0 1-8.84 0l-37.81-21.84a8.86 8.86 0 0 1-4.42-7.64V252a8.84 8.84 0 0 1 4.42-7.64l22.51-13v-51l-22.51 13a8.84 8.84 0 0 0-4.42 7.64v102.08a8.82 8.82 0 0 0 4.42 7.64l37.81 21.84v28.57l-37.81-21.84a35.67 35.67 0 0 1-17.78-30.87V205.65a35.65 35.65 0 0 1 17.78-30.87L256 146.06a35.62 35.62 0 0 1 35.56 0l37.83 21.84a8.83 8.83 0 0 1 4.42 7.64v102.08a8.83 8.83 0 0 1-4.42 7.64L256 307.7v28.56l52.16-30.12V218.3a8.83 8.83 0 0 0-4.41-7.64L256 182.27v-28.56l90.54 52.26a35.62 35.62 0 0 1 17.78 30.87v102.08a35.62 35.62 0 0 1-17.78 30.87L256 420.13v-28.56l83.54-48.24V240.82L256 192.58v25.51l37.83 21.84a8.86 8.86 0 0 1 4.42 7.64V349.65a8.84 8.84 0 0 1-4.42 7.64L256 379.13a8.84 8.84 0 0 1-8.84 0l-37.83-21.84a8.84 8.84 0 0 1-4.42-7.64V247.57a8.86 8.86 0 0 1 4.42-7.64L256 218v-25.42l-83.52 48.22V343.3L256 391.57v28.56l-90.56-52.27a35.62 35.62 0 0 1-17.78-30.87V234.92a35.65 35.65 0 0 1 17.78-30.87l37.83-21.84V131a90.86 90.86 0 0 1 45.5-78.74l105.2-60.73a91 91 0 0 1 91 0l45.54 26.29a91.06 91.06 0 0 1 45.5 78.75v121.47a91.06 91.06 0 0 1-45.5 78.74l-52.88 30.53V228l52.88-30.53a68.54 68.54 0 0 0 34.27-59.31V96.12a68.55 68.55 0 0 0-34.27-59.3l-45.54-26.3a68.62 68.62 0 0 0-68.55 0L289.76 36.8a68.56 68.56 0 0 0-34.28 59.3v68.52l83.52-48.22 52.88 30.53L256 228v28.56l129.52-74.78V96.12a45.74 45.74 0 0 0-22.81-39.53l-45.54-26.3a45.72 45.72 0 0 0-45.71 0l-45.54 26.3A45.74 45.74 0 0 0 203.1 96.12v128l-52.88-30.53V96.12a91.06 91.06 0 0 1 45.5-78.75L241.26 4.18a19.14 19.14 0 0 0 7.33 7.55l105.2 60.73a91 91 0 0 1 45.5 78.74v64.67l45.5-26.28a19 19 0 0 0 9.5-16.44V96.12a19 19 0 0 0-9.5-16.44l-45.54-26.3a19 19 0 0 0-19 0L334.7 79.68a19 19 0 0 0-9.5 16.44v38.13l-22.66 13.09V96.12A41.35 41.35 0 0 1 323.23 60l45.54-26.3a41.39 41.39 0 0 1 41.36 0L455.67 60a41.35 41.35 0 0 1 20.68 35.83v72.17a41.32 41.32 0 0 1-20.68 35.82l-45.54 26.3v28.56l49.48-28.57a91 91 0 0 1 45.51 78.75v.27zM8.84 190.44a90.86 90.86 0 0 1 40.73-53.86l105.22-60.73a91 91 0 0 1 91 0l21.68 12.5a17.56 17.56 0 0 0-2.43 8.53v72.14l-83.52 48.2a48 48 0 0 0-24 41.57v39.46L107.9 269.7a8.86 8.86 0 0 1-4.42-7.66V160a8.84 8.84 0 0 1 4.42-7.64l37.83-21.84a8.84 8.84 0 0 1 8.84 0l37.83 21.84a8.83 8.83 0 0 1 4.42 7.64V193.2l22.51 13v-53.35a8.83 8.83 0 0 1 4.42-7.64l37.83-21.84a8.84 8.84 0 0 1 8.84 0l37.82 21.84a8.86 8.86 0 0 1 4.42 7.64V262a8.84 8.84 0 0 1-4.42 7.64l-22.51 13v51l22.51-13a8.84 8.84 0 0 0 4.42-7.64V211a8.84 8.84 0 0 0-4.42-7.64l-37.82-21.84V153l37.82 21.84a35.65 35.65 0 0 1 17.78 30.87v102.38a35.62 35.62 0 0 1-17.78 30.87L256 367.94a35.62 35.62 0 0 1-35.56 0l-37.83-21.84a8.83 8.83 0 0 1-4.42-7.64V236.38a8.83 8.83 0 0 1 4.42-7.64L256 206.3V177.74l-52.16 30.12v88.06L256 344.07v28.56l-90.54-52.27a35.62 35.62 0 0 1-17.78-30.87V187.41a35.62 35.62 0 0 1 17.78-30.87L256 108.42v28.56l-83.52 48.2v102.5L256 335.87v-25.51l-37.83-21.84a8.84 8.84 0 0 1-4.42-7.64V178.81a8.86 8.86 0 0 1 4.42-7.64L256 149.33a8.84 8.84 0 0 1 8.84 0l37.83 21.84a8.84 8.84 0 0 1 4.42 7.64v102.08a8.86 8.86 0 0 1-4.42 7.64L256 310.97v25.42l83.52-48.22V185.7L256 137.42v-28.56l90.56 52.27a35.65 35.65 0 0 1 17.78 30.87v102.38a35.62 35.62 0 0 1-17.78 30.87l-37.83 21.84v51.24a90.86 90.86 0 0 1-45.5 78.74l-105.2 60.73a91 91 0 0 1-91 0L16.49 512.8A91.06 91.06 0 0 1 -29 434.05V312.58a91.06 91.06 0 0 1 45.5-78.74l52.88-30.53V286l-52.88 30.53a68.54 68.54 0 0 0-34.27 59.31v121.47a68.55 68.55 0 0 0 34.27 59.3l45.54 26.3a68.62 68.62 0 0 0 68.55 0l105.23-60.73a68.56 68.56 0 0 0 34.28-59.3v-68.52l-83.52 48.22-52.88-30.53L256 286v-28.56L126.48 331.22v85.22a45.74 45.74 0 0 0 22.81 39.53l45.54 26.3a45.72 45.72 0 0 0 45.71 0l45.54-26.3a45.74 45.74 0 0 0 22.82-39.53v-128l52.88 30.53v97.47a91.06 91.06 0 0 1-45.5 78.75l-45.54 26.27a19.14 19.14 0 0 0-7.33-7.55L158.17 452.6a91 91 0 0 1-45.5-78.74v-64.67l-45.5 26.28A19 19 0 0 0 57.67 452v72.33a19 19 0 0 0 9.5 16.44l45.54 26.3a19 19 0 0 0 19 0l45.54-26.3A19 19 0 0 0 186.8 524V486l22.66-13.09V524a41.35 41.35 0 0 1-20.68 35.83l-45.54 26.3a41.39 41.39 0 0 1-41.36 0L56.33 560A41.35 41.35 0 0 1 35.65 524V452a41.32 41.32 0 0 1 20.68-35.82l45.54-26.3v-28.56L52.39 390a91 91 0 0 1-45.51-78.75v-.27z"/></svg>
                Modrinth
              </span>
            </div>
          </div>
        </a>`;
    } catch {
      el.innerHTML = `
        <a class="mc-inner mc-error" href="https://modrinth.com/project/${slug}" target="_blank" rel="noopener">
          <div class="mc-icon-wrap"><div class="mc-icon-fallback">⬡</div></div>
          <div class="mc-body">
            <div class="mc-header"><span class="mc-name">${slug}</span><span class="mc-type">Modrinth</span></div>
            <p class="mc-desc">Auf Modrinth ansehen</p>
          </div>
        </a>`;
    }
  }));
}

document.addEventListener('DOMContentLoaded', loadModrinthCards);
