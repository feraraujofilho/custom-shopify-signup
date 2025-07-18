document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("custom-signup-form");
  const messageDiv = form.querySelector(".form-message");

  // Get the reseller parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const reseller = urlParams.get("reseller");

  // Display reseller info if present
  if (reseller) {
    const resellerInfo = document.getElementById("reseller-info");
    const resellerName = document.getElementById("reseller-name");
    if (resellerInfo && resellerName) {
      resellerName.textContent = reseller;
      resellerInfo.style.display = "block";
    }
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Add reseller to the data if it exists
    if (reseller) {
      data.reseller = reseller;
    }

    const appUrl = form.getAttribute("data-app-url");

    // Use the app proxy URL instead of direct app URL
    const proxyUrl = "/apps/custom-signup/signup";

    // Disable form during submission
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to login page
        window.location.href = `https://${window.location.host}/customer_authentication/login`;
      } else {
        // Show error message
        messageDiv.textContent =
          result.message || "An error occurred. Please try again.";
        messageDiv.className = "form-message error";
        messageDiv.style.display = "block";
      }
    } catch (error) {
      messageDiv.textContent = "Network error. Please try again.";
      messageDiv.className = "form-message error";
      messageDiv.style.display = "block";
    } finally {
      submitButton.disabled = false;
    }
  });
});
