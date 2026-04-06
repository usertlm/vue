<template>
  <div id="search" class="s-search">
    <div id="search-list" class="hide-type-list">
      <div class="s-type">
        <div class="s-type-list">
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
            <label for="type-baidu"><span class="engine-baidu">百度</span></label>
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
            <label for="type-google"><span class="engine-google">Google</span></label>
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
        <button type="submit"><i class="fa fa-search"></i> 搜索</button>
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
.s-search {
  max-width: 600px;
  margin: 32px auto;
  padding: 0 20px;
}

.s-type {
  margin-bottom: 16px;
}

.s-type-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.s-type-list label {
  cursor: pointer;
  padding: 6px 14px;
  background: #e8e6dc;
  border-radius: 20px;
  color: #4d4c48;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.s-type-list label:hover {
  background: #c96442;
  color: #faf9f5;
}

.search-type {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 12px 0;
}

.search-type li {
  display: inline-block;
}

.search-type label {
  cursor: pointer;
  padding: 6px 16px;
  background: #e8e6dc;
  border-radius: 20px;
  transition: all 0.2s;
}

.search-type label:hover {
  background: #d1cfc5;
}

.engine-baidu { color: #2100E0; font-weight: 500; }
.engine-google { color: #4285F4; font-weight: 500; }

#super-search-fm {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

#search-text {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  background: #faf9f5;
  color: #141413;
  font-size: 15px;
  font-family: Arial, sans-serif;
  transition: border-color 0.2s, box-shadow 0.2s;
}

#search-text:focus {
  outline: none;
  border-color: #c96442;
  box-shadow: 0 0 0 3px rgba(201, 100, 66, 0.12);
}

#search-text::placeholder {
  color: #87867f;
}

button {
  padding: 12px 20px;
  background: #c96442;
  border: none;
  border-radius: 12px;
  color: #faf9f5;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: Arial, sans-serif;
  transition: background 0.2s;
  box-shadow: #c96442 0px 0px 0px 0px, #c96442 0px 0px 0px 1px;
}

button:hover {
  background: #d97757;
}
</style>
