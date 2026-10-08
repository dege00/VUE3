import { getDocument, OPS, GlobalWorkerOptions } from "pdfjs-dist";
import  JSZip  from "jszip";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerUrl;
// o pdf usa o woker pra abrir o pdf no navegador, então precisamos importar o worker do 
// pdfjs-dist e configurar o caminho para ele.

export async function extrairImagensPDF(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({
    data: buffer,
    isOffscreenCanvasSupported: false,
  }).promise;

  let contadorImagens = 0;
  const imagens = [];

  for (let pagina = 1; pagina <= pdf.numPages; pagina++) {
    const page = await pdf.getPage(pagina);
    const ops = await page.getOperatorList();
    
  for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i];

      // so me interessa a operacao que desenha a imagem na tela fi
      if (fn !== OPS.paintImageXObject) {
        continue;
      }
      

