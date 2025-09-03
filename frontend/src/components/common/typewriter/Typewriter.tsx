import { useState, useEffect, useRef } from 'react';
import './Typewriter.css';

export default function Typewriter({
    texts,
    speed = 150,
}: {
    texts: string[];
    speed?: number;
}) {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<number>(0);

    useEffect(() => {
        const handleType = () => {
            const currentText = texts[currentIndex];

            if (!isDeleting) {
                if (text.length < currentText.length) {
                    setText(currentText.substring(0, text.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 1000);
                    return;
                }
            } else {
                if (text.length > 0) {
                    setText(currentText.substring(0, text.length - 1));
                } else {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                    return;
                }
            }

            timerRef.current = setTimeout(
                handleType,
                isDeleting ? speed / 2 : speed
            );
        };

        timerRef.current = setTimeout(handleType, speed);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [text, isDeleting, currentIndex, texts, speed]);

    return (
        <>
            <span>{text}</span>
            <span className="cursor">|</span>
        </>
    );
}
