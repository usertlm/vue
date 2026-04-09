<template>
  <div class="search-wrapper">
    <div class="search-type-bar">
      <button
        v-for="engine in engines"
        :key="engine.id"
        class="engine-btn"
        :class="{ active: selectedEngine === engine.id }"
        @click="selectedEngine = engine.id"
      >
        {{ engine.label }}
      </button>
    </div>
    <form class="search-form" @submit.prevent="doSearch">
      <input
        v-model="query"
        type="text"
        class="search-input"
        placeholder="搜索..."
        autocomplete="off"
        spellcheck="false"
      />
      <button type="submit" class="search-btn">搜索</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "SearchComponent",
  data() {
    return {
      query: '',
      selectedEngine: 'baidu',
      engines: [
        { id: 'baidu', label: '百度', url: 'https://www.baidu.com/s?wd=' },
        { id: 'google', label: 'Google', url: 'https://www.google.com/search?q=' },
        { id: 'bing', label: 'Bing', url: 'https://www.bing.com/search?q=' },
      ]
    }
  },
  methods: {
    doSearch() {
      if (!this.query.trim()) return
      const engine = this.engines.find(e => e.id === this.selectedEngine)
      window.open(engine.url + encodeURIComponent(this.query), '_blank')
    }
  }
}
</script>

<style scoped>
.search-wrapper { width: 100%; }

.search-type-bar {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 12px;
}

.engine-btn {
  padding: 5px 14px;
  border: none;
  background: transparent;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-olive-gray);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-family: var(--font-sans);
}

.engine-btn:hover { color: var(--color-near-black); }

.engine-btn.active {
  background: var(--color-dark-surface);
  color: var(--color-warm-silver);
}

.search-form {
  display: flex;
  gap: 8px;
  background: var(--color-white);
  border: 1px solid var(--color-border-cream);
  border-radius: var(--radius-md);
  padding: 6px 6px 6px 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s, border-color 0.2s;
}

.search-form:focus-within {
  border-color: var(--color-terracotta);
  box-shadow: 0 0 0 3px rgba(201, 100, 66, 0.10);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--color-near-black);
  background: transparent;
  font-family: var(--font-sans);
}

.search-input::placeholder { color: var(--color-stone-gray); }

.search-btn {
  padding: 9px 20px;
  background: var(--color-terracotta);
  color: var(--color-ivory);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: background 0.2s;
  white-space: nowrap;
}

.search-btn:hover { background: var(--color-coral); }
</style>
