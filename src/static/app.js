document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});

document.addEventListener('DOMContentLoaded', init);

function init() {
  fetch('/activities')
    .then((r) => r.json())
    .then(renderActivities)
    .catch((err) => {
      console.error('Failed to load activities', err);
    });
}

function renderActivities(data) {
  const container = document.getElementById('activitiesContainer');
  if (!container) return;

  container.innerHTML = '';

  Object.entries(data).forEach(([name, activity]) => {
    const card = document.createElement('div');
    card.className = 'activity-card';

    const title = document.createElement('h4');
    title.textContent = name;

    const desc = document.createElement('p');
    desc.textContent = activity.description;

    const schedule = document.createElement('p');
    schedule.textContent = `Schedule: ${activity.schedule}`;

    const spots = document.createElement('p');
    spots.textContent = `Spots: ${activity.participants.length} / ${activity.max_participants}`;

    // Participants section
    const parts = document.createElement('div');
    parts.className = 'participants';
    const ph = document.createElement('h5');
    ph.textContent = 'Participants';
    const ul = document.createElement('ul');

    if (Array.isArray(activity.participants) && activity.participants.length > 0) {
      activity.participants.forEach((email) => {
        const li = document.createElement('li');
        li.textContent = email;
        ul.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.className = 'muted';
      li.textContent = 'No participants yet';
      ul.appendChild(li);
    }

    parts.appendChild(ph);
    parts.appendChild(ul);

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(schedule);
    card.appendChild(spots);
    card.appendChild(parts);

    container.appendChild(card);
  });
}
