// Theme Toggle Module
class ThemeManager {
    constructor() {
        this.themeKey = 'pandemic-pulse-theme';
        this.toggleBtn = document.querySelector('.theme-toggle');
        this.currentTheme = localStorage.getItem(this.themeKey) || 'dark';
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.toggleBtn.addEventListener('click', () => this.toggle());
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // this.toggleBtn.textContent = theme === 'dark' ? '☀' : '☾'; // BUG: icon doesn't change
        this.currentTheme = theme;
        localStorage.setItem(this.themeKey, theme);
    }
    
    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
