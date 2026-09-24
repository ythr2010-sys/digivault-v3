// DigiVault shared UI enhancements
import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const STYLE = `
#dvNotificationBell{
  position:fixed; top:18px; right:18px; z-index:10000;
  width:46px; height:46px; display:flex; align-items:center; justify-content:center;
  border-radius:50%; text-decoration:none; font-size:22px;
  background:rgba(20,20,36,.94); color:#fff;
  border:1px solid rgba(0,210,255,.35);
  box-shadow:0 8px 24px rgba(0,0,0,.35);
  backdrop-filter:blur(8px);
}
#dvNotificationBell:hover{transform:translateY(-1px);border-color:#00d2ff}
#dvNotificationBadge{
  position:absolute; top:-5px; left:-5px; min-width:20px; height:20px;
  padding:0 5px; border-radius:999px; display:none; align-items:center;
  justify-content:center; background:#ff4757; color:#fff; font:700 11px/20px Arial,sans-serif;
  border:2px solid #0a0a12;
}
@media(max-width:768px){
  #dvNotificationBell{top:10px;right:10px;width:42px;height:42px;font-size:20px}
}
`;

function addBell() {
  if (document.getElementById("dvNotificationBell")) return;
  const style = document.createElement("style");
  style.textContent = STYLE;
  document.head.appendChild(style);

  const a = document.createElement("a");
  a.id = "dvNotificationBell";
  a.href = "notifications.html";
  a.setAttribute("aria-label", "الإشعارات");
  a.title = "الإشعارات";
  a.innerHTML = '🔔<span id="dvNotificationBadge">0</span>';
  document.body.appendChild(a);
}

async function refreshUnread(user) {
  const badge = document.getElementById("dvNotificationBadge");
  if (!badge) return;
  if (!user?.email) {
    badge.style.display = "none";
    return;
  }

  try {
    const q = query(collection(db, "notifications"), where("userEmail", "==", user.email));
    const snap = await getDocs(q);
    let unread = 0;
    snap.forEach(d => { if (d.data()?.read !== true) unread++; });

    if (unread > 0) {
      badge.textContent = unread > 99 ? "99+" : String(unread);
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  } catch (err) {
    badge.style.display = "none";
  }
}

addBell();

onAuthStateChanged(auth, user => {
  refreshUnread(user);
  setInterval(() => refreshUnread(auth.currentUser), 30000);
});