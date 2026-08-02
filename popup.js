const STORE_KEY = "recahoStore";

const input = document.getElementById("store-input");
const saveBtn = document.getElementById("save-btn");
const status = document.getElementById("status");

async function load() {
  const { [STORE_KEY]: storeName } = await chrome.storage.sync.get(STORE_KEY);
  input.value = storeName || "";
}

async function save() {
  const value = input.value.trim();
  await chrome.storage.sync.set({ [STORE_KEY]: value });

  status.textContent = "Saved";
  setTimeout(() => { status.textContent = ""; }, 1500);
}

saveBtn.addEventListener("click", save);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") save();
});

load();
