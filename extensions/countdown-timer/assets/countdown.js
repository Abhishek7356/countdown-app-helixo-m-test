document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById('app-countdown');
    if (!container) return;

    const shop = container.dataset.shop;
    let endTime = null;
    let startTime = null;
    let timer = null;

    try {
        const res = await fetch(
            `https://a847-2409-40f3-2a-c284-f43f-93b-e297-3b62.ngrok-free.app/storefront/active/${shop}`,
            { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );

        const data = await res.json();
        if (!data.success || !data.countdown) return;

        timer = data.countdown;
        startTime = new Date(timer.startAt).getTime();
        endTime = new Date(timer.endAt).getTime();

        const textColor = timer.textColor || '#000000';
        const bgColor = timer.bgColor || '#ffffff';
        const pulseColor = timer.pulseColor || '#ff6b6b'; // Add pulse color
        const position = timer.position || "bottom";

        let padding = "12px";
        let timerSize = "21px";
        let titleSize = "13px";

        if (timer.size === "small") {
            padding = "7px";
            timerSize = "13px";
            titleSize = "9px";
        }
        else if (timer.size === "large") {
            padding = "17px";
            timerSize = "29px";
            titleSize = "17px";
        }

        container.style.cssText = `
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            padding:${padding};
            background-color:${bgColor};
            gap:10px;
            font-family: Helvetica, Arial, sans-serif;
            border-radius:12px;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
                        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
            width:95%;
            text-align:center;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        `;

        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes slideBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }

            @keyframes cardPulse {
                0%, 100% { 
                    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
                                rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
                    transform: scale(1);
                    background-color: ${bgColor};
                }
                50% { 
                    box-shadow: ${hexToRgba(pulseColor, 0.6)} 0px 4px 16px 0px,
                                ${hexToRgba(pulseColor, 0.4)} 0px 2px 8px 0px;
                    transform: scale(1.03);
                    background-color: ${pulseColor};
                }
            }

            .countdown-banner {
                animation: slideBounce 0.8s ease-in-out infinite;
            }

            .countdown-pulse {
                animation: cardPulse 1s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);

        // Helper function to convert hex to rgba
        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        function updateTimer() {
            const now = new Date().getTime();

            if (now < startTime) {
                container.style.display = "none";
                return;
            }

            const distance = endTime - now;

            if (distance <= 0) {
                container.style.display = 'none';
                return;
            }

            container.style.display = "flex";

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((distance / 1000 / 60) % 60);
            const seconds = Math.floor((distance / 1000) % 60);

            const titleHTML = `
                <div style="
                    font-size:${titleSize};
                    font-weight:600;
                    color:${textColor};
                    max-width:250px;
                ">
                    ${timer.title || "Limited Time Offer"}
                </div>
            `;

            const timerHTML = `
                <div style="
                    font-size:${timerSize};
                    color:${textColor};
                    letter-spacing:1px;
                ">
                    ${days}d ${hours}h ${minutes}m ${seconds}s
                </div>
            `;

            if (position === "top") {
                container.innerHTML = timerHTML + titleHTML;
            } else {
                container.innerHTML = titleHTML + timerHTML;
            }

            if (distance <= 5 * 60 * 1000) {
                if (timer.urgency === "banner") {
                    container.classList.add('countdown-banner');
                }
                else if (timer.urgency === "pulse") {
                    container.classList.add('countdown-pulse');
                }
            } else {
                container.classList.remove('countdown-banner', 'countdown-pulse');
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);

    } catch (err) {
        console.error('Countdown error', err);
    }
});