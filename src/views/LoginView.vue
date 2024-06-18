<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const router = useRouter()
const isAuthenticated = ref(!!localStorage.getItem('authToken')) // Etat de connexion

const validateEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

const login = async () => {
  emailError.value = ''
  passwordError.value = ''

  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address.'
  }

  if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters long.'
  }

  if (emailError.value || passwordError.value) {
    return
  }

  try {
    // Exemple de logique de connexion fictive
    if (email.value === 'user@example.com' && password.value === 'password') {
      localStorage.setItem('authToken', 'your_token') // Stockez le token d'authentification
      isAuthenticated.value = true
      await router.push({ name: 'home' }) // Redirigez vers la page d'accueil
    } else {
      passwordError.value = 'Invalid email or password.'
    }
  } catch (error) {
    console.error('Login error:', error)
    passwordError.value = 'An unexpected error occurred. Please try again.'
  }
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 w-dvw h-dvh flex">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign in to your account
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="login">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                v-model="email"
                type="email"
                name="email"
                id="email"
                aria-describedby="email-error"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required
              />
              <p
                v-if="emailError"
                id="email-error"
                class="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {{ emailError }}
              </p>
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                v-model="password"
                type="password"
                name="password"
                id="password"
                aria-describedby="password-error"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
              <p
                v-if="passwordError"
                id="password-error"
                class="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {{ passwordError }}
              </p>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                </div>
              </div>
              <a
                href="#"
                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Forgot password?</a
              >
            </div>
            <button
              type="submit"
              class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Sign in
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?
              <router-link
                to="/register"
                class="text-primary-600 hover:underline dark:text-primary-500"
                >Sign up</router-link
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
