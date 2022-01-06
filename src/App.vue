<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <a class="nav-item nav-link active" href="/">Home</a>
          <a class="nav-item nav-link" href="/about">about</a>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'MainLayout'
  }
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap");
:root {
  --font: Roboto, sans-serif;
  --textColor: #374961;
  --linkActiveColor: #41b783;
}
#app {
  font-family: var(--font);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--textColor);
  .logo {
    width: 20%;
  }
}
.nav {
  padding: 30px 0 100px 0;
  a {
    font-weight: 500;
    color: var(--textColor);
    margin: 0 5px;
  }
  a.router-link-exact-active {
    color: var(--linkActiveColor);
  }
}
</style>
