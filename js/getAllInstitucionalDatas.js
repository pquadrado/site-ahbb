async function getAllInstitucionalPdf() {
  try {
    const response = await fetch('http://localhost:8080/institucional-pdf');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar PDFs:', error);
    return [];
  }
}

async function renderPdfList() {
  const pdfList = await getAllInstitucionalPdf();
  const container = document.querySelector('.container-grid-transparencia');
  
  const pdfHtml = pdfList
    .map((pdfData) => {
      return `
        <a href="${pdfData.value}" target="_blank" key="${pdfData.id}">
          <img src="./images/ic_download_arquivo.53acd964.svg" alt="download"> 
          <p>${pdfData.name}</p>
        </a>
      `;
    })
    .join('');

  container.innerHTML = pdfHtml;
}

document.addEventListener('DOMContentLoaded', renderPdfList);