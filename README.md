# CodeLab Web — versão Vercel (sem Render)

IDE estática para Kotlin, C e Java. A interface pode ser publicada na Vercel sem backend próprio. Projetos, pastas e arquivos ficam no `localStorage` do navegador. É possível criar, renomear/mover, excluir, importar e exportar arquivos em ZIP.

## Importante: como a execução funciona

O navegador não compila nativamente Kotlin/JVM, C e Java. Para manter a execução sem Render ou outro backend próprio, esta versão chama a API pública Piston (`https://emkc.org/api/v2/piston`) diretamente do navegador. Portanto:

- é necessário estar conectado à internet;
- a execução depende da disponibilidade, CORS, limites e runtimes oferecidos pela API externa;
- o código-fonte e o stdin são enviados ao serviço Piston para compilação/execução;
- não envie senhas, tokens, chaves ou código confidencial;
- se o serviço bloquear chamadas do browser ou ficar indisponível, a execução não funcionará até usar outro provedor ou um backend próprio.

Os arquivos e projetos não são enviados à Vercel nem sincronizados entre dispositivos: ficam no armazenamento local do navegador. Limpar dados do navegador pode apagá-los. Use **Exportar ZIP** para fazer backup.

## Publicar na Vercel

1. Extraia o ZIP.
2. Crie um repositório no GitHub e envie o conteúdo desta pasta.
3. Na Vercel, clique em **Add New → Project** e importe o repositório.
4. Configure:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: deixe vazio
   - Output Directory: `public`
   - Install Command: deixe vazio
5. Clique em **Deploy**.

O `vercel.json` na raiz mantém o projeto como site estático. Não há API serverless nem serviço Render.

## Rodar localmente

Como é um site estático, pode abrir `public/index.html` diretamente no navegador. Para testar com servidor local, com Node.js instalado:

```bash
npx serve public -l 4173
```

Acesse `http://localhost:4173`.

## Recursos

- Explorador de arquivos e pastas;
- criar arquivos e pastas;
- renomear/mover e excluir arquivos;
- salvamento automático no `localStorage`;
- importação e exportação de projetos ZIP;
- Kotlin, C e Java com entrada padrão (stdin);
- desafios de lógica;
- layout responsivo inspirado no VS Code;
- implantação estática na Vercel.

## Estrutura

```text
CodeLab-Web-Vercel/
├── public/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── vercel.json
├── package.json
└── README.md
```
