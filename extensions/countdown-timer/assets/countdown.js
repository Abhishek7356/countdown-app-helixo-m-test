document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById('app-countdown');
    if (!container) return;

    const shop = container.dataset.shop;
    let endTime = null;
    let startTime = null;
    let timer = null;

    try {
        const res = await fetch(
            `https://d684-2409-40f3-f-13ba-4095-ca7-8b54-a882.ngrok-free.app/storefront/active/${shop}`,
            {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                },
            }
        );

        const data = await res.json();
        if (!data.success || !data.countdown) return;

        timer = data.countdown;

        startTime = new Date(timer.startAt).getTime();
        endTime = new Date(timer.endAt).getTime();

        const textColor = timer.textColor || '#000000';
        // const bgColor = timer.bgColor || '#ffffff';
        const fontSize = timer.fontSize || '16px';

        // 🔥 SIZE
        let padding = "15px";
        let timerSize = fontSize;

        if (timer.size === "small") {
            padding = "10px";
            // timerSize = "20px";
        }

        if (timer.size === "large") {
            padding = "20px";
            // timerSize = "36px";
        }

        // Container styles
        container.style.cssText += `
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            padding:${padding};
            gap:10px;
            font-family: Helvetica, Arial, sans-serif;
            border-radius:12px;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
            width:300px;
        `;

        function updateTimer() {
            const now = new Date().getTime();

            // 🚀 Not started yet
            if (now < startTime) {
                container.style.display = "none";
                return;
            }

            const distance = endTime - now;

            // ⛔ Expired
            if (distance <= 0) {
                container.style.display = 'none';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((distance / 1000 / 60) % 60);
            const seconds = Math.floor((distance / 1000) % 60);

            // 🔥 URGENCY EFFECT
            let urgencyStyle = "";
            if (timer.urgency === "pulse") {
                urgencyStyle = `
                    animation: pulse 1s infinite;
                `;
            }

            container.innerHTML = `
                <div style="
                    font-size:${fontSize};
                    font-weight:600;
                    text-align:center;
                    color:${textColor};
                    max-width:200px;
                ">
                    ${timer.title || "Limited Time Offer"}
                </div>

                <div style="
                    font-size:${timerSize};
                    font-weight:700;
                    font-family:Helvetica, Arial, sans-serif;
                    color:${textColor};
                    ${urgencyStyle}
                ">
                    ${days}d ${hours}h ${minutes}m ${seconds}s
                </div>
            `;
        }

        // 🔥 Pulse animation
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        updateTimer();
        setInterval(updateTimer, 1000);

    } catch (err) {
        console.error('Countdown error', err);
    }
});
