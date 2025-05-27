// Store timers
// const timers = new Map();

// /**
//  * Capture start time for an element
//  */
// function captureStartTime(id, element) {
//     if (!element) {
//         console.error('Element is required for time tracking');
//         return false;
//     }

//     const timer = {
//         startTime: new Date(),
//         element: element,
//     };

//     timers.set(id, timer);
//     console.log(`Start time captured for ${id}`);
//     return true;
// }

// /**
//  * Capture stop time and calculate total time
//  */
// function captureStopTime(id) {
//     const timer = timers.get(id);
//     if (!timer) {
//         console.error(`No timer found for ${id}`);
//         return 0;
//     }

//     timer.stopTime = new Date();

//     const totalTime = (timer.stopTime - timer.startTime) / 1000;

//     console.log(`Stop time captured for ${id}. Total time: ${totalTime.toFixed(2)} seconds`);

//     return totalTime;
// }


// function trackUserInteractions(id) {
//     const timer = timers.get(id);
//     if (!timer) {
//         console.error(`No timer found for ${id}`);
//         return false;
//     }

//     const updateLastInteraction = (type, data = {}) => {
//         const interactionTime = new Date();

//         timer.lastInteractionTime = interactionTime;
//         timer.interactions.push({
//             type: type,
//             time: interactionTime,
//             ...data
//         });

//         console.log(`[${type}] @ ${interactionTime.toLocaleTimeString()}`, data);
//     };

//     const trackMouseMove = (event) => {
//         updateLastInteraction('mousemove', {
//             x: event.clientX,
//             y: event.clientY
//         });
//     };

//     const trackClick = (event) => {
//         updateLastInteraction('click', {
//             x: event.clientX,
//             y: event.clientY
//         });
//     };

//     const trackKeyboard = (event) => {
//         updateLastInteraction('keyboard', {
//             key: event.key
//         });
//     };

//     const trackScroll = () => {
//         updateLastInteraction('scroll', {
//             scrollY: window.scrollY
//         });
//     };

//     // Use `document` for broader tracking
//     document.addEventListener('mousemove', trackMouseMove);
//     document.addEventListener('click', trackClick);
//     document.addEventListener('keydown', trackKeyboard);
//     window.addEventListener('scroll', trackScroll);

//     timer.eventListeners = {
//         mousemove: trackMouseMove,
//         click: trackClick,
//         keyboard: trackKeyboard,
//         scroll: trackScroll
//     };

//     console.log(`Started tracking all user interactions for modal ${id}`);
//     return true;
// }


// const timers = new Map();
// const SECONDS_PER_PAGE = 45;

// async function getPdfPageCount(url) {
//     try {
//         const loadingTask = pdfjsLib.getDocument(url);
//         const pdf = await loadingTask.promise;
//         return pdf.numPages;
//     } catch (error) {
//         console.error('Error loading PDF:', error);
//         return 0;
//     }
// }

// async function getEstimatedReadingTime(url) {
//     const pages = await getPdfPageCount(url);
//     if (pages === 0) return 0;
//     return pages * SECONDS_PER_PAGE;
// }

// async function captureStartTime(id, element, pdfUrl) {
//     if (!element) {
//         console.error('Element is required for time tracking');
//         return false;
//     }
//     const estimatedTime = await getEstimatedReadingTime(pdfUrl);
//     const timer = {
//         startTime: new Date(),
//         element: element,
//         estimatedReadingTime: estimatedTime,
//     };
//     timers.set(id, timer);
//     console.log(`Start time captured for ${id} with estimated reading time ${estimatedTime} seconds`);
//     return true;
// }

// function captureStopTime(id) {
//     const timer = timers.get(id);
//     if (!timer) {
//         console.error(`No timer found for ${id}`);
//         return 0;
//     }
//     timer.stopTime = new Date();
//     const totalTime = (timer.stopTime - timer.startTime) / 1000;
//     console.log(`Stop time captured for ${id}. Total time: ${totalTime.toFixed(2)} seconds`);
//     if (timer.estimatedReadingTime && totalTime < timer.estimatedReadingTime) {
//         console.warn(`User spent less time (${totalTime.toFixed(2)}s) than estimated reading time (${timer.estimatedReadingTime}s) for ${id}`);
//         // TODO: Show notification to user here if needed
//     }
//     return totalTime;
// }


const timers = new Map();
const SECONDS_PER_PAGE = 45;

// Load PDF and count pages
async function getPdfPageCount(url) {
    try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        return pdf.numPages;
    } catch (error) {
        console.error('Error loading PDF:', error);
        return 0;
    }
}

// Calculate estimated reading time
async function getEstimatedReadingTime(url) {
    const pages = await getPdfPageCount(url);
    if (pages === 0) return 0;
    return pages * SECONDS_PER_PAGE;
}

// Start reading session
async function captureStartTime(id, element, pdfUrl) {
    if (!element) {
        console.error('Element is required for time tracking');
        return false;
    }

    const existingTimer = timers.get(id);
    const estimatedTime = await getEstimatedReadingTime(pdfUrl);

    const timer = {
        startTime: new Date(),
        element: element,
        estimatedReadingTime: estimatedTime,
        pdfUrl: pdfUrl,
        totalTimeSpent: existingTimer?.totalTimeSpent || 0,
    };

    timers.set(id, timer);
    console.log(`Start time for ${id}. Estimated: ${estimatedTime}s`);
    return true;
}

async function captureStopTime(id) {
    const timer = timers.get(id);
    if (!timer) {
        console.error(`No timer found for ${id}`);
        return false;
    }

    timer.stopTime = new Date();
    const sessionTime = (timer.stopTime - timer.startTime) / 1000;
    timer.totalTimeSpent += sessionTime;

    console.log(`Session time: ${sessionTime.toFixed(2)}s. Total: ${timer.totalTimeSpent.toFixed(2)}s`);

    // Return whether reading time is completed
    if (timer.estimatedReadingTime && timer.totalTimeSpent >= timer.estimatedReadingTime) {
        return true;  // Enough time spent
    }
    return false; // Not enough time spent yet
}

async function checkReadingTime(id) {
    const timer = timers.get(id);
    if (!timer || !timer.startTime) return true;

    const now = new Date();
    const sessionTime = (now - timer.startTime) / 1000;
    const totalTime = timer.totalTimeSpent + sessionTime;

    if (timer.estimatedReadingTime && totalTime < timer.estimatedReadingTime) {
        toastr.clear();

        return new Promise((resolve) => {
    toastr.warning(
         `Have you read it properly? <a href="#" id="closeAnyway" style="text-decoration: underline; margin-left: 10px;">Close Anyway</a>`,
                '',
        {
            timeOut: 20000,
            extendedTimeOut: 20000,
            closeButton: true,
            tapToDismiss: false,
            toastClass: 'custom-toast',

            allowHtml: true,
            onShown: function () {
                $('#closeAnyway').off('click').on('click', function (e) {
                    e.preventDefault();
                    toastr.remove(); // Instantly remove the toast
                    resolve(true);
                });
            },
            onHidden: function () {
                resolve(false);
            }
        }
    );
});

    }

    return true;
}


let player = null;
let watchedSecondsSet = new Set();
let minWatchSeconds = 0;
let trackingInterval = null;

function openTrackedVideoModal({ 
    videoUrl, 
    modalId , 
    videoElementId  , 
    closeBtnId ,
    onComplete = null // optional callback after successful watch
}) {
    if (player) {
        player.destroy();
        player = null;
    }

    const $modal = $(`#${modalId}`);
    const $closeBtn = $(`#${closeBtnId}`);
    const videoElement = document.getElementById(videoElementId);

    if (!videoElement) {
        console.error(`Element with ID "${videoElementId}" not found`);
        return;
    }

    videoElement.src = videoUrl;
    videoElement.load();

    watchedSecondsSet = new Set();
    minWatchSeconds = 0;

    player = new Plyr(videoElement, {
        autoplay: true,
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        seekTime: 10,
    });

    player.on('ready', () => {
        const checkDuration = setInterval(() => {
            if (player.duration && player.duration > 0) {
                minWatchSeconds = player.duration;
                console.log('Video duration (seconds):', minWatchSeconds);
                clearInterval(checkDuration);
            }
        }, 200);
    });

    trackingInterval = setInterval(() => {
        if (!player || player.paused) return;

        const currentSecond = Math.floor(player.currentTime);
        watchedSecondsSet.add(currentSecond);

        const watchedCount = watchedSecondsSet.size;
        console.log('Watched Seconds:', watchedCount, 'Second Required:', minWatchSeconds);
    }, 1000);

    $modal.modal({
        backdrop: 'static',
        keyboard: false
    });

    $closeBtn.show();

    $closeBtn.off('click').on('click', function () {
        const watchedCount = watchedSecondsSet.size;

        if (minWatchSeconds > 0 && watchedCount < minWatchSeconds * 0.9) {
            toastr.warning(
                `Have you watched the full video? <a href="#" id="forceClose" style="text-decoration: underline; margin-left: 10px;">Close Anyway</a>`,
                '',
                {
                    allowHtml: true,
                    closeButton: true,
                    timeOut: 10000,
                }
            );

            $(document).off('click', '#forceClose').on('click', '#forceClose', function (e) {
                e.preventDefault();
                closeVideoModal({ modalId, closeBtnId, resetOnly: false });
            });

            return;
        }

        if (typeof onComplete === 'function') {
            onComplete(); // optional callback
        }

        closeVideoModal({ modalId, closeBtnId });
    });

    $modal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
        closeVideoModal({ modalId, closeBtnId });
    });
}

function closeVideoModal({ modalId , closeBtnId , resetOnly = false }) {
    if (!resetOnly) {
        $(`#${modalId}`).modal('hide');
    }

    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
    }

    if (player) {
        player.destroy();
        player = null;
    }

    watchedSecondsSet = new Set();
    minWatchSeconds = 0;

    $(`#${closeBtnId}`).hide();
}
