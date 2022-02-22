let Popup = {
  $dom: {
    changeColor: $("#changeColor"),
  },
  init() {
    chrome.storage.sync.get("color", ({ color }) => {
      this.$dom.changeColor.css("backgroundColor", color);
    });

    // When the button is clicked, inject setPageBackgroundColor into current page
    this.$dom.changeColor.on("click", async () => {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
      });
    });

    // The body of this function will be executed as a content script inside the
    // current page
    function setPageBackgroundColor() {
      chrome.storage.sync.get("color", ({ color }) => {
        document.body.style.backgroundColor = color;
      });
    }
  },
};

Popup.init();
