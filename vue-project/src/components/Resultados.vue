<script setup>
function editarnome(imagem) {
  console.log('Editar nome da imagem:', imagem.nome);
 console.log('imagem atualizada', imagem.nome);
 }
const props = defineProps({
  imagens: Array
});
</script>

<template>
  <div>
    <h2>Imagens encontradas: {{ props.imagens.length }}</h2>

    <div v-for="imagem in props.imagens" :key="imagem.nome">
      <img :src="imagem.url" :alt="imagem.nome" width="300">

      <p>{{ imagem.nome }}</p>
      <input v-model="imagem.nome">
      <button @click="editarnome(imagem)">Editar nome</button>

      <p>Página: {{ imagem.pagina }}</p>
    </div>
  </div>
</template>