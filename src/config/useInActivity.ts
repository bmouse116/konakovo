import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"

// Тип для колбэков, которые могут быть зарегистрированы
type InactivityCallback = () => void;

export const useInactivity = () => {
    const timeOutToHome = 120 // секунды
    const route = useRoute()
    const router = useRouter()
    const isInactive = ref(false)
    let intervalId: number | undefined

    // Хранилище для колбэков, которые нужно выполнить при неактивности
    const onInactiveCallbacks = new Set<InactivityCallback>()

    const clearInactiveTime = () => clearInterval(intervalId)

    const inactivityTime = () => {
        const resetTimer = () => {
            time = 0
            isInactive.value = false
        }
        let time = 0

        intervalId = setInterval(() => {
            const timeout = timeOutToHome
            time++
            if (time >= +timeout) {
                isInactive.value = true

                // Вызываем все зарегистрированные колбэки
                onInactiveCallbacks.forEach(callback => {
                    try {
                        callback()
                    } catch (e) {
                        console.error("Error executing inactivity callback:", e)
                    }
                })

                resetTimer() // Сбрасываем таймер и флаг isInactive

                if (route.name !== '/') { // Проверяем, что мы не на главной
                    router.push('/')
                }
            }
        }, 1000)

        document.addEventListener('mousemove', resetTimer)
		document.addEventListener('keypress', resetTimer)
		document.addEventListener('touch', resetTimer)
		document.addEventListener('touchmove', resetTimer)
		document.addEventListener('touchstart', resetTimer)
    }

    // Функция для регистрации колбэка
    const registerOnInactive = (callback: InactivityCallback): (() => void) => {
        onInactiveCallbacks.add(callback)
        return () => onInactiveCallbacks.delete(callback)
    }

    return {
        inactivityTime,
        clearInactiveTime,
        isInactive,
        registerOnInactive
    }
}
