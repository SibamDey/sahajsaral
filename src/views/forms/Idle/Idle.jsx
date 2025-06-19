import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


const Idle = () => {
    const navigate = useNavigate();
    const timeoutRef = useRef(null);

    // Time (in ms) before redirect: 10 minutes = 600000
    const IDLE_TIMEOUT = 10 * 60 * 1000;

    const resetTimer = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            console.log("User is idle for 10 minutes. Redirecting...");
            navigate("/session-timeout"); // 🔁 Change to your redirect path
        }, IDLE_TIMEOUT);
    };

    useEffect(() => {
        // Events to track user activity
        const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

        // Attach listeners
        events.forEach(event => window.addEventListener(event, resetTimer));

        // Start timer
        resetTimer();

        return () => {
            <ToastContainer />;
            // Clean up on unmount
            events.forEach(event => window.removeEventListener(event, resetTimer));
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return null; // This can be a wrapper component or just part of App
};

export default Idle;
