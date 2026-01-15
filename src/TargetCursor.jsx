import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({
                          targetSelector = '.chroma-card',
                          spinDuration = 2,
                          hideDefaultCursor = true,
                          hoverDuration = 0.2,
                          parallaxOn = true
                      }) => {
    const cursorRef = useRef(null);
    const cornersRef = useRef(null);
    const spinTl = useRef(null);
    const dotRef = useRef(null);

    const targetCornerPositionsRef = useRef(null);
    const tickerFnRef = useRef(null);
    const activeStrengthRef = useRef(0);

    const isMobile = useMemo(() => {
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
        return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
    }, []);

    const constants = useMemo(
        () => ({
            borderWidth: 3,
            cornerSize: 12
        }),
        []
    );

    const moveCursor = useCallback((x, y) => {
        if (!cursorRef.current) return;
        gsap.to(cursorRef.current, {
            x,
            y,
            duration: 0.1,
            ease: 'power3.out'
        });
    }, []);

    useEffect(() => {
        if (isMobile || !cursorRef.current) return;

        const cursor = cursorRef.current;
        const scope = cursor.parentElement;
        if (!scope) return;

        const originalScopeCursor = scope.style.cursor;
        if (hideDefaultCursor) {
            scope.style.cursor = 'none';
        }

        cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

        let activeTarget = null;
        let currentLeaveHandler = null;
        let resumeTimeout = null;

        const cleanupTarget = target => {
            if (currentLeaveHandler) {
                target.removeEventListener('mouseleave', currentLeaveHandler);
            }
            currentLeaveHandler = null;
        };

        const scopeRect0 = scope.getBoundingClientRect();

        gsap.set(cursor, {
            xPercent: -50,
            yPercent: -50,
            x: scopeRect0.width / 2,
            y: scopeRect0.height / 2,
            autoAlpha: 0
        });

        const createSpinTimeline = () => {
            if (spinTl.current) {
                spinTl.current.kill();
            }
            spinTl.current = gsap
                .timeline({ repeat: -1 })
                .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
        };

        createSpinTimeline();

        const tickerFn = () => {
            if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) return;

            const strength = activeStrengthRef.current;
            if (strength === 0) return;

            const cursorX = gsap.getProperty(cursorRef.current, 'x');
            const cursorY = gsap.getProperty(cursorRef.current, 'y');

            const corners = Array.from(cornersRef.current);
            corners.forEach((corner, i) => {
                const currentX = gsap.getProperty(corner, 'x');
                const currentY = gsap.getProperty(corner, 'y');

                const targetX = targetCornerPositionsRef.current[i].x - cursorX;
                const targetY = targetCornerPositionsRef.current[i].y - cursorY;

                const finalX = currentX + (targetX - currentX) * strength;
                const finalY = currentY + (targetY - currentY) * strength;

                const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

                gsap.to(corner, {
                    x: finalX,
                    y: finalY,
                    duration: duration,
                    ease: duration === 0 ? 'none' : 'power1.out',
                    overwrite: 'auto'
                });
            });
        };

        tickerFnRef.current = tickerFn;

        const enterScope = () => {
            gsap.to(cursorRef.current, { autoAlpha: 1, duration: 0.12, overwrite: true });
        };

        const leaveScope = () => {
            if (currentLeaveHandler) currentLeaveHandler();
            gsap.to(cursorRef.current, { autoAlpha: 0, duration: 0.12, overwrite: true });
        };

        const moveHandler = e => {
            const r = scope.getBoundingClientRect();
            moveCursor(e.clientX - r.left, e.clientY - r.top);
        };

        const updateActiveTargetCorners = () => {
            if (!activeTarget || !cursorRef.current) return;

            const scopeRect = scope.getBoundingClientRect();
            const rect = activeTarget.getBoundingClientRect();
            const { borderWidth, cornerSize } = constants;

            const left = rect.left - scopeRect.left;
            const top = rect.top - scopeRect.top;
            const right = rect.right - scopeRect.left;
            const bottom = rect.bottom - scopeRect.top;

            targetCornerPositionsRef.current = [
                { x: left - borderWidth, y: top - borderWidth },
                { x: right + borderWidth - cornerSize, y: top - borderWidth },
                { x: right + borderWidth - cornerSize, y: bottom + borderWidth - cornerSize },
                { x: left - borderWidth, y: bottom + borderWidth - cornerSize }
            ];
        };

        const scrollHandler = () => {
            if (!activeTarget || !cursorRef.current) return;

            const scopeRect = scope.getBoundingClientRect();
            const mouseX = scopeRect.left + gsap.getProperty(cursorRef.current, 'x');
            const mouseY = scopeRect.top + gsap.getProperty(cursorRef.current, 'y');

            const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
            const isStillOverTarget =
                elementUnderMouse &&
                (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);

            if (!isStillOverTarget) {
                if (currentLeaveHandler) currentLeaveHandler();
                return;
            }

            updateActiveTargetCorners();
        };

        const mouseDownHandler = () => {
            if (!dotRef.current) return;
            gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
            gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
        };

        const mouseUpHandler = () => {
            if (!dotRef.current) return;
            gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
            gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
        };

        const enterHandler = e => {
            const directTarget = e.target;
            const allTargets = [];
            let current = directTarget;

            while (current && current !== scope) {
                if (current.matches && current.matches(targetSelector)) {
                    allTargets.push(current);
                }
                current = current.parentElement;
            }

            const target = allTargets[0] || null;
            if (!target || !cursorRef.current || !cornersRef.current) return;
            if (activeTarget === target) return;

            if (activeTarget) cleanupTarget(activeTarget);
            if (resumeTimeout) {
                clearTimeout(resumeTimeout);
                resumeTimeout = null;
            }

            activeTarget = target;

            const corners = Array.from(cornersRef.current);
            corners.forEach(corner => gsap.killTweensOf(corner));

            gsap.killTweensOf(cursorRef.current, 'rotation');
            spinTl.current?.pause();
            gsap.set(cursorRef.current, { rotation: 0 });

            const scopeRect = scope.getBoundingClientRect();
            const rect = target.getBoundingClientRect();
            const { borderWidth, cornerSize } = constants;

            const left = rect.left - scopeRect.left;
            const top = rect.top - scopeRect.top;
            const right = rect.right - scopeRect.left;
            const bottom = rect.bottom - scopeRect.top;

            const cursorX = gsap.getProperty(cursorRef.current, 'x');
            const cursorY = gsap.getProperty(cursorRef.current, 'y');

            targetCornerPositionsRef.current = [
                { x: left - borderWidth, y: top - borderWidth },
                { x: right + borderWidth - cornerSize, y: top - borderWidth },
                { x: right + borderWidth - cornerSize, y: bottom + borderWidth - cornerSize },
                { x: left - borderWidth, y: bottom + borderWidth - cornerSize }
            ];

            gsap.ticker.add(tickerFnRef.current);

            gsap.to(activeStrengthRef, {
                current: 1,
                duration: hoverDuration,
                ease: 'power2.out'
            });

            corners.forEach((corner, i) => {
                gsap.to(corner, {
                    x: targetCornerPositionsRef.current[i].x - cursorX,
                    y: targetCornerPositionsRef.current[i].y - cursorY,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });

            const leaveHandler = () => {
                gsap.ticker.remove(tickerFnRef.current);

                targetCornerPositionsRef.current = null;
                gsap.set(activeStrengthRef, { current: 0, overwrite: true });

                const prevTarget = activeTarget;
                activeTarget = null;

                if (cornersRef.current) {
                    const corners2 = Array.from(cornersRef.current);
                    gsap.killTweensOf(corners2);

                    const { cornerSize: cs } = constants;
                    const positions = [
                        { x: -cs * 1.5, y: -cs * 1.5 },
                        { x: cs * 0.5, y: -cs * 1.5 },
                        { x: cs * 0.5, y: cs * 0.5 },
                        { x: -cs * 1.5, y: cs * 0.5 }
                    ];

                    const tl = gsap.timeline();
                    corners2.forEach((corner, index) => {
                        tl.to(
                            corner,
                            { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: 'power3.out' },
                            0
                        );
                    });
                }

                resumeTimeout = setTimeout(() => {
                    if (!activeTarget && cursorRef.current && spinTl.current) {
                        const currentRotation = gsap.getProperty(cursorRef.current, 'rotation');
                        const normalizedRotation = currentRotation % 360;

                        spinTl.current.kill();
                        spinTl.current = gsap
                            .timeline({ repeat: -1 })
                            .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });

                        gsap.to(cursorRef.current, {
                            rotation: normalizedRotation + 360,
                            duration: spinDuration * (1 - normalizedRotation / 360),
                            ease: 'none',
                            onComplete: () => {
                                spinTl.current?.restart();
                            }
                        });
                    }
                    resumeTimeout = null;
                }, 50);

                if (prevTarget) cleanupTarget(prevTarget);
            };

            currentLeaveHandler = leaveHandler;
            target.addEventListener('mouseleave', leaveHandler);
        };

        scope.addEventListener('mouseenter', enterScope);
        scope.addEventListener('mouseleave', leaveScope);
        scope.addEventListener('mousemove', moveHandler);
        scope.addEventListener('mouseover', enterHandler);
        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', updateActiveTargetCorners, { passive: true });
        scope.addEventListener('mousedown', mouseDownHandler);
        scope.addEventListener('mouseup', mouseUpHandler);

        return () => {
            if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);

            scope.removeEventListener('mouseenter', enterScope);
            scope.removeEventListener('mouseleave', leaveScope);
            scope.removeEventListener('mousemove', moveHandler);
            scope.removeEventListener('mouseover', enterHandler);
            window.removeEventListener('scroll', scrollHandler);
            window.removeEventListener('resize', updateActiveTargetCorners);
            scope.removeEventListener('mousedown', mouseDownHandler);
            scope.removeEventListener('mouseup', mouseUpHandler);

            if (activeTarget) cleanupTarget(activeTarget);

            spinTl.current?.kill();
            scope.style.cursor = originalScopeCursor;

            targetCornerPositionsRef.current = null;
            activeStrengthRef.current = 0;
        };
    }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

    useEffect(() => {
        if (isMobile || !cursorRef.current || !spinTl.current) return;
        if (spinTl.current.isActive()) {
            spinTl.current.kill();
            spinTl.current = gsap
                .timeline({ repeat: -1 })
                .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
        }
    }, [spinDuration, isMobile]);

    if (isMobile) return null;

    return (
        <div ref={cursorRef} className="target-cursor-wrapper">
            <div ref={dotRef} className="target-cursor-dot" />
            <div className="target-cursor-corner corner-tl" />
            <div className="target-cursor-corner corner-tr" />
            <div className="target-cursor-corner corner-br" />
            <div className="target-cursor-corner corner-bl" />
        </div>
    );
};

export default TargetCursor;
