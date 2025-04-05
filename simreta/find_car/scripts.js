document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const subTabButtons = document.querySelectorAll(".sub-tab");
    const subTabContents = document.querySelectorAll(".sub-tab-content");

    // Main Tab Switching
    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            tabContents.forEach(content => content.classList.remove("active"));

            const tabID = this.getAttribute("data-tab");
            document.getElementById(tabID).classList.add("active");
        });
    });

    // Sub-Tab Switching Inside "Book"
    subTabButtons.forEach(button => {
        button.addEventListener("click", function () {
            subTabButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            subTabContents.forEach(content => content.classList.remove("active"));

            const subTabID = this.getAttribute("data-subtab");
            document.getElementById(subTabID).classList.add("active");
        });
    });
});
