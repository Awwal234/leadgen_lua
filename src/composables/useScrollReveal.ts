import { onMounted, onUnmounted, ref } from 'vue'

export function useScrollReveal() {
  const observer = ref<IntersectionObserver | null>(null)

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('is-visible')
      })
      return
    }

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.classList.add('is-visible')
            observer.value?.unobserve(target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      },
    )

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.value?.observe(el)
    })

    document.querySelectorAll('.reveal-stagger').forEach((group) => {
      const children = group.querySelectorAll<HTMLElement>('.reveal')
      children.forEach((child, i) => {
        child.style.setProperty('--stagger-delay', `${i * 120}ms`)
      })
    })
  })

  onUnmounted(() => {
    observer.value?.disconnect()
  })
}
