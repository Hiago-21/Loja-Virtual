"Atue como um Desenvolvedor Front-end Sênior. Preciso construir uma loja virtual estática de jogos de PC para um desafio de Bootcamp. O nome do projeto será GameGrid.

1. Identidade Visual (CSS):
Crie um arquivo style.css com variáveis de cores (CSS Variables). O tema padrão (Claro) deve ser Branco e Laranja. Implemente uma classe .dark-mode (Tema Escuro) usando Cinza Escuro e Azul. Crie um botão (toggle) no header para alternar entre os temas.

2. Banco de Dados (JSON):
Crie um arquivo products.json com 6 jogos famosos de PC (ex: Cyberpunk 2077, Elden Ring, Stardew Valley, etc). Cada objeto deve ter: id, nome, genero, descricao, anoLancamento, requisitos (mínimos), preco, e uma URL de imagem.

3. Funcionalidades Core (app.js):
O JavaScript deve carregar os produtos via fetch() para simular o conceito de Headless Commerce.
Crie uma barra de pesquisa por texto e botões de filtro por genero que atualizem a vitrine dinamicamente.

4. Estrutura Multi-páginas (HTML):
Me forneça a estrutura base para as seguintes páginas, considerando que os dados devem trafegar via LocalStorage e parâmetros de URL (URLSearchParams):

index.html: Header com toggle de tema, barra de busca, botões de categorias e a div vazia onde o JS injetará os cards dos jogos.

produto.html: Página que lê o ID da URL, busca os dados no JSON e exibe todos os detalhes do jogo (descrição, requisitos) e um botão 'Adicionar ao Carrinho'.

carrinho.html: Lê o LocalStorage, lista os itens, soma o valor e tem o botão 'Ir para Pagamento'.

checkout.html: Formulário de compra fictício.

feedback.html: Mensagem de sucesso.

como-fiz.html: Estrutura simples para eu embedar meu vídeo do YouTube depois.