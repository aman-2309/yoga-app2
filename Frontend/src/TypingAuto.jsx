import React, { useEffect, useState } from "react";

export default function TypingAuto({ text, speed = 15 }) {
    const [visible, setVisible] = useState("");

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setVisible(text.slice(0, i));
            i++;
            if (i > text.length) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <span className="whitespace-pre-line">
            {visible}
        </span>
    );
}
