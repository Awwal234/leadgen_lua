import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      meta: { public: true },
      children: [
        {
          path: '',
          name: 'landing',
          component: () => import('@/views/LandingPage.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/layouts/GuestLayout.vue'),
      meta: { guest: true },
      children: [
        {
          path: '',
          name: 'login-page',
          component: () => import('@/views/auth/LoginPage.vue'),
        },
      ],
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/layouts/GuestLayout.vue'),
      meta: { guest: true },
      children: [
        {
          path: '',
          name: 'register-page',
          component: () => import('@/views/auth/RegisterPage.vue'),
        },
      ],
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('@/layouts/GuestLayout.vue'),
      meta: { guest: true },
      children: [
        {
          path: '',
          name: 'verify-email-page',
          component: () => import('@/views/auth/VerifyEmailPage.vue'),
        },
      ],
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/layouts/GuestLayout.vue'),
      meta: { guest: true },
      children: [
        {
          path: '',
          name: 'forgot-password-page',
          component: () => import('@/views/auth/ForgotPasswordPage.vue'),
        },
      ],
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/layouts/GuestLayout.vue'),
      meta: { guest: true },
      children: [
        {
          path: '',
          name: 'reset-password-page',
          component: () => import('@/views/auth/ResetPasswordPage.vue'),
        },
      ],
    },
    {
      path: '/app',
      component: () => import('@/layouts/AuthenticatedLayout.vue'),
      meta: { auth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardPage.vue'),
        },
        {
          path: 'leads/:leadId',
          name: 'lead-detail',
          component: () => import('@/views/LeadDetailPage.vue'),
          props: true,
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsPage.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()

  if (!auth.user && auth.accessToken) {
    await auth.fetchUser()
  }

  const requiresAuth = to.matched.some((r) => r.meta.auth)
  const requiresGuest = to.matched.some((r) => r.meta.guest)

  if (requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if (requiresGuest && auth.isAuthenticated) {
    next('/app')
  } else {
    next()
  }
})

export default router
