(function LocalFilesFix() {
    if (!Spicetify.Player || !Spicetify.Platform) {
        setTimeout(LocalFilesFix, 100);
        return;
    }

    const SEEK_FORWARD_MS = 10000;
    const SEEK_BACK_MS = 1000;
    const SEEK_DELAY_MS = 300;
    const SONGCHANGE_DELAY_MS = 600;
    const STALL_CHECK_INTERVAL_MS = 1500;
    const STALL_THRESHOLD_MS = 500;
    const MAX_STALL_FIXES = 3;

    let stallFixCount = 0;
    let lastTrackUri = null;
    let stallCheckTimer = null;
    let isFixing = false;

    function isLocalTrack(uri) {
        return uri && uri.startsWith("spotify:local:");
    }

    function getCurrentTrackUri() {
        return Spicetify.Player.data?.item?.uri;
    }

    function applySeekFix() {
        if (isFixing) return;
        isFixing = true;

        const previousVolume = Spicetify.Player.getVolume();
        Spicetify.Player.setVolume(0);

        const duration = Spicetify.Player.getDuration();
        const seekTarget = Math.min(SEEK_FORWARD_MS, duration * 0.5);

        Spicetify.Player.seek(seekTarget);

        setTimeout(() => {
            Spicetify.Player.seek(SEEK_BACK_MS);

            setTimeout(() => {
                Spicetify.Player.setVolume(previousVolume);
                isFixing = false;
                console.log("[LocalFilesFix] Applied seek fix");
            }, 150);
        }, SEEK_DELAY_MS);
    }

    function startStallDetection() {
        stopStallDetection();
        stallFixCount = 0;

        stallCheckTimer = setInterval(() => {
            const uri = getCurrentTrackUri();
            if (!isLocalTrack(uri)) {
                stopStallDetection();
                return;
            }

            const progress = Spicetify.Player.getProgress();
            const isPaused = Spicetify.Player.data?.isPaused;

            if (!isPaused && progress < STALL_THRESHOLD_MS && stallFixCount < MAX_STALL_FIXES) {
                stallFixCount++;
                console.log(`[LocalFilesFix] Stall detected (attempt ${stallFixCount}/${MAX_STALL_FIXES}), fixing...`);
                applySeekFix();
            }

            if (progress >= STALL_THRESHOLD_MS) {
                stallFixCount = 0;
            }
        }, STALL_CHECK_INTERVAL_MS);
    }

    function stopStallDetection() {
        if (stallCheckTimer) {
            clearInterval(stallCheckTimer);
            stallCheckTimer = null;
        }
    }

    Spicetify.Player.addEventListener("songchange", () => {
        const uri = getCurrentTrackUri();

        if (uri === lastTrackUri) return;
        lastTrackUri = uri;

        stopStallDetection();

        if (!isLocalTrack(uri)) return;

        console.log("[LocalFilesFix] Local file detected, scheduling seek fix...");

        setTimeout(() => {
            applySeekFix();
            startStallDetection();
        }, SONGCHANGE_DELAY_MS);
    });

    console.log("[LocalFilesFix] Extension loaded");
})();
