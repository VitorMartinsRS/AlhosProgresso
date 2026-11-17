const receitas=[{titulo:'Arroz com alho',ingredientes:'1 xícara de arroz, 2 dentes de alho picados, 1 colher de sopa de óleo, 2 xícaras de água quente e sal a gosto.',etapas:['Aqueça o óleo e refogue o alho em fogo baixo, sem deixar queimar.','Adicione o arroz e mexa por um minuto. Junte a água quente e o sal.','Cozinhe em fogo baixo, com a panela parcialmente tampada, até a água secar e o arroz ficar macio. Deixe descansar antes de servir.']},{titulo:'Macarrão alho e óleo',ingredientes:'200 g de macarrão, 3 dentes de alho fatiados, 3 colheres de sopa de azeite, sal e salsinha a gosto.',etapas:['Cozinhe o macarrão em água com sal conforme a embalagem. Reserve um pouco da água do cozimento.','Aqueça o azeite e doure levemente o alho em fogo baixo.','Junte o macarrão escorrido e um pouco da água reservada. Misture, finalize com salsinha e sirva.']},{titulo:'Pão com manteiga de alho',ingredientes:'1 baguete pequena, 2 colheres de sopa de manteiga amolecida, 2 dentes de alho bem picados e salsinha a gosto.',etapas:['Misture a manteiga, o alho e a salsinha.','Corte o pão em fatias, sem separar completamente a base, e espalhe a mistura entre elas.','Leve ao forno preaquecido a 180 °C por cerca de 10 a 15 minutos, até dourar. Sirva ainda quente.']}];

const janela = document.querySelector('#janela-receita');

document.querySelectorAll('[data-receita]').forEach(botao => {
  botao.addEventListener('click', () => {
    const receita = receitas[Number(botao.dataset.receita)];
    document.querySelector('#titulo-receita').textContent = receita.titulo;
    document.querySelector('#ingredientes').textContent = receita.ingredientes;
    document.querySelector('#etapas').replaceChildren(...receita.etapas.map(etapa => {
      const item = document.createElement('li');
      item.textContent = etapa;
      return item;
    }));
    janela.showModal();
  });
});

document.querySelector('.fechar').addEventListener('click', () => janela.close());

janela.addEventListener('click', evento => {
  if (evento.target === janela) {
    const limites = janela.getBoundingClientRect();
    if (evento.clientX < limites.left || evento.clientX > limites.right ||
        evento.clientY < limites.top || evento.clientY > limites.bottom) {
      janela.close();
    }
  }
});

// Carrinho de produtos: todas as quantidades são unidades inteiras, entre 1 e 99.
const produtos = [
  { identificador: 'mix', nome: 'Mix' },
  { identificador: 'cheiro-verde', nome: 'Cheiro-verde' },
  { identificador: 'calabacon', nome: 'Calabacon' },
  { identificador: 'descascado', nome: 'Alho descascado' },
  { identificador: 'puro', nome: 'Alho puro' }
];
const chaveCarrinho = 'alhos-progresso-carrinho';
const telefoneWhatsApp = '5511943441746';
const carrinho = {};
try {
  const salvo = JSON.parse(localStorage.getItem(chaveCarrinho) || '{}');
  if (salvo && typeof salvo === 'object') {
    produtos.forEach(produto => {
      const quantidade = salvo[produto.identificador];
      if (Number.isInteger(quantidade) && quantidade > 0 && quantidade <= 99) {
        carrinho[produto.identificador] = quantidade;
      }
    });
  }
} catch { /* O carrinho continua funcionando quando o armazenamento não está disponível. */ }

const painelCarrinho = document.querySelector('#janela-carrinho');
const abrirCarrinho = document.querySelector('#abrir-carrinho');
const listaCarrinho = document.querySelector('#itens-carrinho');
const avisoCarrinho = document.querySelector('#aviso-carrinho');
const finalizarPedido = document.querySelector('#finalizar-whatsapp');

function criarBotao(texto, rotulo, acao, identificador, classe) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = texto;
  botao.setAttribute('aria-label', rotulo);
  botao.dataset.acao = acao;
  botao.dataset.identificador = identificador;
  if (classe) botao.className = classe;
  return botao;
}

function atualizarCarrinho(mensagem = '') {
  const total = Object.values(carrinho).reduce((soma, quantidade) => soma + quantidade, 0);
  const itensDoPedido = produtos.filter(produto => carrinho[produto.identificador]);
  const mensagemWhatsApp = [
    'Olá, tudo bem?',
    'Queria pedir:',
    '',
    ...itensDoPedido.map((produto, indice) => {
      const quantidade = carrinho[produto.identificador];
      return `${indice + 1}. ${produto.nome} - ${quantidade} ${quantidade === 1 ? 'unidade' : 'unidades'}.`;
    }),
    '',
    'Obrigado!!!'
  ].join('\n');
  abrirCarrinho.hidden = total === 0;
  abrirCarrinho.setAttribute('aria-label', `Abrir carrinho com ${total} ${total === 1 ? 'item' : 'itens'}`);
  document.querySelector('#contador-carrinho').textContent = total;
  document.querySelector('#total-carrinho').textContent = `${total} ${total === 1 ? 'item' : 'itens'}`;
  finalizarPedido.href = total
    ? `https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`
    : '#';
  finalizarPedido.setAttribute('aria-disabled', String(total === 0));
  listaCarrinho.replaceChildren();

  produtos.forEach(produto => {
    const identificador = produto.identificador;
    const quantidade = carrinho[identificador];
    if (!quantidade) return;
    const item = document.createElement('article');
    item.className = 'item-carrinho';
    const titulo = document.createElement('h3');
    titulo.textContent = produto.nome;
    const acoes = document.createElement('div');
    acoes.className = 'acoes-item';
    const controle = document.createElement('div');
    controle.className = 'quantidade-item';
    controle.setAttribute('role', 'group');
    controle.setAttribute('aria-label', `Quantidade de ${produto.nome}`);
    const diminuir = criarBotao('−', `Diminuir ${produto.nome}`, 'diminuir', identificador);
    const numero = document.createElement('span');
    numero.textContent = quantidade;
    const aumentar = criarBotao('+', `Aumentar ${produto.nome}`, 'aumentar', identificador);
    aumentar.disabled = quantidade >= 99;
    controle.append(diminuir, numero, aumentar);
    acoes.append(controle, criarBotao('Remover', `Remover ${produto.nome}`, 'remover', identificador, 'remover-item'));
    item.append(titulo, acoes);
    listaCarrinho.append(item);
  });
  if (!total) {
    const vazio = document.createElement('p');
    vazio.className = 'carrinho-vazio';
    vazio.textContent = 'Seu carrinho está vazio. Escolha um produto para começar.';
    listaCarrinho.append(vazio);
  }
  try { localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho)); } catch { /* Armazenamento opcional. */ }
  avisoCarrinho.textContent = mensagem;
}

document.querySelectorAll('[data-produto]').forEach(botao => {
  botao.addEventListener('click', () => {
    const identificador = botao.dataset.produto;
    const campo = document.querySelector(`#quantidade-${identificador}`);
    if (!campo.reportValidity()) return;
    const quantidade = Number(campo.value);
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) {
      campo.value = '1';
      campo.focus();
      return;
    }
    const anterior = carrinho[identificador] || 0;
    carrinho[identificador] = Math.min(99, anterior + quantidade);
    const nome = produtos.find(produto => produto.identificador === identificador).nome;
    atualizarCarrinho(carrinho[identificador] === anterior ? 'Limite de 99 unidades por produto.' : `${nome} adicionado ao carrinho. Quantidade: ${carrinho[identificador]}.`);
    campo.value = '1';
  });
});

listaCarrinho.addEventListener('click', evento => {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) return;
  const { identificador, acao } = botao.dataset;
  if (acao === 'aumentar') carrinho[identificador] = Math.min(99, carrinho[identificador] + 1);
  if (acao === 'diminuir') carrinho[identificador] -= 1;
  if (acao === 'remover' || carrinho[identificador] <= 0) delete carrinho[identificador];
  atualizarCarrinho('Quantidade do carrinho atualizada.');
  const proximo = listaCarrinho.querySelector(`[data-identificador="${identificador}"][data-acao="${acao}"]:not(:disabled)`)
    || listaCarrinho.querySelector('button:not(:disabled)')
    || document.querySelector('#continuar-comprando');
  proximo.focus();
});

abrirCarrinho.addEventListener('click', () => painelCarrinho.showModal());
document.querySelector('.fechar-carrinho').addEventListener('click', () => painelCarrinho.close());
document.querySelector('#continuar-comprando').addEventListener('click', () => painelCarrinho.close());
painelCarrinho.addEventListener('click', evento => {
  if (evento.target !== painelCarrinho) return;
  const limites = painelCarrinho.getBoundingClientRect();
  if (evento.clientX < limites.left || evento.clientX > limites.right || evento.clientY < limites.top || evento.clientY > limites.bottom) painelCarrinho.close();
});
painelCarrinho.addEventListener('close', () => {
  if (abrirCarrinho.hidden) document.querySelector('[data-produto]').focus();
});

document.querySelectorAll('.imagem-produto img').forEach(imagem => {
  const mostrarAviso = () => {
    imagem.hidden = true;
    imagem.nextElementSibling.hidden = false;
  };
  imagem.addEventListener('error', mostrarAviso);
  if (imagem.complete && !imagem.naturalWidth) mostrarAviso();
});
atualizarCarrinho();
