import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getDatabase, ref, runTransaction } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCrMLfSNOiKR8IrU0d6CkUrMofj4WKoI_c",
  authDomain: "lucky-creations-crochet.firebaseapp.com",
  databaseURL: "https://lucky-creations-crochet-default-rtdb.firebaseio.com/",
  projectId: "lucky-creations-crochet",
  storageBucket: "lucky-creations-crochet.firebasestorage.app",
  messagingSenderId: "527493766952",
  appId: "1:527493766952:web:5dac9fff5448633075ba1d",
  measurementId: "G-YLZF9540JL"
};

window.addEventListener("DOMContentLoaded", () => {
  try {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getDatabase(app);

    // Detects current page
    const path = window.location.pathname;

    // Detects testing in visual studip
    const host = window.location.hostname;

    // Function to avoid writing 3 things again and again: 1) No without-database 2) & 3) No local server/host
    function isValidWhen(path, host) {
      return !path.includes("/without-database")
      && host !== "127.0.0.1"
      && host !== "localhost";
    }

    if (
      (path.endsWith("index.html") || path.endsWith("/complete-catalogue/") || path === "/complete-catalogue")
      && isValidWhen(path, host)
    ) {
        logEvent(analytics, "site_visit", { source: "home_page" });
        runTransaction(ref(db, "crochet_stats/home_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("centerpieces.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "centerpieces_page" });
      runTransaction(ref(db, "crochet_stats/centerpieces_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("coaster-sets.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "coasterSets_page" });
      runTransaction(ref(db, "crochet_stats/coaster_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("doilies.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "doilies_page" });
      runTransaction(ref(db, "crochet_stats/doilies_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("earrings.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "earrings_page" });
      runTransaction(ref(db, "crochet_stats/earrings_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("good-omen.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "goodOmen_page" });
      runTransaction(ref(db, "crochet_stats/good_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("handkerchiefs.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "handkerchiefs_page" });
      runTransaction(ref(db, "crochet_stats/handkerchiefs_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("keychains.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "keychains_page" });
      runTransaction(ref(db, "crochet_stats/keychains_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("mini-bags.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "miniBags_page" });
      runTransaction(ref(db, "crochet_stats/mini_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("phone-pouches.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "phonePouches_page" });
      runTransaction(ref(db, "crochet_stats/phone_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("rakhis.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "rakhis_page" });
      runTransaction(ref(db, "crochet_stats/rakhis_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("scrunchies.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "scrunchies_page" });
      runTransaction(ref(db, "crochet_stats/scrunchies_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("tie-backs.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "tie_page" });
      runTransaction(ref(db, "crochet_stats/tie_visits"), n => (n || 0) + 1);
    }

    else if (path.endsWith("tricolour.html") && isValidWhen(path, host)
    ) {
      logEvent(analytics, "site_visit", { source: "tricolour_page" });
      runTransaction(ref(db, "crochet_stats/tricolour_visits"), n => (n || 0) + 1);
    }

    } catch (e) {
        console.warn("Firebase init error:", e);
      }
});