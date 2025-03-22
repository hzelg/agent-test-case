let userActions = [];
    let lastInputValues = {}; // Store final input values

    function logAction(eventType, details) {
        userActions.push({
            event: eventType,
            details: details,
            timestamp: new Date().toISOString()
        });
    }

    function checkInput() {
        let ticketNumber = document.getElementById('ticket-number').value.trim();
        let lastName = document.getElementById('last-name').value.trim();
        let searchBtn = document.getElementById('search-btn');
        searchBtn.disabled = !(ticketNumber && lastName);
    }

    function showPopup(event) {
        event.preventDefault();
        alert("Task complete!");
        logAction("click", { 
            element: "button", 
            id: "search-btn", 
            position: { x: event.clientX, y: event.clientY }
        });
    }

    function downloadLog() {
        if (userActions.length === 0) return; // Don't download if log is empty
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userActions, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "activity_log.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("search-btn").addEventListener("click", showPopup);

        // Listen for clicks, log position
        document.addEventListener("click", (event) => {
            if (event.target.tagName.toLowerCase() !== "input") { // Avoid redundant input logs
                logAction("click", { 
                    element: event.target.tagName, 
                    id: event.target.id || "none", 
                    position: { x: event.clientX, y: event.clientY }
                });
            }
        });

        // Listen for input events, record only the last value
        document.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", (event) => {
                lastInputValues[event.target.id] = event.target.value; // Only store final value
            });
        });

        // When user leaves page, record final input values & trigger download
        window.addEventListener("beforeunload", function () {
            for (const [fieldId, value] of Object.entries(lastInputValues)) {
                logAction("input", { 
                    fieldId: fieldId, 
                    finalValue: value 
                });
            }
            downloadLog();
        });
    });