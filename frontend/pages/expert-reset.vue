<template>
    <div class="reset-page">
        <h1>Восстановление пароля</h1>
        <div class="info">
            <p><strong>Как восстановить пароль:</strong></p>
            <ol>
                <li>
                    Откройте Telegram-бот:
                    <a href="https://t.me/sobesednik_helper_bot" target="_blank">@sobesednik_helper_bot</a>
                </li>
                <li>Нажмите кнопку <strong>Start</strong> или отправьте команду <code>/start</code></li>
                <li>Напишите боту слово: <strong>Восстановить</strong></li>
                <li>Вернитесь на эту страницу и укажите:
                    <ul>
                        <li>ваш логин</li>
                        <li>ваше имя в Telegram (например: <code>@AlexFerrero9</code>)</li>
                    </ul>
                </li>
                <li>Нажмите «Восстановить пароль»</li>
            </ol>
            <p>После этого бот отправит вам код для смены пароля.</p>
        </div>
        <form @submit.prevent="handleReset" class="reset-form">
            <label>
                Логин
                <input v-model="form.login" type="text" required />
            </label>

            <label>
                Telegram (например: @AlexFerrero9)
                <input v-model="form.telegram" type="text" required />
            </label>

            <button type="submit" :disabled="loading">
                {{ loading ? 'Отправка...' : 'Восстановить пароль' }}
            </button>

            <div v-if="message" class="msg">{{ message }}</div>
            <div v-if="error" class="error">{{ error }}</div>
        </form>
    </div>
</template>

<script setup>
const form = ref({
    login: '',
    telegram: ''
})

const loading = ref(false)
const error = ref('')
const message = ref('')

const handleReset = async () => {
    loading.value = true
    error.value = ''
    message.value = ''

    try {
        const res = await $fetch('http://localhost:4000/experts/reset', {
            method: 'POST',
            body: form.value
        })

        message.value = res.message
    } catch (err) {
        error.value = err?.data?.message || 'Ошибка восстановления'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.reset-page {
    max-width: 400px;
    margin: 40px auto;
    padding: 20px;
   
}

.reset-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

label {
    display: flex;
    flex-direction: column;
}

.msg {
    color: green;
    text-align: center;
}

.error {
    color: red;
    text-align: center;
}

.info {
    background: #eee9f7;
    border: 1px solid #d9d9ff;
    padding: 15px;
    border-radius: 10px;
    font-size: 0.95rem;
    margin-bottom: 20px;
}

.info a {
    color: #2b7bff;
    font-weight: 600;
    text-decoration: none;
}

.info a:hover {
    text-decoration: underline;
}

.info ol {
    margin-left: 20px;
    padding-left: 10px;
}

.info code {
    background: #eee;
    padding: 2px 5px;
    border-radius: 4px;
}
</style>
