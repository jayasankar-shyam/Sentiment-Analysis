const form = document.querySelector(".form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const commentInput = document.getElementById("comment");
const charCount = document.getElementById("charCount");
const commentsDiv = document.querySelector(".comments");
let comments = [];

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (
    nameInput.value.trim() === "" ||
    commentInput.value.trim() === "" ||
    !isValidEmail(emailInput.value)
  ) {
    return;
  }

  checkCharacterCount(commentInput.value)
    .then((response) => {
      if (response === 1) {
        handleCommentError("Comment seems to be inappropriate.");
      } else {
        
        const comment = {
          name: nameInput.value,
          email: emailInput.value,
          comment: commentInput.value,
          date: new Date(),
        };
        comments.push(comment);
        renderComments();
        showSuccessMessage();
        form.reset();
      }
    })
    .catch((error) => {
      // Handle error response from FastAPI
      handleCommentError(
        "Error occurred while checking. Please try again later."
      );
    });
});

commentInput.addEventListener("input", function () {
  const count = commentInput.maxLength - commentInput.value.length;
  charCount.textContent = count;
});

function renderComments() {
  commentsDiv.innerHTML = "";
  comments.forEach(function (comment, index) {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");
    commentDiv.innerHTML = `
      <p><strong>${comment.name}:</strong> ${comment.comment}</p>
      <span>${formatDate(comment.date)}</span>
      <button onclick="deleteComment(${index})">Delete</button>
    `;
    commentsDiv.appendChild(commentDiv);
  });
}

function deleteComment(index) {
  comments.splice(index, 1);
  renderComments();
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function showSuccessMessage() {
  const messageDiv = createMessageDiv(
    "Comment Posted successfully!",
    "#4CAF50"
  );
  form.insertAdjacentElement("afterend", messageDiv);
  setTimeout(function () {
    messageDiv.remove();
  }, 3000);
}

function handleCommentError(message) {
  const messageDiv = createMessageDiv(message, "#FF0000");
  form.insertAdjacentElement("afterend", messageDiv);
  setTimeout(function () {
    messageDiv.remove();
  }, 3000);
}

function createMessageDiv(text, bgColor) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = text;
  messageDiv.style.backgroundColor = bgColor;
  messageDiv.style.color = "#fff";
  messageDiv.style.padding = "10px";
  messageDiv.style.borderRadius = "5px";
  messageDiv.style.marginTop = "20px";
  messageDiv.style.textAlign = "center";
  messageDiv.style.fontSize = "1.2em";
  messageDiv.style.fontWeight = "bold";
  return messageDiv;
}

function checkCharacterCount(comment) {
  return fetch("https://checksentiment-udinnvffqq-uc.a.run.app/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  })
    .then((response) => response.json())
    .then((data) => data.result);
}
