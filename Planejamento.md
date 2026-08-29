# Planejamento da GameGrid

Checklist de acompanhamento da construção e da entrega da loja virtual.

## Legenda

- [x] Implementado
- [~] Implementado parcialmente ou ainda precisa ser validado
- [ ] Ainda não implementado

## 1. Base do projeto

### Já implementei

- [x] Defini o tema da loja: jogos digitais para PC.
- [x] Criei a identidade da loja com o nome GameGrid.
- [x] Separei a estrutura em HTML, CSS, JavaScript e JSON.
- [x] Mantive os produtos fora do HTML para a vitrine ser montada pelo JavaScript.
- [x] Criei as páginas da loja, produto, carrinho, checkout, confirmação e como-fiz.

### Implementei parcialmente

- [~] A página `como-fiz.html` está criada, mas ainda falta inserir o vídeo da apresentação.
- [x] Publiquei o projeto no GitHub Pages e confirmei que a loja funciona em uma URL pública.

### Ainda preciso implementar

- [x] Escolher a hospedagem gratuita e publicar o projeto no GitHub Pages.
- [x] Testar a loja publicada e confirmar o funcionamento do `fetch` de `products.json`.
- [x] Validei todos os fluxos em aba anônima e no celular.

## 2. Catálogo e headless commerce

### Já implementei

- [x] Criei o arquivo `products.json` separado do front-end.
- [x] Cadastrei 50 jogos, acima do mínimo de 6 produtos.
- [x] Incluí nome, descrição, ano, preço, requisitos, capa e galeria.
- [x] Organizei os gêneros em várias categorias por produto.
- [x] Atualizei as galerias com screenshots de gameplay.
- [x] Carreguei o catálogo com `fetch("products.json")` em `app.js`.
- [x] Montei os cards dinamicamente a partir dos dados do JSON.

### Implementei parcialmente

- [x] Verifiquei as imagens externas na hospedagem e todas carregaram corretamente.
- [~] Ainda preciso preparar uma explicação clara sobre por que separar catálogo e interface caracteriza um conceito de headless commerce.

### Ainda preciso implementar

- [x] Criei uma estratégia de fallback caso uma imagem externa não carregue.
- [ ] Avaliar o uso de imagens locais ou de um CDN próprio para reduzir dependências externas.

## 3. Busca, categorias e vitrine

### Já implementei

- [x] Criei busca por nome, descrição e categoria.
- [x] Permiti filtrar jogos por qualquer categoria cadastrada.
- [x] Organizei as categorias dentro de um painel expansível para não poluir a barra de pesquisa.
- [x] Adicionei estado visual para a categoria selecionada.
- [x] Criei mensagem para quando nenhum jogo for encontrado.
- [x] Mostrei a quantidade de jogos encontrados.
- [x] Adicionei cards com capa, categorias, ano, descrição, preço e link para o produto.

### Implementei parcialmente

- [x] Testei combinações de busca e categoria em diferentes tamanhos de tela.
- [x] Revisei os textos longos e confirmei que não quebram o layout no celular.

### Ainda preciso implementar

- [ ] Adicionar ordenação por preço, nome ou lançamento, caso seja útil para a demonstração.

## 4. Página do produto e galeria

### Já implementei

- [x] Leio o ID do produto com `URLSearchParams`.
- [x] Exibo nome, descrição, categorias, ano, preço e requisitos.
- [x] Adicionei a capa principal do jogo.
- [x] Adicionei uma galeria com screenshots de gameplay.
- [x] Permiti trocar a imagem principal ao clicar nas miniaturas.
- [x] Separei visualmente o link de retorno, categorias e informações do produto.
- [x] Criei mensagem para ID de produto inexistente.

### Implementei parcialmente

- [x] Testei os 50 produtos e confirmei que capas e screenshots carregam corretamente.
- [~] Preciso conferir o carregamento das imagens em conexão lenta.

### Ainda preciso implementar

- [x] Adicionei tratamento visual para imagem quebrada.
- [ ] Adicionar navegação da galeria por teclado e botões de anterior/próxima, se necessário.

## 5. Carrinho e checkout fictício

### Já implementei

- [x] Salvo os IDs dos produtos no `localStorage`.
- [x] Permito adicionar um jogo ao carrinho.
- [x] Permito remover jogos do carrinho.
- [x] Calculo e exibo o total da compra.
- [x] Mostro a quantidade de itens no cabeçalho.
- [x] Criei o formulário de nome, e-mail e forma de pagamento.
- [x] Criei telas demonstrativas para cartão, Pix e boleto.
- [x] Incluí produtos e preços no boleto fictício.
- [x] Incluí um QR Code visual no painel de Pix.
- [x] Criei a página de confirmação da compra.

### Implementei parcialmente

- [~] O checkout é apenas demonstrativo e não processa pagamentos reais.
- [~] O QR Code é visual e não representa uma cobrança Pix válida.
- [~] O boleto possui aparência de demonstração, mas não é registrado nem pagável.
- [~] O carrinho não possui controle de quantidade, pois cada jogo pode ser adicionado apenas uma vez.
- [x] A confirmação mostra um resumo do pedido e gera um número de pedido fictício.

### Ainda preciso implementar

- [ ] Decidir e explicar no vídeo que o pagamento é propositalmente fictício.
- [x] Bloquear o acesso ao checkout quando o carrinho estiver vazio.
- [x] Salvar um resumo do pedido no `localStorage` antes de limpar o carrinho.

## 6. Identidade visual e responsividade

### Já implementei

- [x] Criei variáveis CSS para cores, superfícies, bordas e sombras.
- [x] Defini tema claro com branco e laranja.
- [x] Criei tema escuro com cinza escuro e azul.
- [x] Salvei a preferência de tema no `localStorage`.
- [x] Criei layout responsivo para vitrine, produto, formulário e rodapé.
- [x] Ajustei capas e screenshots para preservar proporções e evitar recortes.
- [x] Estilizei o painel de categorias e sua barra de rolagem.

### Implementei parcialmente

- [x] Revisei contraste, foco de teclado e legibilidade no Lighthouse.
- [x] Conferi visualmente desktop e celular após a publicação.

### Ainda preciso implementar

- [x] Corrigi eventuais problemas de acessibilidade encontrados pelo Lighthouse.
- [x] Adicionei estados de carregamento e erro para o catálogo.

### Validação concluída

- [x] Corrigi o contraste dos textos secundários e confirmei 100% de eficácia no Lighthouse.
- [x] Reservei o espaço das imagens e ajustei o carregamento das capas para evitar deslocamento visual.

## 7. Requisitos da entrega

### Já implementei

- [x] A loja é um site estático feito com HTML, CSS e JavaScript.
- [x] A busca e o filtro por categoria funcionam na vitrine.
- [x] O catálogo é carregado via `fetch` e não está hardcodado no HTML.
- [x] A identidade visual e o tema da loja são próprios.

### Ainda preciso implementar ou concluir

- [x] Publicar uma única URL pública com a loja funcionando no GitHub Pages.
- [x] Adicionar metadescrição nas páginas HTML.
- [x] Otimizar imagens, CLS e carregamento inicial conforme as recomendações do Lighthouse.
- [ ] Inserir o vídeo não listado do YouTube ou Loom em `como-fiz.html`.
- [ ] Gravar um vídeo de 5 a 8 minutos com minha voz e a navegação ao vivo.
- [ ] Mostrar no vídeo a organização dos arquivos e as decisões do projeto.
- [ ] Explicar no vídeo o `products.json`, o `fetch` e o conceito de headless commerce.
- [ ] Explicar no vídeo o caminho navegador → CDN → origem em uma arquitetura AWS.
- [ ] Explicar o papel do cache quando muitas pessoas acessam a loja.
- [ ] Rodar o Lighthouse ao vivo durante a gravação.
- [ ] Comentar os scores do Lighthouse e escolher a primeira melhoria.
- [ ] Explicar onde eu usaria IA na busca, recomendação ou atendimento.
- [ ] Relatar no vídeo a parte mais difícil da construção.
- [x] Conferi a URL em aba anônima e no celular.
- [ ] Publicar no canal do Bootcamp a URL da loja e a URL do repositório.

## 8. Funcionalidades de e-commerce adicionadas

- [x] Adicionei recomendações de jogos relacionados no carrinho (cross-sell).
- [x] Adicionei desconto progressivo de 10% para 2 jogos e 15% para 3 ou mais jogos.
- [x] Mantive o desconto no checkout e no resumo fictício do pedido.
- [x] Impedi que recomendações repitam jogos que já estão no carrinho.

## 9. Bônus possíveis

- [ ] Hospedar o próprio vídeo dentro do site.
- [ ] Criar um desenho da arquitetura com um BFF para um futuro aplicativo mobile.
- [ ] Explicar no vídeo onde entrariam S3, CloudFront, Route 53 e uma origem de aplicação na AWS.

## Próxima sequência de trabalho

1. [x] Validar no celular e em aba anônima os filtros, a galeria, o carrinho e o checkout.
2. [x] Implementar o bloqueio do checkout com carrinho vazio.
3. [x] Salvar um resumo do pedido no `localStorage` antes de limpar o carrinho.
4. [x] Conferir se todas as imagens externas carregam e definir um fallback para imagens quebradas.
5. [ ] Fazer a entrega com a URL pública e o repositório.

Gravar e inserir o vídeo em como-fiz.html, pois é o maior requisito ainda não iniciado.
Fazer a entrega final: testar a URL pública, atualizar o Planejamento.md e publicar as URLs no canal do Bootcamp.