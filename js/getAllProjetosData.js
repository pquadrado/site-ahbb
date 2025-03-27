const BASE_URL = "http://localhost:8080";
const ENDPOINTS = {
  pastaRaiz: "/pasta-raiz",
  subPasta: "/sub-pasta",
  submitPdf: "/submit-pdf",
};

async function getPastaRaiz() {
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.pastaRaiz}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar as pastas-raiz:", error);
    return [];
  }
}

async function getSubPastas(pastaRaizId) {
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.subPasta}/${pastaRaizId}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar as subpastas:", error);
    return [];
  }
}

async function getActionPdfs(subPastaId) {
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.submitPdf}/${subPastaId}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar os PDFs:", error);
    return [];
  }
}

async function renderMenu() {
  const menuContainer = document.querySelector(".menu-container");
  const pastaRaizList = await getPastaRaiz();

  const filteredPastaRaizList = pastaRaizList.filter((pastaRaiz) => pastaRaiz.covid_19 === false);

  for (const pastaRaiz of filteredPastaRaizList) {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";

    const menuTitle = document.createElement("div");
    menuTitle.className = "menu-title";
    menuTitle.setAttribute("key", pastaRaiz.id);
    menuTitle.innerHTML = `<p>${pastaRaiz.name}</p> <span class="menu-icon">+</span>`;

    const menuContent = document.createElement("div");
    menuContent.className = "menu-content";
    menuContent.style.display = "none";

    menuTitle.addEventListener("click", function () {
      const icon = menuTitle.querySelector(".menu-icon");
      if (menuContent.style.display === "block") {
        menuContent.style.display = "none";
        icon.textContent = "+";
      } else {
        menuContent.style.display = "block";
        icon.textContent = "–";
      }
    });

    const subPastas = await getSubPastas(pastaRaiz.id);
    for (const subPasta of subPastas) {
      const subItem = document.createElement("div");
      subItem.className = "sub-item";

      const subTitle = document.createElement("div");
      subTitle.className = "sub-title";
      subTitle.setAttribute("key", subPasta.id);
      subTitle.innerHTML = `<p>${subPasta.name}</p> <span class="menu-icon">+</span>`;

      const subContent = document.createElement("div");
      subContent.className = "sub-content";
      subContent.style.display = "none";

      subTitle.addEventListener("click", function () {
        const icon = subTitle.querySelector(".menu-icon");
        if (subContent.style.display === "block") {
          subContent.style.display = "none";
          icon.textContent = "+";
        } else {
          subContent.style.display = "block";
          icon.textContent = "–";
        }
      });

      const actionPdfs = await getActionPdfs(subPasta.id);
      for (const actionPdf of actionPdfs) {
        const pdfLink = document.createElement("a");
        pdfLink.href = actionPdf.values;
        pdfLink.target = "_blank";
        pdfLink.setAttribute("key", actionPdf.id);
        pdfLink.innerHTML = `
          <img src="./images/ic_download_arquivo.53acd964.svg" alt="download">
          <span>${actionPdf.name}</span>
        `;
        subContent.appendChild(pdfLink);
      }

      subItem.appendChild(subTitle);
      subItem.appendChild(subContent);
      menuContent.appendChild(subItem);
    }

    menuItem.appendChild(menuTitle);
    menuItem.appendChild(menuContent);
    menuContainer.appendChild(menuItem);
  }
}

document.addEventListener("DOMContentLoaded", renderMenu);
