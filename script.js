console.log("JS 실행됨");

// ===== 헤더 =====
fetch("/header.html")
  .then(res => res.text())
  .then(data => {
    document.body.insertAdjacentHTML("afterbegin", data);

    let lastScroll = 0;
    const navbar = document.querySelector("nav");

    window.addEventListener("scroll", function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > lastScroll) {
        navbar.style.top = "-100px";
      } else {
        navbar.style.top = "0";
      }

      lastScroll = currentScroll;
    });

    // 현재 페이지 메뉴 active 처리
    const links = document.querySelectorAll(".menu a");
    const currentPath = window.location.pathname;

    links.forEach(link => {
      const linkPath = link.getAttribute("href");

      if (linkPath === currentPath) {
        link.classList.add("active");
      }
    });
  });


// ===== 푸터 =====
fetch("/footer.html")
  .then(res => res.text())
  .then(data => {
    document.body.insertAdjacentHTML("beforeend", data);
  });


// ===== 문의 =====
const form = document.getElementById("contact-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = new FormData(form);

    fetch("https://formspree.io/f/xqewpplj", {
      method: "POST",
      body: data,
      headers: {
        "Accept": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          window.location.href = "/contact_confirm.html";
        } else {
          alert("전송 실패");
        }
      });
  });
}


// ===== 뉴스 =====
const container = document.getElementById("news-container");

if (container) {
  fetch("/news.json")
    .then(res => res.json())
    .then(data => {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));

      data.forEach(news => {
        const card = document.createElement("a");
        card.href = news.link;
        card.target = "_blank";
        card.className = "news-card";

        card.innerHTML = `
          <img src="${news.image}" alt="${news.title}">
          <p class="date">${news.date}</p>
          <h3>${news.title}</h3>
          <p>${news.desc}</p>
        `;

        container.appendChild(card);
      });
    });
}


// ===== 활동 목록 =====
const activityContainer = document.getElementById("activity-container");

if (activityContainer) {
  const filterButtons = document.querySelectorAll(".activity-filter button");

  const params = new URLSearchParams(window.location.search);
  const initialFilter = params.get("filter") || "all";

  setActiveButton(initialFilter);

  Promise.all([
    fetch("/activities_data/competition.json").then(res => res.json()),
    fetch("/activities_data/project.json").then(res => res.json()),
    fetch("/activities_data/outreach.json").then(res => res.json())
  ])
    .then(results => {
      const allActivities = results.flat();

      allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

      renderActivities(allActivities, initialFilter);

      filterButtons.forEach(button => {
        button.addEventListener("click", function () {
          const filter = this.dataset.filter;

          setActiveButton(filter);
          renderActivities(allActivities, filter);

          const newUrl =
            filter === "all"
              ? "/activities.html"
              : `/activities.html?filter=${filter}`;

          history.pushState(null, "", newUrl);
        });
      });
    });

  function renderActivities(allActivities, filter) {
    activityContainer.innerHTML = "";

    const filtered =
      filter === "all"
        ? allActivities
        : allActivities.filter(item => item.category === filter);

    if (filtered.length === 0) {
      activityContainer.innerHTML = "<p class='empty-message'>해당 활동이 없습니다.</p>";
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("a");

      const filterQuery = filter === "all" ? "?filter=all" : `?filter=${filter}`;
      card.href = item.link + filterQuery;

      card.className = "activity-card";

      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <p class="activity-date">${item.date}</p>
        <h3>${item.title}</h3>
      `;

      activityContainer.appendChild(card);
    });
  }

  function setActiveButton(filter) {
    filterButtons.forEach(button => {
      button.classList.remove("active");

      if (button.dataset.filter === filter) {
        button.classList.add("active");
      }
    });
  }
}


// ===== 활동 상세 이전/다음 자동 연결 =====
const detailNav = document.getElementById("detail-nav");
const activityDetail = document.querySelector(".activity-detail[data-activity-link]");

if (detailNav && activityDetail) {
  const currentLink = activityDetail.dataset.activityLink;

  const params = new URLSearchParams(window.location.search);
  const currentFilter = params.get("filter") || "all";

  Promise.all([
    fetch("/activities_data/competition.json").then(res => res.json()),
    fetch("/activities_data/project.json").then(res => res.json()),
    fetch("/activities_data/outreach.json").then(res => res.json())
  ])
    .then(results => {
      let allActivities = results.flat();

      if (currentFilter !== "all") {
        allActivities = allActivities.filter(item => item.category === currentFilter);
      }

      allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

      const currentIndex = allActivities.findIndex(item => item.link === currentLink);

      if (currentIndex === -1) {
        detailNav.innerHTML = "";
        return;
      }

      const prevActivity = allActivities[currentIndex - 1];
      const nextActivity = allActivities[currentIndex + 1];

      detailNav.innerHTML = `
        ${prevActivity
          ? `<a href="${prevActivity.link}?filter=${currentFilter}" class="detail-nav-btn prev-activity">
                <span class="nav-label">← 이전 활동</span>
                <strong>${prevActivity.title}</strong>
              </a>`
          : `<div></div>`
        }

        ${nextActivity
          ? `<a href="${nextActivity.link}?filter=${currentFilter}" class="detail-nav-btn next-activity">
                <span class="nav-label">다음 활동 →</span>
                <strong>${nextActivity.title}</strong>
              </a>`
          : `<div></div>`
        }
      `;
    });
}