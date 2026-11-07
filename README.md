# CodeLab Web — React

IDE web para praticar Kotlin, C e Java, migrada para React + Vite.

## Executar localmente

```bash
npm install
npm run dev
```

## Gerar versão de produção

```bash
npm run build
npm run preview
```

A pasta `dist` é o diretório de publicação na Vercel. Importe o repositório e use o preset Vite; o comando de build é `npm run build` e o diretório de saída é `dist`.

## Recursos

- Editor de código com numeração de linhas, indentação por Tab e atalho Ctrl+Enter.
- Arquivos e pastas, seleção, criação, renomeação/movimentação e exclusão.
- Salvamento automático em `localStorage` e salvamento manual.
- Importação e exportação de projetos ZIP.
- Entrada padrão (stdin) e execução remota de Kotlin, C e Java via Piston API.
- Desafios de programação com filtros.
- Interface adaptável e componentes/estado gerenciados pelo React.

## Observações

Os arquivos ficam apenas no armazenamento local do navegador. Faça backups com Exportar ZIP. A execução depende de internet e da disponibilidade da API pública Piston; o código e o stdin são enviados a esse serviço. Não envie segredos ou código confidencial.
