// --- תאריך עברי + לועזי + שעה ---
function updateDateBar() {
    const now = new Date();

    const greg = now.toLocaleDateString("he-IL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const hebrew = new Intl.DateTimeFormat("he-u-ca-hebrew", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }).format(now);

    const time = now.toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    document.getElementById("dateBar").innerHTML =
        `${greg} | ${hebrew} | ${time}`;
}
setInterval(updateDateBar, 1000);
updateDateBar();


// --- שמירת תאריך התחלה ---
document.getElementById("saveStart").onclick = () => {
    const date = document.getElementById("startDate").value;
    if (date) {
        localStorage.setItem("startDate", date);
        calculateStreak();
    }
};


// --- חישוב רצף ---
function calculateStreak() {
    const start = localStorage.getItem("startDate");
    const last = localStorage.getItem("lastRead");

    if (!start) return;

    const today = new Date().toDateString();
    const lastDate = last ? new Date(last).toDateString() : null;

    let streak = Number(localStorage.getItem("streak") || 0);

    if (lastDate !== today) {
        streak++;
        localStorage.setItem("lastRead", today);
        localStorage.setItem("streak", streak);
    }

    document.getElementById("streak").textContent = streak;
}


// --- סימון שקראתי היום ---
document.getElementById("markToday").onclick = () => {
    calculateStreak();
};


// --- איפוס ---
document.getElementById("reset").onclick = () => {
    document.getElementById("confirmBox").classList.remove("hidden");
};

document.getElementById("noReset").onclick = () =>
    document.getElementById("confirmBox").classList.add("hidden");

document.getElementById("yesReset").onclick = () => {
    localStorage.removeItem("startDate");
    localStorage.removeItem("lastRead");
    localStorage.removeItem("streak");
    document.getElementById("streak").textContent = "0";
    document.getElementById("confirmBox").classList.add("hidden");
};


// --- התראות PUSH ---
document.getElementById("saveNotify").onclick = async () => {
    const time = document.getElementById("notifyTime").value;
    localStorage.setItem("notifyTime", time);

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        navigator.serviceWorker.register("sw.js");
        alert("ההתראה הופעלה!");
    }
};

// בדיקה כל 30 שניות אם הגענו לשעה שנקבעה
setInterval(() => {
    const time = localStorage.getItem("notifyTime");
    if (!time) return;

    const [h, m] = time.split(":").map(Number);
    const now = new Date();

    if (now.getHours() === h && now.getMinutes() === m) {
        new Notification("זמן להגיד מזמור לתודה 🙏");
    }
}, 30000);
