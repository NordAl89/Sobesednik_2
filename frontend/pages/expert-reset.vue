<template>
    <div class="reset-page">
        <h1>Восстановление пароля</h1>
        
        <div v-if="!showConfirm" class="step1">
            <div class="info">
                <p><strong>Как восстановить пароль:</strong></p>
                <ol>
                    <li>
                        Откройте Telegram-бот:
                        <a href="https://t.me/sobesednik_helper_bot" target="_blank">@sobesednik_helper_bot</a>
                    </li>
                    <li>Нажмите кнопку <strong>Start</strong> или отправьте команду <code>/start</code></li>
                    <li>Дождитесь приветственного сообщения от бота</li>
                    <li>Вернитесь на эту страницу и укажите:
                        <ul>
                            <li>ваш логин</li>
                            <li>ваше имя в Telegram (например: <code>@AlexFerrero9</code>)</li>
                        </ul>
                    </li>
                    <li>Нажмите «Отправить код»</li>
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
                    <input v-model="form.telegram" type="text" placeholder="@username" required />
                </label>

                <button type="submit" :disabled="loading">
                    {{ loading ? 'Отправка...' : 'Отправить код' }}
                </button>

                <div v-if="message" class="msg">{{ message }}</div>
                <div v-if="error" class="error">{{ error }}</div>
            </form>
        </div>

        <!-- Шаг 2: Ввод кода и нового пароля -->
        <div v-if="showConfirm" class="step2">
            <h2>Введите код и новый пароль</h2>
            
            <div class="info">
                <p>Мы отправили код в Telegram <strong>{{ form.telegram }}</strong></p>
                <p>Проверьте сообщения от <strong>@sobesednik_helper_bot</strong></p>
            </div>
            
            <form @submit.prevent="handleConfirm" class="confirm-form">
                <label>
                    6-значный код из Telegram
                    <input v-model="confirmForm.code" type="text" maxlength="6" required />
                </label>
                
                <label>
                    Новый пароль
                    <input v-model="confirmForm.password" type="password" required />
                </label>
                
                <label>
                    Подтвердите пароль
                    <input v-model="confirmForm.confirmPassword" type="password" required />
                </label>
                
                <div class="form-actions">
                    <button type="button" @click="showConfirm = false" class="back-btn">
                        Назад
                    </button>
                    <button type="submit" :disabled="confirmLoading">
                        {{ confirmLoading ? 'Смена пароля...' : 'Сменить пароль' }}
                    </button>
                </div>
                
                <div v-if="confirmMessage" class="msg">{{ confirmMessage }}</div>
                <div v-if="confirmError" class="error">{{ confirmError }}</div>
            </form>
        </div>
    </div>
</template>

<script setup>
const form = ref({
    login: '',
    telegram: ''
})

const confirmForm = ref({
    code: '',
    password: '',
    confirmPassword: ''
})

const loading = ref(false)
const confirmLoading = ref(false)
const error = ref('')
const confirmError = ref('')
const message = ref('')
const confirmMessage = ref('')
const showConfirm = ref(false)

const handleReset = async () => {
    loading.value = true
    error.value = ''
    message.value = ''
    
    // Проверяем формат Telegram
    if (!form.value.telegram.startsWith('@')) {
        error.value = 'Укажите Telegram в формате @username'
        loading.value = false
        return
    }

    try {
        const res = await $fetch('http://localhost:4000/experts/reset', {
            method: 'POST',
            body: form.value
        })

        message.value = res.message || 'Код отправлен! Проверьте Telegram'
        showConfirm.value = true
        
    } catch (err) {
        error.value = err?.data?.message || err?.data?.error || 'Ошибка восстановления'
        if (error.value.includes('боту')) {
            error.value += ' Перейдите в бота и нажмите Start'
        }
    } finally {
        loading.value = false
    }
}

const handleConfirm = async () => {
    confirmLoading.value = true
    confirmError.value = ''
    confirmMessage.value = ''
    
    // Проверяем совпадение паролей
    if (confirmForm.value.password !== confirmForm.value.confirmPassword) {
        confirmError.value = 'Пароли не совпадают'
        confirmLoading.value = false
        return
    }
    
    // Проверяем длину пароля
    if (confirmForm.value.password.length < 6) {
        confirmError.value = 'Пароль должен быть не менее 6 символов'
        confirmLoading.value = false
        return
    }

    try {
        const res = await $fetch('http://localhost:4000/experts/reset/confirm', {
            method: 'POST',
            body: {
                login: form.value.login,
                code: confirmForm.value.code,
                password: confirmForm.value.password
            }
        })

        confirmMessage.value = 'Пароль успешно изменен! Теперь вы можете войти в личный кабинет.'
        
        // Через 2 секунды перенаправляем на страницу входа
        setTimeout(() => {
            navigateTo('/expert-login')
        }, 2000)
        
    } catch (err) {
        confirmError.value = err?.data?.message || err?.data?.error || 'Ошибка смены пароля'
    } finally {
        confirmLoading.value = false
    }
}
</script>

<style scoped>
.reset-page {
    max-width: 500px;
    margin: 40px auto;
    padding: 20px;
}

.info {
    background: #f0f7ff;
    border: 1px solid #c2d9ff;
    padding: 15px;
    border-radius: 10px;
    font-size: 0.95rem;
    margin-bottom: 20px;
}

.info strong {
    color: #2b7bff;
}

.info a {
    color: #2b7bff;
    font-weight: 600;
    text-decoration: none;
}

.info a:hover {
    text-decoration: underline;
}

.reset-form,
.confirm-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
}

input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
}

button {
    padding: 12px;
    background: #2b7bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.msg {
    color: green;
    text-align: center;
    padding: 10px;
    background: #f0fff0;
    border-radius: 6px;
}

.error {
    color: #d32f2f;
    text-align: center;
    padding: 10px;
    background: #ffebee;
    border-radius: 6px;
}

.form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.back-btn {
    background: #6c757d;
}

.back-btn:hover {
    background: #5a6268;
}
</style>