document.addEventListener("DOMContentLoaded", function () {
    let interactionLogs = [];

    // 监听点击事件
    document.addEventListener("click", function (event) {
        logInteraction("click", event);
    });

    // 监听输入事件
    document.addEventListener("input", function (event) {
        logInteraction("input", event);
    });

    // 监听输入框失焦事件（确保记录最终内容）
    document.addEventListener("change", function (event) {
        logInteraction("input-final", event);
    });

    function logInteraction(type, event) {
        const interaction = {
            type: type,
            x: event.clientX || null,  // 对于 `input` 事件，`clientX` 可能是 `undefined`
            y: event.clientY || null,
            target: getElementDetails(event.target),
            value: type.includes("input") ? event.target.value : null, // 仅对输入框记录 value
            timestamp: new Date().toISOString(),
        };

        // 存入日志数组
        interactionLogs.push(interaction);

        // 存储日志到 localStorage
        localStorage.setItem("interactionLogs", JSON.stringify(interactionLogs));

        console.log(interaction); // 仅用于调试
    }

    function getElementDetails(element) {
        let details = element.tagName.toLowerCase();
        if (element.id) details += `#${element.id}`;
        if (element.className) details += `.${element.className.replace(/\s+/g, '.')}`;
        if (element.name) details += `[name="${element.name}"]`;
        return details;
    }

    // 当用户关闭页面时，触发日志下载
    window.addEventListener("beforeunload", function () {
        if (interactionLogs.length > 0) {
            downloadLogAsJSON(interactionLogs);
        }
    });

    function downloadLogAsJSON(data) {
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(jsonBlob);
        link.download = "activity_log.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
