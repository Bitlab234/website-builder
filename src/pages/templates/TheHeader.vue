<template>
    <header class="header">
        <h1>Website Builder</h1>
        <nav>
            <router-link to="/">Главная</router-link>
            <router-link to="/admin/login">Администратор</router-link>
            <router-link to="/LandingsList">Мои лендинги</router-link>
        </nav>
    </header>
</template>

<script setup lang="ts">

</script>

<style scoped>
.header {
    background-color: #007bff;
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header h1 {
    margin: 0;
    font-size: 24px;
}

nav a {
    color: white;
    text-decoration: none;
    margin-left: 15px;
}

nav a:hover {
    text-decoration: underline;
}
</style>