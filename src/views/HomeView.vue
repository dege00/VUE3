<script setup>
import { ref } from "vue";
import { extrairImagensPDF, baixarZip } from "../services/extrair.js";
import Resultados from "../components/Resultados.vue";
import logoProjeto from "../assets/logo do projeto.png";

const arquivoselecionados = ref(null);
const imagens = ref([]);

function arquivoSelecionado(event) {
  arquivoselecionados.value = event.target.files[0];

  console.log("arquivos selecionados", arquivoselecionados.value);
}

async function testeextracao() {
  console.log("CLIQUEI NO BOTÃO");

  if (!arquivoselecionados.value) {
    alert("Selecione um PDF");
    return;
  }

  console.log("Extraindo...");

  const resultado = await extrairImagensPDF(arquivoselecionados.value);

  imagens.value = resultado.map((imagem, index) => ({
    id: index,
    nome: imagem.nome,
    blob: imagem.blob,
    url: URL.createObjectURL(imagem.blob),
    pagina: imagem.pagina,
    tamanho: imagem.tamanho
  }));

  console.log(imagens.value);
}
</script>

<template>
  <h1>Extração de Imagens de PDF</h1>

  <img :src="logoProjeto" alt="Logo do projeto" width="150">

  <input
    type="file"
    @change="arquivoSelecionado"
    accept=".pdf"
  />

  <button @click="testeextracao">
    Extrair PDF
  </button>

  <button @click="baixarZip(imagens)">
    Baixar ZIP
  </button>

  <Resultados :imagens="imagens" />
</template>