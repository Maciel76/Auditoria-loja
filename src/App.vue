<template>
  <div id="app">
    <header>
      <h1>Sistema de Auditoria</h1>
      <nav>
        <router-link to="/">Upload</router-link>
        <router-link to="/usuarios">Usuários</router-link>
        <router-link to="/hanking">Hanking</router-link>
        <router-link to="/setores">Setores</router-link>
      </nav>
    </header>

    <router-view />
  </div>
</template>

<style>
header {
  background: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
}
nav {
  margin-top: 0.5rem;
}
nav a {
  margin: 0 1rem;
  color: white;
  text-decoration: none;
}
nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
