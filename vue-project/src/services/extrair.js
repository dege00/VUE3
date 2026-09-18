import { getDocument, OPS, GlobalWorkerOptions } from "pdfjs-dist";
import JSZip from "jszip";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerUrl;

// o pdf usa o worker pra abrir o pdf no navegador,
// então precisamos importar o worker do pdfjs-dist
// e configurar o caminho para ele.

export async function extrairImagensPDF(file) {
  const buffer = await file.arrayBuffer();

  const pdf = await getDocument({
    data: buffer,
    isOffscreenCanvasSupported: false,
  }).promise;

  console.log("PDF aberto!");
  console.log("Quantidade de páginas:", pdf.numPages);

  let contadorImagens = 0;
  const imagens = [];

  for (let pagina = 1; pagina <= pdf.numPages; pagina++) {
    const page = await pdf.getPage(pagina);
    const ops = await page.getOperatorList();

    console.log("Página:", pagina);
    console.log("Operações encontradas:", ops.fnArray.length);

    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i];

      // só me interessa a operação que desenha a imagem na tela
      if (fn !== OPS.paintImageXObject) {
        continue;
      }

  console.log("Imagem encontrada na página:", pagina);

  const nomeImagem = ops.argsArray[i][0];

  const imagem = await new Promise((resolve) => {
    page.objs.get(nomeImagem, resolve);
  });

  if (!imagem) {
    continue;
  }

  const canvas = document.createElement("canvas");

  canvas.width = imagem.width;
  canvas.height = imagem.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    continue;
  }

  if (imagem.bitmap) {
    ctx.drawImage(imagem.bitmap, 0, 0);
  } else {
    if (!imagem.data) {
      continue;
    }

    const dados = imagem.data;
    const totalPixels = imagem.width * imagem.height;
    const canais = dados.length / totalPixels;

    const rgba = new Uint8ClampedArray(totalPixels * 4);

    for (let p = 0; p < totalPixels; p++) {
      const origem = p * canais;
      const destino = p * 4;

      if (canais === 4) {
        rgba[destino] = dados[origem];
        rgba[destino + 1] = dados[origem + 1];
        rgba[destino + 2] = dados[origem + 2];
        rgba[destino + 3] = dados[origem + 3];
      } else if (canais === 3) {
        rgba[destino] = dados[origem];
        rgba[destino + 1] = dados[origem + 1];
        rgba[destino + 2] = dados[origem + 2];
        rgba[destino + 3] = 255;
      } else if (canais === 1) {
        rgba[destino] = dados[origem];
        rgba[destino + 1] = dados[origem];
        rgba[destino + 2] = dados[origem];
        rgba[destino + 3] = 255;
      }
    }

    const imageData = new ImageData(
      rgba,
      imagem.width,
      imagem.height
    );

    ctx.putImageData(imageData, 0, 0);
  }

  const png = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!png) {
    continue;
  }

  contadorImagens++;

  imagens.push({
    blob: png,
    nome: `imagem_${contadorImagens}.png`,
    pagina: pagina,
    tamanho: png.size,
  });
      
      }
    }

    console.log("Total de imagens:", contadorImagens);

    return imagens;
  }