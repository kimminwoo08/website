// 건물 층 정보
function showFloor(floor) {
  const data = {
    1: "1층: FRC연구실",
    2: "4층: 수중드론 연구실",
    3: "5층: FTC연구실, SWing연구실"
  };

  document.getElementById("floor-info").innerText = data[floor];
}

// 뉴스 불러오기
fetch('news.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('news-container');

    data.forEach(item => {
      const div = document.createElement('div');
      div.style.marginBottom = "20px";
      div.innerHTML = `<h3>${item.title}</h3><p>${item.date}</p>`;
      container.appendChild(div);
    });
  });

  //상단 바
  fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.body.insertAdjacentHTML("afterbegin", data);
  });

  //하단 Swing소개 
  fetch("footer.html")
  .then(res => res.text())
  .then(data => {
    document.body.insertAdjacentHTML("beforeend", data);
  });