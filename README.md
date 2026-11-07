# Quick Quizz — Passaporte do Explorador do Sul

Quiz educativo estático, feito com HTML, CSS e JavaScript puro, preparado para publicação no GitHub Pages. A identidade visual usa a referência ilustrada do Passaporte do Explorador do Sul e carimbos dos três estados da Região Sul.

## Arquivos

- `index.html`: estrutura das telas.
- `styles.css`: identidade visual inspirada em papel de passaporte, com cores do Paraná, de Santa Catarina e do Rio Grande do Sul.
- `app.js`: carregamento das perguntas, navegação, pontuação e desbloqueio da recompensa.
- `questions.json`: conteúdo do quiz.
- `assets/passaporte-explorador.png`: imagem do passaporte usada na tela inicial e como recompensa.
- `assets/carimbo-*.png`: carimbos ilustrados dos três estados.

## Recompensa do passaporte

Ao acertar todas as perguntas da rodada (100% de aproveitamento), o quiz mantém o troféu e exibe também o Passaporte do Explorador do Sul, acompanhado dos três carimbos regionais. Se o participante escolher uma categoria específica, a recompensa é concedida ao acertar todas as perguntas daquela rodada.

## Como cadastrar perguntas

`questions.json` deve conter um array de objetos neste formato:

```json
[
  {
    "id": "itaipu-001",
    "category": "Usina Hidrelétrica de Itaipu",
    "question": "Por que a Usina de Itaipu é considerada binacional?",
    "options": [
      "Porque ela é administrada conjuntamente pelo Brasil e pelo Paraguai.",
      "Porque ela foi construída bem no meio do Oceano Atlântico.",
      "Porque funciona apenas com energia solar e eólica.",
      "Porque pertence aos Estados Unidos e ao Japão."
    ],
    "correctAnswer": 0,
    "explanation": "Itaipu é binacional porque Brasil e Paraguai compartilham sua administração."
  }
]
```

### Campos

- `id` (opcional): identificador da pergunta.
- `category` (obrigatório): nome da categoria exibida no quiz.
- `question` (obrigatório): enunciado da pergunta.
- `options` (obrigatório): lista com pelo menos duas alternativas.
- `correctAnswer` (obrigatório): índice da alternativa correta, começando em zero.
- `explanation` (opcional): explicação ou curiosidade exibida após a resposta.

O arquivo `questions.json` precisa ser JSON válido: use aspas duplas nas chaves e textos e não coloque vírgula depois do último item.

## Publicar no GitHub Pages

1. Envie os arquivos e a pasta `assets/` para a raiz do repositório `augustonildo/quick-quizz`.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/ (root)` e salve.
5. Aguarde o GitHub publicar o site. O endereço esperado é `https://augustonildo.github.io/quick-quizz/`.

Como o site carrega as perguntas com `fetch`, teste-o por uma URL servida por HTTP, como o GitHub Pages. Abrir `index.html` diretamente como arquivo local (`file://`) não é um teste confiável.

## Observações

- Não é necessário backend ou banco de dados.
- A pontuação é calculada no navegador e não é armazenada nem enviada a um servidor.
- Para alterar perguntas, edite somente `questions.json` e faça commit.
- Para alterar ou substituir as ilustrações, mantenha os mesmos caminhos e nomes dentro de `assets/`, ou atualize os `src` correspondentes no `index.html`.
