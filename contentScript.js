// contentScript.js

// Function to start job automation after retrieving data
function startAutomationWithSettings() {
    // Get job search preferences from local storage (set by the user in the popup)
    chrome.storage.sync.get(["jobTitle", "location", "messageTemplate"], (result) => {
        const { jobTitle, location, messageTemplate } = result;

        // If no job title or message template is provided, stop the script
        if (!jobTitle || !messageTemplate) {
            console.log("Job title or message template is missing. Exiting script.");
            return;
        }

        // Log automation start information
        console.log(`Starting job search automation for: ${jobTitle} in ${location}`);
        //add by me
        chrome.webRequest.onBeforeRequest.addListener(
            (details) => {
              // Handle request here (e.g., block or modify)
              return { cancel: true }; // Prevent the request
            },
            { urls: ["*://www.googleadservices.com/*"] },
            ["blocking"]
          );
          
      // Create a MutationObserver to listen for DOM changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
            console.log("A child node has been added or removed.");
            // You can add additional logic here, e.g., check for specific nodes
        }
    });
});

// Start observing the document body for changes to child nodes
observer.observe(document.body, { childList: true, subtree: true });

        // Function to simulate job search on LinkedIn
        function searchJobs() {
            console.log("Searching for jobs...");
            const jobSearchInput = document.querySelector("input[aria-label='Search jobs']");
            if (jobSearchInput) {
                jobSearchInput.value = jobTitle;  // Set job title

                const locationInput = document.querySelector("input[aria-label='Search location']");
                if (locationInput && location) {
                    locationInput.value = location;  // Set location if provided
                }

                const searchButton = document.querySelector("button[aria-label='Search']");
                if (searchButton) {
                    searchButton.click();  // Trigger the search button
                    console.log("Job search started!");
                } else {
                    console.log("Search button not found.");
                }
            } else {
                console.log("Job search input not found.");
            }
        }

        // Function to send connection requests
        function sendConnectionRequest() {
            console.log("Sending connection requests...");
            const connectButtons = document.querySelectorAll('button[aria-label="Connect"]');
            connectButtons.forEach((button, index) => {
                setTimeout(() => {
                    button.click();
                    console.log(`Connection request sent to user #${index + 1}`);
                    
                    // Optionally send a message with the connection request
                    const sendMessageButton = document.querySelector('button[aria-label="Add a note"]');
                    if (sendMessageButton) {
                        sendMessageButton.click();
                        const messageTextArea = document.querySelector('textarea[name="message"]');
                        if (messageTextArea) {
                            messageTextArea.value = messageTemplate;  // Set the message template
                            const sendMessage = document.querySelector('button[aria-label="Send invitation"]');
                            if (sendMessage) {
                                sendMessage.click();
                                console.log(`Message sent: ${messageTemplate}`);
                            }
                        } else {
                            console.log("Message textarea not found.");
                        }
                    } else {
                        console.log("Send message button not found.");
                    }
                }, index * 2000); // Add delay between requests
            });
        }

        // Function to start the automation (job search and sending connection requests)
        function startAutomation() {
            searchJobs();
            setTimeout(() => {
                sendConnectionRequest();
            }, 5000); // Start sending connection requests after 5 seconds
        }

        // Run the startAutomation function
        startAutomation();
    });
}

// Listen for start/stop messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startAutomation" && !window.automationStarted) {
        window.automationStarted = true;
        startAutomationWithSettings();
        sendResponse({ status: "started" });
    } else if (request.action === "stopAutomation") {
        window.automationStarted = false;
        console.log("Automation stopped.");
        sendResponse({ status: "stopped" });
    }
});
