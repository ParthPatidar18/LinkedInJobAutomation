// background.js

let isAutomationRunning = false;

// Listen for messages from popup.js (or other scripts)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startAutomation") {
    isAutomationRunning = true;
    console.log("Automation started!!!.....");

    // You can add the job search, connection, or LinkedIn logic here
    // For example: startJobSearch() or startSendingMessages()

    sendResponse({ status: "started" }); // Respond back with a status (optional)
  } else if (request.action === "stopAutomation") {
    isAutomationRunning = false;
    console.log("Automation stopped !!");

    // If you have an ongoing job search or message sending process, stop it here
    // For example: stopJobSearch() or stopSendingMessages()

    sendResponse({ status: "stopped!" }); // Respond back with a status (optional)
  }
});
