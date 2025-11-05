import { PageBlockInterface } from '@/types';
import { useState, useEffect } from 'react';

export default function ImageBlock({ block }: { block: PageBlockInterface }) {
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setIsFullScreen(false);
                }
            };

            document.addEventListener('keydown', handleEscape);

            return () => {
                document.body.style.overflow = '';
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isFullScreen]);

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-border bg-muted/50">
                <img
                    src={`/private/${block.content}`}
                    alt={block.content}
                    className="h-auto w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
                    onClick={() => setIsFullScreen(true)}
                />
            </div>

            {isFullScreen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
                    onClick={() => setIsFullScreen(false)}
                >
                    <div className="relative max-h-full max-w-full">
                        <img
                            src={`/private/${block.content}`}
                            alt={block.content}
                            className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            className="absolute right-4 top-4 rounded-full bg-muted/50 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
                            onClick={() => setIsFullScreen(false)}
                            aria-label="Close fullscreen"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
