document.addEventListener('DOMContentLoaded', function() {
    // Initialize user activity log
    let activityLog = [];
    const startTime = new Date();
    
    // Log page load event
    logActivity('page_load', { timestamp: startTime });
    
    // Track all clicks on the page
    document.addEventListener('click', function(e) {
        const target = e.target;
        const elementType = target.tagName.toLowerCase();
        const elementId = target.id || '';
        const elementClass = target.className || '';
        const elementText = target.textContent || '';
        
        logActivity('click', {
            elementType,
            elementId,
            elementClass,
            elementText: elementText.substring(0, 50), // Limit text length
            x: e.clientX,
            y: e.clientY
        });
    });
    
    // Track all input events on email field
    const emailInput = document.querySelector('.results-email-input');
    if (emailInput) {
        emailInput.addEventListener('input', function(e) {
            logActivity('input', {
                elementType: 'input',
                elementId: this.id,
                fieldType: 'email'
            });
        });
        
        emailInput.addEventListener('focus', function() {
            logActivity('focus', {
                elementType: 'input',
                elementId: this.id,
                fieldType: 'email'
            });
        });
        
        emailInput.addEventListener('blur', function() {
            logActivity('blur', {
                elementType: 'input',
                elementId: this.id,
                fieldType: 'email'
            });
        });
    }
    
    // Results section toggle functionality
    const toggleButton = document.getElementById('toggleResults');
    const sendResultsContent = document.getElementById('sendResultsContent');
    
    if (toggleButton && sendResultsContent) {
        toggleButton.addEventListener('click', function() {
            const isExpanded = toggleButton.textContent === '−';
            
            if (isExpanded) {
                // Collapse
                sendResultsContent.style.display = 'none';
                toggleButton.textContent = '+';
                logActivity('collapse_results_section', {});
            } else {
                // Expand
                sendResultsContent.style.display = 'block';
                toggleButton.textContent = '−';
                logActivity('expand_results_section', {});
            }
        });
    }
    
    // Preference tag removal
    const removeTag = document.querySelector('.remove-tag');
    const goalTag = document.getElementById('goal-tag');
    
    if (removeTag && goalTag) {
        removeTag.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the click from being registered on parent elements
            goalTag.style.display = 'none';
            logActivity('remove_preference_tag', {
                tagText: document.getElementById('goal-text').textContent
            });
        });
    }
    
    // Results email form submission
    const resultsEmailForm = document.getElementById('results-email-form');
    
    if (resultsEmailForm) {
        resultsEmailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailValue = emailInput.value.trim();
            logActivity('form_submit_attempt', { emailProvided: !!emailValue });
            
            if (!emailValue) {
                showEmailError('Please enter your email address');
                logActivity('validation_error', { field: 'email', error: 'required' });
                return;
            }
            
            if (!isValidEmail(emailValue)) {
                showEmailError('Please enter a valid email address');
                logActivity('validation_error', { field: 'email', error: 'invalid_format' });
                return;
            }
            
            // Log successful form validation
            logActivity('form_validation_success', {});
            
            // Calculate total time spent on page
            const endTime = new Date();
            const timeSpentMs = endTime - startTime;
            logActivity('form_submit_success', {
                timeSpentMs: timeSpentMs,
                timeSpentSeconds: Math.round(timeSpentMs / 1000)
            });
            
            // Show success popup
            showSuccessPopup(() => {
                // Download activity log as JSON
                downloadActivityLog();
                
                // Close the window after a short delay
                setTimeout(() => {
                    window.close();
                }, 1000);
            });
        });
    }
    
    // Read More button functionality
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const dietName = this.closest('.diet-result-item').querySelector('.diet-name').textContent;
            logActivity('read_more_click', { dietName });
            alert(`You clicked to learn more about ${dietName}. This would typically open a detailed page.`);
        });
    });
    
    // Helper function to show email validation error
    function showEmailError(message) {
        emailInput.classList.add('error');
        
        // Create or update error message
        let errorMessage = emailInput.parentElement.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            resultsEmailForm.insertBefore(errorMessage, emailInput.nextSibling);
        }
        errorMessage.textContent = message;
        
        // Remove error when user starts typing again
        emailInput.addEventListener('input', function() {
            emailInput.classList.remove('error');
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        }, { once: true });
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to log user activity
    function logActivity(action, data) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            action,
            ...data
        };
        
        activityLog.push(logEntry);
        console.log('Activity logged:', logEntry);
    }
    
    // Helper function to download activity log as JSON
    function downloadActivityLog() {
        // Create final activity log object
        const finalLog = {
            sessionId: generateSessionId(),
            userAgent: navigator.userAgent,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            activities: activityLog
        };
        
        // Convert to JSON string
        const jsonString = JSON.stringify(finalLog, null, 2);
        
        // Create a blob with the JSON data
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'activity.json';
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // Helper function to generate a session ID
    function generateSessionId() {
        return 'session_' + Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
    
    // Helper function to show a success popup
    function showSuccessPopup(callback) {
        // Create overlay div
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        
        // Create popup content
        const popup = document.createElement('div');
        popup.className = 'success-popup';
        
        // Success icon
        const icon = document.createElement('div');
        icon.className = 'success-icon';
        icon.innerHTML = '✓';
        
        // Success message
        const title = document.createElement('h3');
        title.className = 'success-title';
        title.textContent = 'Results Sent Successfully!';
        
        // Thank you message
        const message = document.createElement('p');
        message.className = 'success-message';
        message.textContent = 'Thank you for your interest in our diet recommendations. Check your email soon for more information.';
        
        // Note about download and closing
        const note = document.createElement('p');
        note.className = 'success-note';
        note.textContent = 'This window will close automatically. Your activity log is being downloaded.';
        
        // Assemble popup
        popup.appendChild(icon);
        popup.appendChild(title);
        popup.appendChild(message);
        popup.appendChild(note);
        
        // Add popup to overlay
        overlay.appendChild(popup);
        
        // Add overlay to body
        document.body.appendChild(overlay);
        
        // Log popup display
        logActivity('success_popup_shown', {});
        
        // Execute callback after 2 seconds
        setTimeout(() => {
            if (typeof callback === 'function') {
                callback();
            }
        }, 2000);
    }
});