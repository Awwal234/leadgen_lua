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
            target.classList.add('is-visible', 'transition-all', 'duration-[800ms]', 'ease-[cubic-bezier(0.175,0.885,0.32,1.275)]')
            observer.value?.unobserve(target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
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
