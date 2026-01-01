import { useEffect, useRef } from 'react';
import './ScrollEdgeBlurs.css';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function ScrollEdgeBlurs({
                                            fade = 180,
                                            height = '6rem',
                                            blur = '18px',
                                            maxOpacity = 1,
                                            zIndex = 1,
                                            className = ''
                                        }) {
    const topRef = useRef(null);
    const bottomRef = useRef(null);
    const rafRef = useRef(0);

    useEffect(() => {
        const topEl = topRef.current;
        const bottomEl = bottomRef.current;
        if (!topEl || !bottomEl) return;

        const container = topEl.parentElement;
        if (!container) return;

        const apply = (topO, bottomO) => {
            topEl.style.opacity = String(topO);
            bottomEl.style.opacity = String(bottomO);
        };

        const update = () => {
            rafRef.current = 0;
            const rect = container.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;

            const inView = rect.bottom > 0 && rect.top < vh;

            let topO = 0;
            let bottomO = 0;

            if (inView) {
                if (rect.top >= 0) {
                    topO = clamp((vh - rect.top) / fade, 0, 1) * maxOpacity;
                }
                if (rect.bottom <= vh + fade) {
                    bottomO = clamp((vh + fade - rect.bottom) / fade, 0, 1) * maxOpacity;
                }
            }

            apply(topO, bottomO);
        };

        const onScroll = () => {
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [fade, maxOpacity]);

    return (
        <>
            <div
                ref={topRef}
                className={`scroll-edge-blur scroll-edge-blur--top ${className}`.trim()}
                style={{ height, zIndex, '--seb-blur': blur }}
            />
            <div
                ref={bottomRef}
                className={`scroll-edge-blur scroll-edge-blur--bottom ${className}`.trim()}
                style={{ height, zIndex, '--seb-blur': blur }}
            />
        </>
    );
}
