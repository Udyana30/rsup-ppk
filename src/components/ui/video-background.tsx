'use client'

import { useEffect, useRef } from 'react'

export function VideoBackground() {
    const video1Ref = useRef<HTMLVideoElement>(null)
    const video2Ref = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const v1 = video1Ref.current
        const v2 = video2Ref.current
        if (!v1 || !v2) return

        let active = v1
        let next = v2
        const TRANSITION_TIME = 1.5

        v1.style.opacity = '1'
        v1.style.zIndex = '10'
        v2.style.opacity = '0'
        v2.style.zIndex = '20'

        v1.play().catch(() => { })

        let animationFrame: number

        const loop = () => {
            if (!active.duration) {
                animationFrame = requestAnimationFrame(loop)
                return
            }

            const timeLeft = active.duration - active.currentTime

            if (timeLeft <= TRANSITION_TIME) {
                if (next.paused) {
                    next.currentTime = 0
                    next.play().catch(() => { })
                }
                const progress = 1 - (timeLeft / TRANSITION_TIME)
                next.style.opacity = Math.max(0, Math.min(1, progress)).toString()
            }

            if (active.ended || timeLeft <= 0) {
                active.pause()
                active.currentTime = 0
                active.style.opacity = '0'
                active.style.zIndex = '10'

                next.style.opacity = '1'
                next.style.zIndex = '10'

                const temp = active
                active = next
                next = temp

                active.style.zIndex = '10'
                active.style.opacity = '1'

                next.style.zIndex = '20'
                next.style.opacity = '0'
                next.pause()
                next.currentTime = 0
            }

            animationFrame = requestAnimationFrame(loop)
        }

        animationFrame = requestAnimationFrame(loop)

        return () => cancelAnimationFrame(animationFrame)
    }, [])

    return (
        <div className="absolute inset-0 bg-[#2C3E50] overflow-hidden">
            <video
                ref={video1Ref}
                autoPlay
                muted
                playsInline
                preload="auto"
                style={{ opacity: 1, zIndex: 10 }}
                className="absolute inset-0 h-full w-full object-cover blur-[6px] scale-105 brightness-75 transition-none"
            >
                <source src="/background.mp4" type="video/mp4" />
            </video>
            <video
                ref={video2Ref}
                muted
                playsInline
                preload="auto"
                style={{ opacity: 0, zIndex: 20 }}
                className="absolute inset-0 h-full w-full object-cover blur-[6px] scale-105 brightness-75 transition-none"
            >
                <source src="/background.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 pointer-events-none z-30" />
        </div>
    )
}
