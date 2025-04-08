// popup.js
console.log("Popup script loaded!");

document.addEventListener("DOMContentLoaded", () => {
  // Grab references to DOM elements
  const jobTitleInput = document.getElementById("jobTitle");
  const locationInput = document.getElementById("location");
  const messageTemplateInput = document.getElementById("messageTemplate");
  const startButton = document.getElementById("startAutomation");
  const stopButton = document.getElementById("stopAutomation");
  const statusDiv = document.getElementById("status");

  // Log if elements are not found
  if (!jobTitleInput || !locationInput || !messageTemplateInput || !startButton || !stopButton || !statusDiv) {
    console.error("One or more DOM elements are missing. Please check your popup.html.");
    return;
  }

  // Load saved settings from Chrome storage
  chrome.storage.sync.get(["jobTitle", "location", "messageTemplate"], (result) => {
    if (result.jobTitle) jobTitleInput.value = result.jobTitle;
    if (result.location) locationInput.value = result.location;
    if (result.messageTemplate) messageTemplateInput.value = result.messageTemplate;
  });

  // Save settings when the Start Automation button is clicked
  startButton.addEventListener("click", () => {
    const jobTitle = jobTitleInput.value;
    const location = locationInput.value;
    const messageTemplate = messageTemplateInput.value;

    if (!jobTitle || !messageTemplate) {
      statusDiv.textContent = "Please fill out required fields.";
      return;
    }

    // Save the settings to Chrome's storage
    chrome.storage.sync.set({ jobTitle, location, messageTemplate }, () => {
      statusDiv.textContent = "Automation started!";

      // Send a message to start automation in background script
      chrome.runtime.sendMessage({ action: "startAutomation" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error in sending message to background script:", chrome.runtime.lastError);
        } else {
          console.log("Background script received the message:", response);
        }
      });
    });
  });

  // Stop automation when the Stop Automation button is clicked
  stopButton.addEventListener("click", () => {
    statusDiv.textContent = "Automation stopped!";

    // Send a message to stop automation in background script
    chrome.runtime.sendMessage({ action: "stopAutomation" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error in sending message to background script:", chrome.runtime.lastError);
      } else {
        console.log("Background script received the message:", response);
      }
    });
  });
});
