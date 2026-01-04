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


// ---------------------
// שמירת תאריך תחלה
// ---------------------
document.addEventListener("DOMContentLoaded", () => {
    const savedStart = localStorage.getItem("startDate");
    if (savedStart) {
        document.getElementById("startDate").value = savedStart;
        updateStreakDisplay();
    }

    const savedNotify = localStorage.getItem("notifyTime");
    if (savedNotify) {
        document.getElementById("notifyTime").value = savedNotify;
    }
});

document.getElementById("saveStart").onclick = () => {
    const date = document.getElementById("startDate").value;
    if (date) {
        localStorage.setItem("startDate", date);
        localStorage.removeItem("lastRead"); // איפוס הקריאה היומית
        localStorage.setItem("streak", 0);
        updateStreakDisplay();
    }
};

// ---------------------
// חישוב רצף קבוע
// ---------------------
function updateStreakDisplay() {
    const start = localStorage.getItem("startDate");
    const last = localStorage.getItem("lastRead");

    if (!start) {
        document.getElementById("streak").textContent = "0";
        return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (last !== today) {
        let streak = Number(localStorage.getItem("streak") || 0);
        streak++;
        localStorage.setItem("streak", streak);
        localStorage.setItem("lastRead", today);
    }

    document.getElementById("streak").textContent =
        localStorage.getItem("streak");
}


// ---------------------
// סימון "קראתי היום"
// ---------------------
document.getElementById("markToday").onclick = () => {
    updateStreakDisplay();
};


// ---------------------
// חלון איפוס
// ---------------------
document.getElementById("reset").onclick = () =>
    document.getElementById("confirmBox").classList.remove("hidden");

document.getElementById("noReset").onclick = () =>
    document.getElementById("confirmBox").classList.add("hidden");

document.getElementById("yesReset").onclick = () => {
    localStorage.clear();
    document.getElementById("streak").textContent = "0";
    document.getElementById("confirmBox").classList.add("hidden");
};


// ---------------------
// התראות
// ---------------------
document.getElementById("saveNotify").onclick = async () => {
    const time = document.getElementById("notifyTime").value;
    localStorage.setItem("notifyTime", time);

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        navigator.serviceWorker.register("sw.js");
        alert("ההתראה תופעל בשעה שנבחרה ✔");
    } else {
        alert("הדפדפן חסם התראות ❌");
    }
};


// ---------------------
// בדיקת שעה להתראה
// ---------------------
setInterval(() => {
    const notifyTime = localStorage.getItem("notifyTime");
    if (!notifyTime) return;

    const now = new Date();
    const [h, m] = notifyTime.split(":").map(Number);

    if (now.getHours() === h && now.getMinutes() === m && now.getSeconds() === 0) {
        new Notification("זמן לקרוא מזמור לתודה 🙏");
    }

}, 1000);
