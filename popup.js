
document.getElementById("fill").addEventListener("click", async () => {
  const text = document.getElementById("input").value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: injectFill,
    args: [text]
  });
});

function injectFill(text) {
  window.postMessage({
    type: "RECAHO_AUTOFILL",
    text
  }, "*");
}

// Find the form
const form = document.getElementById("bookingForm");
if (form) {
  // Create a new button
  const btn = document.createElement("button");
  btn.type = "button"; // important, so it doesn't submit the form
  btn.innerText = "Fill from Text";
  btn.style = `
    margin-left: 10px;
    background-color: #32B4F1;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
  `;

  // Add click handler
  btn.addEventListener("click", async () => {
    const text = prompt("Paste the order text here:");
    if (!text) return;

    // Call your form-filler function
    fillFormOnPage(text);
  });

  // Append the button to the form
  form.appendChild(btn);
}
