<template>
    <div class="login-page">
        <div class="login-container">
            <h1>Вход в админ-панель</h1>

            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" required placeholder="admin@example.com">
                </div>

                <div class="form-group">
                    <label for="password">Пароль</label>
                    <input type="password" id="password" v-model="password" required placeholder="••••••••">
                </div>

                <button type="submit" class="login-btn">Войти</button>

                <div v-if="error" class="error-message">{{ error }}</div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'AdminLogin',
    setup() {
        const email = ref('');
        const password = ref('');
        const error = ref('');
        const router = useRouter();

        const handleLogin = () => {
            if (email.value === 'admin@example.com' && password.value === 'admin123') {
                localStorage.setItem('isAuthenticated', 'true');
                router.push('/admin');
            } else {
                error.value = 'Неверный email или пароль';
            }
        };

        return {
            email,
            password,
            error,
            handleLogin
        };
    }
};
</script>

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.login-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.login-container h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #007bff;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 500;
    color: #4a5568;
}

.form-group input {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1rem;
}

.login-btn {
    background-color: #3182ce;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.login-btn:hover {
    background-color: #2c5282;
}

.error-message {
    color: #e53e3e;
    text-align: center;
    margin-top: 1rem;
}
</style>