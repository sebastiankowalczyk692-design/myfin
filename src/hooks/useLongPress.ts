import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
    onLongPress: (event: React.TouchEvent | React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
    delay?: number;
}

interface UseLongPressResult {
    onTouchStart: (event: React.TouchEvent) => void;
    onTouchEnd: (event: React.TouchEvent) => void;
    onTouchMove: (event: React.TouchEvent) => void;
    onClick: (event: React.MouseEvent) => void;
}

/**
 * Hook to detect long press on touch devices.
 * Returns event handlers to attach to an element.
 */
function useLongPress({
    onLongPress,
    onClick,
    delay = 500
}: UseLongPressOptions): UseLongPressResult {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPressRef = useRef(false);
    const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

    const startPressTimer = useCallback((event: React.TouchEvent) => {
        isLongPressRef.current = false;
        const touch = event.touches[0];
        touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };

        timerRef.current = setTimeout(() => {
            isLongPressRef.current = true;
            onLongPress(event);
        }, delay);
    }, [onLongPress, delay]);

    const clearPressTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const handleTouchStart = useCallback((event: React.TouchEvent) => {
        startPressTimer(event);
    }, [startPressTimer]);

    const handleTouchEnd = useCallback((event: React.TouchEvent) => {
        clearPressTimer();
        // Prevent click if long press was triggered
        if (isLongPressRef.current) {
            event.preventDefault();
        }
    }, [clearPressTimer]);

    const handleTouchMove = useCallback((event: React.TouchEvent) => {
        // Cancel long press if finger moves more than 10px
        if (touchStartPosRef.current) {
            const touch = event.touches[0];
            const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x);
            const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y);
            if (deltaX > 10 || deltaY > 10) {
                clearPressTimer();
            }
        }
    }, [clearPressTimer]);

    const handleClick = useCallback((event: React.MouseEvent) => {
        // Only fire click if it wasn't a long press
        if (!isLongPressRef.current && onClick) {
            onClick(event);
        }
        isLongPressRef.current = false;
    }, [onClick]);

    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onTouchMove: handleTouchMove,
        onClick: handleClick
    };
}

export default useLongPress;

