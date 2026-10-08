<script setup>
function editarnome(imagem) {
  console.log('Editar nome da imagem:', imagem.nome);
  console.log('imagem atualizada', imagem.nome);
  alert('Nome alterado para: ' + imagem.nome);
}

function excluir(imagem) {
  const querExcluir = confirm('Excluir ' + imagem.nome + '?');

  if (!querExcluir) {
    return;
  }

  console.log('Excluindo imagem:', imagem.nome);

  const indice = props.imagens.indexOf(imagem);
  props.imagens.splice(indice, 1);

  console.log('Imagem excluida. Total agora:', props.imagens.length);
}

const props = defineProps({
  imagens: Array
});
</script>

<template>
  <div>
    <h2>Imagens encontradas: {{ props.imagens.length }}</h2>

    <div v-for="imagem in props.imagens" :key="imagem.id">
      <img :src="imagem.url" :alt="imagem.nome" width="300">

      <p>{{ imagem.nome }}</p>
      <input v-model="imagem.nome">
      <button @click="editarnome(imagem)">Editar nome</button>
      <button @click="excluir(imagem)">Excluir</button>

      <p>Página: {{ imagem.pagina }}</p>
    </div>
  </div>
</template>