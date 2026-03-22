<template>
  <div id="search" class="s-search">
    <div id="search-list" class="hide-type-list">
      <div class="s-type">
        <span></span>
        <div class="s-type-list animated fadeInUp">
          <label for="type-baidu">常用</label>
          <label for="type-search">搜索</label>
          <label for="type-br">工具</label>
          <label for="type-zhihu">社区</label>
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
          <li>
            <input
              hidden
              type="radio"
              name="type"
              id="type-google"
              value="https://www.google.com/search?q="
              data-placeholder="Google"
            />
            <label for="type-google"><span style="color: #4285F4">Google</span></label>
          </li>
        </ul>
      </div>
      <form action="?s=" method="get" target="_blank" id="super-search-fm">
        <input
          type="text"
          id="search-text"
          placeholder="输入关键字搜索"
          style="outline: 0"
        />
        <button type="submit"><i class="fa fa-search"></i></button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchComponent",
  mounted() {
    const searchInput = document.getElementById("search-text");
    if (searchInput) {
      searchInput.addEventListener("focus", () => {
        console.log("Search input focused");
      });
    }
  }
};
</script>

<style scoped>
#search {
  margin: 20px auto;
  max-width: 600px;
}

.s-search {
  padding: 10px;
}

.s-type {
  margin-bottom: 10px;
}

.s-type-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.s-type-list label {
  cursor: pointer;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #00ffe7;
}

.s-type-list label:hover {
  background: rgba(255, 255, 255, 0.2);
}

.search-type {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-type li {
  display: inline-block;
}

.search-type label {
  cursor: pointer;
  padding: 5px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.search-type label:hover {
  background: rgba(255, 255, 255, 0.2);
}

#super-search-fm {
  display: flex;
  gap: 5px;
  margin-top: 15px;
}

#search-text {
  flex: 1;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #00ffe7;
}

#search-text::placeholder {
  color: rgba(0, 255, 231, 0.5);
}

button {
  padding: 10px 20px;
  background: #42b983;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #359268;
}
</style>
