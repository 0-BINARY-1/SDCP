(function () {
  "use strict";

  // ----- Elements -----
  const viewLanding = document.getElementById("view-landing");
  const viewUpload = document.getElementById("view-upload");
  const viewThanks = document.getElementById("view-thanks");

  const sectionGrid = document.getElementById("section-grid");
  const backBtn = document.getElementById("back-btn");

  const uploadBadge = document.getElementById("upload-badge");
  const thanksBadge = document.getElementById("thanks-badge");

  const fileInput = document.getElementById("file-input");
  const dropzone = document.getElementById("dropzone");
  const dropzoneText = document.getElementById("dropzone-text");

  const chooseBtn = document.getElementById("choose-btn");
  const clearBtn = document.getElementById("clear-btn");
  const submitBtn = document.getElementById("submit-btn");
  const errorMsg = document.getElementById("error-msg");
  const uploadingState = document.getElementById("uploading-state");

  const uploadAnotherBtn = document.getElementById("upload-another-btn");

  let currentSection = null; // e.g. "M13"
  let selectedFile = null;

  // ----- Build the landing page buttons from config.js -----
  SECTIONS.forEach(function (section) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "section-btn group-" + section.group;
    btn.textContent = section.id;
    btn.addEventListener("click", function () {
      openUploadView(section.id, section.group);
    });
    sectionGrid.appendChild(btn);
  });

  fileInput.accept = ACCEPTED_FILE_TYPES;

  // ----- View helpers -----
  function showView(view) {
    [viewLanding, viewUpload, viewThanks].forEach(function (v) {
      v.classList.add("hidden");
    });
    view.classList.remove("hidden");
  }

  function openUploadView(sectionId, group) {
    currentSection = sectionId;
    resetUploadForm();
    uploadBadge.textContent = sectionId;
    uploadBadge.className = "badge group-" + group;
    showView(viewUpload);
  }

  function resetUploadForm() {
    selectedFile = null;
    fileInput.value = "";
    dropzone.classList.remove("has-file");
    dropzoneText.textContent = "No file selected";
    submitBtn.classList.add("hidden");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";
    uploadingState.classList.add("hidden");
  }

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
  }

  // ----- File selection -----
  chooseBtn.addEventListener("click", function () {
    fileInput.click();
  });
  dropzone.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    errorMsg.classList.add("hidden");
    const file = fileInput.files[0];
    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      showError("That file is " + sizeMB.toFixed(1) + "MB. Please choose a file under " + MAX_FILE_SIZE_MB + "MB.");
      fileInput.value = "";
      return;
    }

    selectedFile = file;
    dropzone.classList.add("has-file");
    dropzoneText.textContent = file.name;
    submitBtn.classList.remove("hidden");
  });

  clearBtn.addEventListener("click", function () {
    resetUploadForm();
  });

  backBtn.addEventListener("click", function () {
    showView(viewLanding);
  });

  uploadAnotherBtn.addEventListener("click", function () {
    showView(viewLanding);
  });

  // ----- Submit -----
  submitBtn.addEventListener("click", function () {
    if (!selectedFile || !currentSection) return;

    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.indexOf("PASTE_YOUR") === 0) {
      showError("This site isn't connected to Google Drive yet. The site owner needs to add the Apps Script URL in config.js.");
      return;
    }

    submitBtn.disabled = true;
    uploadingState.classList.remove("hidden");
    errorMsg.classList.add("hidden");

    fileToBase64(selectedFile)
      .then(function (base64Data) {
        const formData = new FormData();
        formData.append("section", currentSection);
        formData.append("filename", selectedFile.name);
        formData.append("mimeType", selectedFile.type || "application/octet-stream");
        formData.append("fileData", base64Data);

        return fetch(APPS_SCRIPT_URL, {
          method: "POST",
          body: formData,
        });
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        uploadingState.classList.add("hidden");
        if (result && result.success) {
          thanksBadge.textContent = currentSection;
          thanksBadge.className = uploadBadge.className;
          showView(viewThanks);
        } else {
          submitBtn.disabled = false;
          showError((result && result.error) || "Upload failed. Please try again.");
        }
      })
      .catch(function () {
        uploadingState.classList.add("hidden");
        submitBtn.disabled = false;
        showError("Could not reach the server. Check your internet connection and try again.");
      });
  });

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        // reader.result looks like "data:<mime>;base64,AAAA..."
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
})();