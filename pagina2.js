const container = document.getElementById('resumo-mensal');
const despesas = JSON.parse(localStorage.getItem('despesasParceladas')) || [];

const mesesAgrupados = {};

despesas.forEach(despesa => {
  if (!mesesAgrupados[despesa.mes]) {
    mesesAgrupados[despesa.mes] = [];
  }
  mesesAgrupados[despesa.mes].push(despesa);
});

for (const mes in mesesAgrupados) {
  const lista = mesesAgrupados[mes];
  const totalMes = lista.reduce((sum, item) => sum + item.valorParcela, 0).toFixed(2);

  const bloco = document.createElement('div');
  bloco.innerHTML = `
    <h2>${mes.charAt(0).toUpperCase() + mes.slice(1)}</h2>
    <ul>
      ${lista.map(item => `<li>${item.descricao} - R$ ${item.valorParcela.toFixed(2)}</li>`).join('')}
    </ul>
    <strong>Total do mês: R$ ${totalMes}</strong>
    <hr>
  `;
  container.appendChild(bloco);
}
function carregarDespesas() {
  const despesas = JSON.parse(localStorage.getItem('despesas')) || [];

  const mesesAgrupados = {};

  despesas.forEach(item => {
    const data = new Date(item.data);
    const mes = data.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    if (!mesesAgrupados[mes]) {
      mesesAgrupados[mes] = [];
    }

    mesesAgrupados[mes].push(item);
  });

  exibirResumo(mesesAgrupados);
}

function exibirResumo(mesesAgrupados) {
  const container = document.getElementById('resumo-mensal');
  container.innerHTML = '';

  for (const mes in mesesAgrupados) {
    const lista = mesesAgrupados[mes];
    const totalMes = lista.reduce((sum, item) => sum + item.valorParcela, 0).toFixed(2);

    const bloco = document.createElement('div');
    bloco.innerHTML = `<h3>${mes} - Total: R$ ${totalMes}</h3>`;

    lista.forEach(item => {
      const linha = document.createElement('p');
      linha.textContent = `${item.descricao} - R$ ${item.valorParcela.toFixed(2)}`;
      bloco.appendChild(linha);
    });

    container.appendChild(bloco);
  }
}

document.addEventListener('DOMContentLoaded', carregarDespesas);