/**
 * Butterfly 主题自定义脚本
 * 功能：深色模式切换、阅读时间计算
 */

(function() {
  'use strict';

  // ==========================================
  // 深色模式管理
  // ==========================================

  const ThemeManager = {
    // 主题常量
    THEMES: {
      LIGHT: 'light',
      DARK: 'dark',
      AUTO: 'auto'
    },

    STORAGE_KEY: 'theme-preference',

    // 初始化主题
    init() {
      this.applyTheme(this.getPreference());
      this.setupToggleButton();
      this.watchSystemTheme();
    },

    // 获取用户偏好
    getPreference() {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored || this.THEMES.AUTO;
    },

    // 保存用户偏好
    savePreference(theme) {
      localStorage.setItem(this.STORAGE_KEY, theme);
    },

    // 获取系统主题
    getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? this.THEMES.DARK
        : this.THEMES.LIGHT;
    },

    // 应用主题
    applyTheme(preference) {
      const theme = preference === this.THEMES.AUTO
        ? this.getSystemTheme()
        : preference;

      document.documentElement.setAttribute('data-theme', theme);
      this.updateToggleButton(preference);
    },

    // 切换主题
    toggleTheme() {
      const current = this.getPreference();
      let next;

      // 循环切换：light -> dark -> auto -> light
      switch(current) {
        case this.THEMES.LIGHT:
          next = this.THEMES.DARK;
          break;
        case this.THEMES.DARK:
          next = this.THEMES.AUTO;
          break;
        case this.THEMES.AUTO:
          next = this.THEMES.LIGHT;
          break;
        default:
          next = this.THEMES.AUTO;
      }

      this.savePreference(next);
      this.applyTheme(next);
    },

    // 设置切换按钮
    setupToggleButton() {
      // 创建切换按钮
      const button = document.createElement('button');
      button.id = 'theme-toggle';
      button.className = 'theme-toggle-btn';
      button.setAttribute('aria-label', '切换主题');
      button.innerHTML = this.getButtonIcon(this.getPreference());

      // 添加到右侧工具栏
      const rightside = document.getElementById('rightside');
      if (rightside) {
        rightside.insertBefore(button, rightside.firstChild);
      }

      // 绑定点击事件
      button.addEventListener('click', () => this.toggleTheme());
    },

    // 更新按钮图标
    updateToggleButton(preference) {
      const button = document.getElementById('theme-toggle');
      if (button) {
        button.innerHTML = this.getButtonIcon(preference);
      }
    },

    // 获取按钮图标
    getButtonIcon(preference) {
      const icons = {
        light: '<i class="fas fa-sun"></i>',
        dark: '<i class="fas fa-moon"></i>',
        auto: '<i class="fas fa-circle-half-stroke"></i>'
      };
      return icons[preference] || icons.auto;
    },

    // 监听系统主题变化
    watchSystemTheme() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this.getPreference() === this.THEMES.AUTO) {
          this.applyTheme(this.THEMES.AUTO);
        }
      });
    }
  };

  // ==========================================
  // 阅读时间计算
  // ==========================================

  const ReadingTime = {
    // 中文每分钟阅读字数
    WORDS_PER_MINUTE_ZH: 300,
    // 英文每分钟阅读单词数
    WORDS_PER_MINUTE_EN: 200,

    // 计算阅读时间
    calculate() {
      const content = document.querySelector('.post-content');
      if (!content) return;

      const text = content.textContent || '';

      // 统计中文字符
      const chineseChars = (text.match(/[一-龥]/g) || []).length;
      // 统计英文单词
      const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;

      // 计算阅读时间（分钟）
      const minutes = Math.ceil(
        chineseChars / this.WORDS_PER_MINUTE_ZH +
        englishWords / this.WORDS_PER_MINUTE_EN
      );

      this.display(minutes);
    },

    // 显示阅读时间
    display(minutes) {
      const metaDiv = document.querySelector('.post-meta');
      if (!metaDiv) return;

      // 创建阅读时间元素
      const readingTimeEl = document.createElement('span');
      readingTimeEl.className = 'post-meta-item reading-time';
      readingTimeEl.innerHTML = `
        <i class="far fa-clock"></i>
        <span>预计阅读 ${minutes} 分钟</span>
      `;

      // 添加到 meta 区域
      metaDiv.appendChild(readingTimeEl);
    }
  };

  // ==========================================
  // 初始化
  // ==========================================

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ThemeManager.init();
      ReadingTime.calculate();
    });
  } else {
    ThemeManager.init();
    ReadingTime.calculate();
  }

})();
