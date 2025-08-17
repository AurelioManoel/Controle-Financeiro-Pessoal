document.addEventListener('DOMContentLoaded', function () {
  const filtroMes = document.getElementById('filtro-mes');
  const filtroFonte = document.getElementById('filtro-fonte');
  const resultado = document.getElementById('resultado');

  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

  let parcelas = JSON.parse(localStorage.getItem('despesasParceladas')) || [];

  // 🗓️ Preenche filtro de meses únicos
  const mesesUnicos = [...new Set(parcelas.map(p => p.mes))];
  mesesUnicos.sort((a, b) => new Date(`01 ${a}`) - new Date(`01 ${b}`));
  filtroMes.innerHTML = '<option value="">Selecione</option>';
  mesesUnicos.forEach(mes => {
    const option = document.createElement('option');
    option.value = mes;
    option.textContent = mes;
    filtroMes.appendChild(option);
  });

  // 📊 Função de cálculo
  window.calcular = function () {
    const fonte = filtroFonte.value.trim().toUpperCase();
    const mesSelecionado = filtroMes.value.trim();

    if (!fonte || !mesSelecionado) {
      alert("Selecione uma fonte pagadora e um mês.");
      return;
    }

    const match = mesSelecionado.match(/([a-zç]+)\s*(de)?\s*(\d{4})/i);
    if (!match) {
      alert("Formato de mês inválido.");
      return;
    }

    const nomeMes = match[1].toLowerCase();
    const ano = parseInt(match[3]);
    const indiceMes = meses.indexOf(nomeMes);

    let mesAnteriorIndice = indiceMes - 1;
    let anoAnterior = ano;
    if (mesAnteriorIndice < 0) {
      mesAnteriorIndice = 11;
      anoAnterior -= 1;
    }

    const mesAnteriorFormatado = `${meses[mesAnteriorIndice]} de ${anoAnterior}`;

    const parcelasFiltradas = parcelas.filter(p =>
      p.mes === mesSelecionado &&
      p.fontePagadora.toUpperCase() === fonte
    );

    const total = parcelasFiltradas.reduce((acc, p) => acc + parseFloat(p.valorParcela), 0);

    const parcelasMesAnterior = parcelas.filter(p =>
      p.mes === mesAnteriorFormatado &&
      p.fontePagadora.toUpperCase() === fonte
    );

    const totalAnterior = parcelasMesAnterior.reduce((acc, p) => acc + parseFloat(p.valorParcela), 0);

    const diferenca = total - totalAnterior;
    const percentual = totalAnterior > 0 ? (diferenca / totalAnterior) * 100 : 0;

    let comparativoMsg = '';
    if (totalAnterior === 0) {
      comparativoMsg = `<p>Nenhum gasto registrado no mês anterior (${mesAnteriorFormatado}).</p>`;
    } else if (diferenca > 0) {
      comparativoMsg = `<p>📈 Este mês você gastou <strong>R$ ${total.toFixed(2)}</strong>, um <strong>aumento de ${percentual.toFixed(2)}%</strong> em relação ao mês anterior (<strong>R$ ${totalAnterior.toFixed(2)}</strong>). Diferença: <strong>+R$ ${diferenca.toFixed(2)}</strong>.</p>`;
    } else if (diferenca < 0) {
      comparativoMsg = `<p>📉 Este mês você gastou <strong>R$ ${total.toFixed(2)}</strong>, uma <strong>redução de ${Math.abs(percentual).toFixed(2)}%</strong> em relação ao mês anterior (<strong>R$ ${totalAnterior.toFixed(2)}</strong>). Diferença: <strong>–R$ ${Math.abs(diferenca).toFixed(2)}</strong>.</p>`;
    } else {
      comparativoMsg = `<p>🔁 O gasto foi exatamente igual ao mês anterior: <strong>R$ ${total.toFixed(2)}</strong>.</p>`;
    }

    resultado.innerHTML = `
      <div class="card">
        <h2>${mesSelecionado} — ${fonte}</h2>
        <ul>
          ${parcelasFiltradas.map(p => `<li>${p.descricao} — R$ ${parseFloat(p.valorParcela).toFixed(2)}</li>`).join("")}
        </ul>
        <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
        ${comparativoMsg}
      </div>
    `;
  };
});