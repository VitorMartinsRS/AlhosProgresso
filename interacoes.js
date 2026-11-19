const receitas = [{ titulo: 'Arroz com alho', ingredientes: '1 xícara de arroz, 2 dentes de alho picados, 1 colher de sopa de óleo, 2 xícaras de água quente e sal a gosto.', etapas: ['Aqueça o óleo e refogue o alho em fogo baixo, sem deixar queimar.', 'Adicione o arroz e mexa por um minuto. Junte a água quente e o sal.', 'Cozinhe em fogo baixo, com a panela parcialmente tampada, até a água secar e o arroz ficar macio. Deixe descansar antes de servir.'] }, { titulo: 'Macarrão alho e óleo', ingredientes: '200 g de macarrão, 3 dentes de alho fatiados, 3 colheres de sopa de azeite, sal e salsinha a gosto.', etapas: ['Cozinhe o macarrão em água com sal conforme a embalagem. Reserve um pouco da água do cozimento.', 'Aqueça o azeite e doure levemente o alho em fogo baixo.', 'Junte o macarrão escorrido e um pouco da água reservada. Misture, finalize com salsinha e sirva.'] }, { titulo: 'Pão com manteiga de alho', ingredientes: '1 baguete pequena, 2 colheres de sopa de manteiga amolecida, 2 dentes de alho bem picados e salsinha a gosto.', etapas: ['Misture a manteiga, o alho e a salsinha.', 'Corte o pão em fatias, sem separar completamente a base, e espalhe a mistura entre elas.', 'Leve ao forno preaquecido a 180 °C por cerca de 10 a 15 minutos, até dourar. Sirva ainda quente.'] }];

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

// As quantidades do carrinho são unidades inteiras, entre 1 e 99, por embalagem.
const produtos = [
    { identificador: 'mix', nome: 'Mix', variantes: [{ identificador: 'mix-250g', embalagem: '250 g', preco: 19.90 }, { identificador: 'mix-500g', embalagem: '500 g', preco: 34.90 }] },
    { identificador: 'cheiro-verde', nome: 'Cheiro-verde', variantes: [{ identificador: 'cheiro-verde-250g', embalagem: '250 g', preco: 16.90 }] },
    { identificador: 'calabacon', nome: 'Calabacon', variantes: [{ identificador: 'calabacon-250g', embalagem: '250 g', preco: 18.90 }] },
    { identificador: 'descascado', nome: 'Alho descascado', variantes: [{ identificador: 'descascado-1kg', embalagem: '1 kg', preco: 38.90 }, { identificador: 'descascado-500g', embalagem: '500 g', preco: 19.90 }] },
    { identificador: 'puro', nome: 'Alho puro', variantes: [{ identificador: 'puro-250g', embalagem: '250 g', preco: 16.90 }, { identificador: 'puro-500g', embalagem: '500 g', preco: 29.90 }] }
];
const variantes = produtos.flatMap(produto =>
    produto.variantes.map(variante => ({ ...variante, produto }))
);
const formatarPreco = valor => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const chaveCarrinho = 'alhos-progresso-carrinho';
const telefoneWhatsApp = '5511943441746';
const carrinho = {};

const janelaQuantidade = document.createElement('dialog');
janelaQuantidade.className = 'janela-quantidade';
janelaQuantidade.setAttribute('aria-labelledby', 'titulo-quantidade');

const fecharQuantidade = document.createElement('button');
fecharQuantidade.type = 'button';
fecharQuantidade.className = 'fechar';
fecharQuantidade.setAttribute('aria-label', 'Fechar');
fecharQuantidade.textContent = '×';

const chamadaQuantidade = document.createElement('p');
chamadaQuantidade.className = 'chamada';
chamadaQuantidade.textContent = 'ALHOS PROGRESSO';

const tituloQuantidade = document.createElement('h2');
tituloQuantidade.id = 'titulo-quantidade';

const formularioQuantidade = document.createElement('form');
formularioQuantidade.className = 'formulario-quantidade';

const rotuloVariacao = document.createElement('label');
rotuloVariacao.htmlFor = 'variacao-pedido';
rotuloVariacao.textContent = 'Escolha a embalagem:';

const campoVariacao = document.createElement('div');
campoVariacao.id = 'variacao-pedido';
campoVariacao.className = 'opcoes-embalagem';
campoVariacao.setAttribute('role', 'group');
campoVariacao.setAttribute('aria-label', 'Escolha a embalagem');
rotuloVariacao.append(campoVariacao);

const rotuloQuantidade = document.createElement('label');
rotuloQuantidade.htmlFor = 'campo-quantidade-pedido';
rotuloQuantidade.append(document.createTextNode('Qual quantidade você deseja?'));

const campoQuantidade = document.createElement('input');
campoQuantidade.id = 'campo-quantidade-pedido';
campoQuantidade.className = 'campo-quantidade';
campoQuantidade.type = 'number';
campoQuantidade.min = '1';
campoQuantidade.max = '99';
campoQuantidade.step = '1';
campoQuantidade.value = '1';
campoQuantidade.required = true;
campoQuantidade.setAttribute('aria-label', 'Quantidade, de 1 a 99');
rotuloQuantidade.append(campoQuantidade);

const confirmarQuantidade = document.createElement('button');
confirmarQuantidade.type = 'submit';
confirmarQuantidade.className = 'botao-comprar';
confirmarQuantidade.textContent = 'Adicionar ao carrinho';

const cancelarQuantidade = document.createElement('button');
cancelarQuantidade.type = 'button';
cancelarQuantidade.className = 'botao-secundario';
cancelarQuantidade.textContent = 'Cancelar';

formularioQuantidade.append(rotuloVariacao, rotuloQuantidade, confirmarQuantidade, cancelarQuantidade);
janelaQuantidade.append(fecharQuantidade, chamadaQuantidade, tituloQuantidade, formularioQuantidade);
document.body.append(janelaQuantidade);

try {
    const salvo = JSON.parse(localStorage.getItem(chaveCarrinho) || '{}');
    if (salvo && typeof salvo === 'object') {
        variantes.forEach(variante => {
            const quantidade = salvo[variante.identificador];
            if (Number.isInteger(quantidade) && quantidade > 0 && quantidade <= 99) {
                carrinho[variante.identificador] = quantidade;
            }
        });
        produtos.forEach(produto => {
            const quantidade = salvo[produto.identificador];
            const jaTemVariante = produto.variantes.some(variante => carrinho[variante.identificador]);
            if (!jaTemVariante && Number.isInteger(quantidade) && quantidade > 0 && quantidade <= 99) {
                carrinho[produto.variantes[0].identificador] = quantidade;
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
    const itensDoPedido = variantes.filter(variante => carrinho[variante.identificador]);
    const subtotal = itensDoPedido.reduce((soma, variante) =>
        soma + variante.preco * carrinho[variante.identificador], 0
    );
    const mensagemWhatsApp = [
        'Olá, tudo bem?',
        'Queria pedir:',
        '',
        ...itensDoPedido.map((variante, indice) => {
            const quantidade = carrinho[variante.identificador];
            return `${indice + 1}. ${variante.produto.nome} | Peso: ${variante.embalagem} | Quantidade: ${quantidade} | Valor unitário: ${formatarPreco(variante.preco)} | Total: ${formatarPreco(variante.preco * quantidade)}.`;
        }),
        '',
        `Subtotal: ${formatarPreco(subtotal)}`,
        'Obrigado!!!'
    ].join('\n');
    abrirCarrinho.hidden = total === 0;
    abrirCarrinho.setAttribute('aria-label', `Abrir carrinho com ${total} ${total === 1 ? 'item' : 'itens'}`);
    document.querySelector('#contador-carrinho').textContent = total;
    document.querySelector('#total-carrinho').textContent = `${total} ${total === 1 ? 'item' : 'itens'}`;
    document.querySelector('#subtotal-carrinho').textContent = formatarPreco(subtotal);
    finalizarPedido.href = total ?
        `https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}` :
        '#';
    finalizarPedido.setAttribute('aria-disabled', String(total === 0));
    listaCarrinho.replaceChildren();

    variantes.forEach(variante => {
        const identificador = variante.identificador;
        const quantidade = carrinho[identificador];
        if (!quantidade) return;
        const item = document.createElement('article');
        item.className = 'item-carrinho';
        const titulo = document.createElement('h3');
        titulo.textContent = `${variante.produto.nome} — ${variante.embalagem}`;
        const preco = document.createElement('p');
        preco.className = 'preco-item-carrinho';
        preco.textContent = `${quantidade} x ${formatarPreco(variante.preco)} = ${formatarPreco(variante.preco * quantidade)}`;
        const acoes = document.createElement('div');
        acoes.className = 'acoes-item';
        const controle = document.createElement('div');
        controle.className = 'quantidade-item';
        controle.setAttribute('role', 'group');
        controle.setAttribute('aria-label', `Quantidade de ${variante.produto.nome}, ${variante.embalagem}`);
        const diminuir = criarBotao('−', `Diminuir ${variante.produto.nome}, ${variante.embalagem}`, 'diminuir', identificador);
        const numero = document.createElement('span');
        numero.textContent = quantidade;
        const aumentar = criarBotao('+', `Aumentar ${variante.produto.nome}, ${variante.embalagem}`, 'aumentar', identificador);
        aumentar.disabled = quantidade >= 99;
        controle.append(diminuir, numero, aumentar);
        acoes.append(controle, criarBotao('Remover', `Remover ${variante.produto.nome}, ${variante.embalagem}`, 'remover', identificador, 'remover-item'));
        item.append(titulo, preco, acoes);
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
        const produto = produtos.find(item => item.identificador === identificador);
        if (!produto) return;
        tituloQuantidade.textContent = produto.nome;
        janelaQuantidade.dataset.identificador = identificador;
        campoVariacao.replaceChildren(...produto.variantes.map((variante, indice) => {
            const opcao = document.createElement('button');
            opcao.type = 'button';
            opcao.className = 'botao-embalagem';
            opcao.dataset.variacao = variante.identificador;
            opcao.setAttribute('aria-pressed', String(indice === 0));
            opcao.textContent = `${variante.embalagem} — ${formatarPreco(variante.preco)}`;
            if (indice === 0) opcao.classList.add('selecionado');
            return opcao;
        }));
        janelaQuantidade.dataset.variacao = produto.variantes[0].identificador;
        campoQuantidade.value = '1';
        janelaQuantidade.showModal();
        campoVariacao.querySelector('button').focus();
    });
});

campoVariacao.addEventListener('click', evento => {
    const botao = evento.target.closest('button[data-variacao]');
    if (!botao) return;
    janelaQuantidade.dataset.variacao = botao.dataset.variacao;
    campoVariacao.querySelectorAll('button[data-variacao]').forEach(opcao => {
        const selecionado = opcao === botao;
        opcao.setAttribute('aria-pressed', String(selecionado));
        opcao.classList.toggle('selecionado', selecionado);
    });
});

formularioQuantidade.addEventListener('submit', evento => {
    evento.preventDefault();
    if (!campoQuantidade.reportValidity()) return;
    const quantidade = Number(campoQuantidade.value);
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) return;

    const identificador = janelaQuantidade.dataset.variacao;
    const variante = variantes.find(item => item.identificador === identificador);
    if (!variante || variante.produto.identificador !== janelaQuantidade.dataset.identificador) return;
    const anterior = carrinho[identificador] || 0;
    carrinho[identificador] = Math.min(99, anterior + quantidade);
    atualizarCarrinho(carrinho[identificador] === anterior ? 'Limite de 99 unidades por embalagem.' : `${variante.produto.nome} (${variante.embalagem}) adicionado ao carrinho. Quantidade: ${carrinho[identificador]}.`);
    janelaQuantidade.close();
});

fecharQuantidade.addEventListener('click', () => janelaQuantidade.close());
cancelarQuantidade.addEventListener('click', () => janelaQuantidade.close());
janelaQuantidade.addEventListener('click', evento => {
    if (evento.target !== janelaQuantidade) return;
    const limites = janelaQuantidade.getBoundingClientRect();
    if (evento.clientX < limites.left || evento.clientX > limites.right ||
        evento.clientY < limites.top || evento.clientY > limites.bottom) {
        janelaQuantidade.close();
    }
});

listaCarrinho.addEventListener('click', evento => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao) return;
    const { identificador, acao } = botao.dataset;
    if (acao === 'aumentar') carrinho[identificador] = Math.min(99, carrinho[identificador] + 1);
    if (acao === 'diminuir') carrinho[identificador] -= 1;
    if (acao === 'remover' || carrinho[identificador] <= 0) delete carrinho[identificador];
    atualizarCarrinho('Quantidade do carrinho atualizada.');
    const proximo = listaCarrinho.querySelector(`[data-identificador="${identificador}"][data-acao="${acao}"]:not(:disabled)`) ||
        listaCarrinho.querySelector('button:not(:disabled)') ||
        document.querySelector('#continuar-comprando');
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