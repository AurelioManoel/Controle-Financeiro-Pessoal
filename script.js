document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-transacao');
  const historico = document.getElementById('historico');
  const saldoEl = document.getElementById('saldo');

  let transacoes = [];

  // 🔄 Carrega transações do Firebase
  firebase.database().ref('transacoes').on('value', snapshot => {
    transacoes = [];
    snapshot.forEach(child => {
      transacoes.push({ ...child.val(), key: child.key });
    });
    atualizarHistorico();
    atualizarSaldo();
  });

  // ➕ Adiciona nova transação
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const data = document.getElementById('data').value;
    const fonte = document.getElementById('fonte').value;
    const parcelas = parseInt(document.getElementById('parcelas').value);

    const transacao = { tipo, descricao, valor, data, fonte };

    // Salva transação no Firebase
    const novaRef = firebase.database().ref('transacoes').push();
    novaRef.set(transacao);

    // Se for despesa parcelada, salva parcelas com vínculo
    if (tipo === 'despesa' && parcelas > 1) {
      const valorParcela = valor / parcelas;
      const dataInicial = new Date(data);

    for (let i = 0; i < parcelas && i < 12; i++) {
       const dataParcela = new Date(dataInicial.getFullYear(), dataInicial.getMonth() + i, 1);
       const mesFormatado = dataParcela.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

      firebase.database().ref('despesasParceladas').push({
      idTransacao: novaRef.key,
      mes: mesFormatado,
      descricao,
      valorParcela: parseFloat(valorParcela),
      fontePagadora: fonte // ✅ ESSENCIAL PARA A ANÁLISE FUNCIONAR
    });
  }
}

    form.reset();
  });

  // 🧾 Atualiza histórico na tabela
  function atualizarHistorico() {
    historico.innerHTML = '';
    transacoes.forEach((t) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${t.tipo}</td>
        <td>${t.descricao}</td>
        <td>R$ ${t.valor.toFixed(2)}</td>
        <td>${t.data}</td>
        <td>${t.fonte}</td>
        <td><button class="btn-excluir" data-key="${t.key}">Excluir</button></td>
      `;
      historico.appendChild(row);
    });

    // 🗑️ Botão de excluir
    document.querySelectorAll('.btn-excluir').forEach(button => {
      button.addEventListener('click', function () {
        const key = this.getAttribute('data-key');

        // Remove transação principal
        firebase.database().ref('transacoes').child(key).remove();

        // Remove parcelas vinculadas
        firebase.database().ref('despesasParceladas').once('value', snapshot => {
          snapshot.forEach(child => {
            const parcela = child.val();
            if (parcela.idTransacao === key) {
              firebase.database().ref('despesasParceladas').child(child.key).remove();
            }
          });
        });
      });
    });
  }

  // 💰 Atualiza saldo
  function atualizarSaldo() {
    const saldo = transacoes.reduce((acc, t) => {
      return t.tipo === 'receita' ? acc + t.valor : acc - t.valor;
    }, 0);
    saldoEl.textContent = `R$ ${saldo.toFixed(2)}`;
  }
});