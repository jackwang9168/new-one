<script setup>
</script>

<template>
  <router-view></router-view>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}


#app {
  width: 100%;
  height: 100%;
  /* 可选：如果 #app 内部还想用 flex/grid 布局 */
  /* display: flex; */ /* 或 grid */
}



body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}
</style>
