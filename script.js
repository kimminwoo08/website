console.log("JS 실행됨");

// ===== 헤더 =====
fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.body.insertAdjacentHTML("afterbegin", data);
  });

// ===== 푸터 =====
fetch("footer.html")
  .then(res => res.text())
  .then(data => {
    document.body.insertAdjacentHTML("beforeend", data);
  });


// ===== 문의 =====
const form = document.getElementById("contact-form");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const data = new FormData(form);

    fetch("https://formspree.io/f/xqewpplj", {
      method: "POST",
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        window.location.href = "contact_confirm.html";
      } else {
        alert("전송 실패");
      }
    });
  });
}


// ===== 뉴스 =====
const container = document.getElementById("news-container");

if (container) {
  fetch("news.json")
  .then(res => res.json())
  .then(data => {

    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    data.forEach(news => {
      const card = document.createElement("a");
      card.href = news.link;
      card.target = "_blank";
      card.className = "news-card";

      card.innerHTML = `
        <img src="${news.image}">
        <p class="date">${news.date}</p>
        <h3>${news.title}</h3>
        <p>${news.desc}</p>
      `;

      container.appendChild(card);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".menu a");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
});