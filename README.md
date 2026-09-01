# GameGrid

Uma loja fictícia de jogos para PC, desenvolvida em HTML, CSS e JavaScript, com catálogo dinâmico, busca por gênero, página de detalhes, carrinho de compras e fluxo de checkout.

## Visão geral

O GameGrid é um projeto front-end de uma vitrine de jogos inspirada em lojas digitais, com foco em uma experiência simples, responsiva e funcional. O catálogo de produtos é carregado a partir de um arquivo JSON, permitindo fácil manutenção e expansão do inventário.

## Funcionalidades

- Catálogo de jogos com carrossel de capas e informações detalhadas
- Busca por nome e filtro por gênero
- Pagina de detalhes do produto com galeria de imagens
- Carrinho de compras persistente em LocalStorage
- Cálculo de desconto por quantidade de itens
- Tema claro/escuro
- Fluxo de checkout com formulário de pagamento
- Página de confirmação/feedback após a compra

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript vanilla
- LocalStorage para persistência local
- JSON para armazenamento do catálogo

## Estrutura do projeto

```text
.
├── app.js
├── carrinho.html
├── checkout.html
├── como-fiz.html
├── feedback.html
├── index.html
├── products.json
├── produto.html
├── style.css
├── GameGridClaro.png
├── GameGridEscuro.png
└── README.md
```

## Demonstração

Você pode visualizar o projeto em funcionamento pelo GitHub Pages:

https://hiago-21.github.io/Loja-Virtual/

## Como funciona

- A página inicial lista os jogos disponíveis.
- O usuário pode buscar por nome ou categoria.
- Ao clicar em um jogo, é aberta a página de detalhes.
- O produto pode ser adicionado ao carrinho.
- O carrinho calcula subtotal, descontos e total da compra.
- O checkout coleta os dados do cliente e finaliza a compra.
- As informações ficam salvas localmente no navegador via LocalStorage.

## Arquivos principais

- `index.html`: página inicial da loja
- `produto.html`: página de detalhes do jogo
- `carrinho.html`: gerenciamento do carrinho
- `checkout.html`: formulário de finalização da compra
- `feedback.html`: página de confirmação após o pedido
- `app.js`: lógica da aplicação
- `products.json`: base de dados dos produtos
- `style.css`: estilos visuais da interface

## Observações

- Este projeto foi pensado como um estudo de front-end e loja fictícia.
- Não há backend ou integração com pagamentos reais.
- A lógica de compra é simulada no navegador.

## Licença

Este projeto está disponível para fins educacionais e de portfólio. Sinta-se livre para usar, adaptar e melhorar o código.

## Autor

Projeto desenvolvido como exercício de estudo e apresentação de portfólio.
