<template>
  <div v-if="enableSearch">
    <!-- 搜索 -->
    <div id="search" class="s-search">
      <!-- HTML 代码部分 -->
      <div id="search-list" class="hide-type-list">
        <div class="s-type">
          <span></span>
          <div class="s-type-list animated fadeInUp">
            <label for="type-baidu">常用</label>
            <label for="type-search">搜索</label>
            <label for="type-br">工具</label>
            <label for="type-zhihu">社区</label>
            <label for="type-taobao1">生活</label>
            <label for="type-zhaopin">求职</label>
          </div>
        </div>
        <div class="search-group group-a">
          <span class="type-text">常用</span>
          <ul class="search-type">
            <li>
              <input
                checked
                hidden
                type="radio"
                name="type"
                id="type-baidu"
                value="https://www.baidu.com/s?wd="
                data-placeholder="百度一下"
              />
              <label for="type-baidu"><span style="color: #2100E0">百度</span></label>
            </li>
            <!-- 其他搜索选项 -->
          </ul>
        </div>
        <!-- 其他 search-group -->
        <form
          action="?s="
          method="get"
          target="_blank"
          id="super-search-fm"
        >
          <input
            type="text"
            id="search-text"
            placeholder="输入关键字搜索"
            style="outline: 0"
          />
          <button type="submit"><i class="fa fa-search"></i></button>
        </form>
        <div class="set-check hidden-xs">
          <input
            type="checkbox"
            id="set-search-blank"
            class="bubble-3"
            autocomplete="off"
          />
        </div>
      </div>
    </div>
    <script src="https://kit.fontawesome.com/your-kit-link.js"></script>
  </div>
  <div v-else>
    <div class="no-search"></div>
  </div>
</template>

<script>
export default {
  name: "SearchComponent",
  data() {
    return {
      enableSearch: true // 假设从父组件传递过来，用于控制是否显示搜索功能
    };
  },
  mounted() {
    // 将 JavaScript 代码迁移到 Vue 的生命周期方法中
    // 例如：
    // 初始化搜索功能
    this.initSearch();
  },
  methods: {
    initSearch() {
      // 脚本部分的 JavaScript
      // 这里的逻辑需要根据 Vue 的特性进行调整
      // 例如：
      // 获取元素
      const searchInput = document.getElementById("search-text");
      // 添加事件监听
      searchInput.addEventListener("focus", () => {
        // 处理聚焦事件
        console.log("Search input focused");
      });
    }
  }
};
</script>

<style>
/* 样式部分 */
#search {
  /* 添加你的样式 */
}
</style>
