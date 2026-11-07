# Quick Quizz — Expedição do Saber

Quiz educativo estático, feito com HTML, CSS e JavaScript puro. Preparado para publicação no GitHub Pages.

## Arquivos

- `index.html`: estrutura das telas.
- `styles.css`: estilos e layout responsivo.
- `app.js`: carregamento das perguntas, navegação e pontuação.
- `questions.json`: conteúdo do quiz. Adicione as perguntas neste arquivo.

## Como cadastrar perguntas

`questions.json` deve conter um array de objetos neste formato:

```json
[
  {
    "id": "paleo-001",
    "category": "Paleontologia",
    "question": "Qual destes animais era um dinossauro?",
    "options": [
      "Megalodonte",
      "Tiranossauro Rex",
      "Mamute",
      "Tigre-dentes-de-sabre"
    ],
    "correctAnswer": 1,
    "explanation": "O Tiranossauro Rex foi um dinossauro carnívoro."
  }
]
```

### Campos

- `id` (opcional): identificador da pergunta.
- `category` (obrigatório): nome da categoria exibida no quiz.
- `question` (obrigatório): enunciado da pergunta.
- `options` (obrigatório): lista com pelo menos duas alternativas.
- `correctAnswer` (obrigatório): índice da alternativa correta, começando em zero. No exemplo, `1` corresponde à segunda alternativa.
- `explanation` (opcional): explicação ou curiosidade exibida após a resposta.

O arquivo `questions.json` precisa ser JSON válido: use aspas duplas nas chaves e textos e não coloque vírgula depois do último item.

## Publicar no GitHub Pages

1. Envie todos os arquivos para a raiz do repositório `augustonildo/quick-quizz`.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/ (root)` e salve.
5. Aguarde o GitHub publicar o site. O endereço será semelhante a `https://augustonildo.github.io/quick-quizz/`.

Como o site carrega as perguntas com `fetch`, teste-o por uma URL servida por HTTP, como o GitHub Pages. Abrir `index.html` diretamente como arquivo local (`file://`) não é um teste confiável.

## Observações

- Não é necessário backend ou banco de dados.
- A pontuação é calculada no navegador e não é armazenada nem enviada a um servidor.
- Para alterar perguntas, edite somente `questions.json` e faça commit. O site usará o conteúdo novo após a atualização do Pages.
