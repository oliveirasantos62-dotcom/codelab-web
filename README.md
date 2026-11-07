# CodeLab Web — Kotlin, C e Java

IDE local com interface inspirada no VS Code. Permite editar código no navegador, enviar entrada padrão (stdin), compilar e executar programas reais usando os compiladores instalados no seu computador.

## Requisitos

- Windows 10/11 (ou Linux/macOS com ajustes nos comandos de instalação)
- Node.js LTS: https://nodejs.org/
- Kotlin: compilador `kotlinc` disponível no PATH
- Java JDK (incluindo `java` e `javac`) disponível no PATH
- GCC (comando `gcc`) disponível no PATH

## Instalação no Windows

1. Instale o Node.js LTS e reinicie o terminal.
2. Instale um JDK, por exemplo Eclipse Temurin 21: https://adoptium.net/temurin/releases/
3. Instale o GCC. Uma opção é MSYS2: https://www.msys2.org/ . No terminal **MSYS2 UCRT64**, execute `pacman -S --needed mingw-w64-ucrt-x86_64-gcc`. Adicione `C:\msys64\ucrt64\bin` ao PATH do Windows.
4. Instale o compilador Kotlin: https://kotlinlang.org/docs/command-line.html . Baixe o compilador, extraia e adicione a pasta `bin` do Kotlin ao PATH. O comando `kotlinc` precisa funcionar.
5. Feche e abra novamente o terminal. Teste `node -v`, `java -version`, `javac -version`, `gcc --version` e `kotlinc -version`.

## Executar

1. Extraia o ZIP.
2. Dê duplo clique em `INICIAR-WINDOWS.bat`.
3. O projeto não precisa baixar dependências npm: usa apenas módulos nativos do Node.js.
4. O navegador abrirá em `http://localhost:4173`.
5. Escolha Kotlin, C ou Java, escreva o código e clique em **Executar**. Use **Entrada (stdin)** para informar dados ao programa.

Também é possível iniciar manualmente:

```bash
npm start
```

Depois acesse http://localhost:4173.

## O que já está incluído

- Editor com numeração de linhas, indentação por Tab e atalho Ctrl+Enter.
- Arquivos de exemplo separados para Kotlin, C e Java.
- Compilação e execução local de verdade, sem API externa ou chave de serviço.
- Entrada padrão (stdin), saída padrão, erros e código de saída.
- Salvamento automático no navegador e botão para salvar/restaurar exemplos.
- Desafios de lógica em níveis iniciante e intermediário.
- Interface responsiva em tema escuro.

## Observações importantes

- A execução é local: o código é compilado e executado no seu próprio computador. Não depende de API pública de compilação.
- Os três toolchains precisam estar instalados e no PATH. O indicador no rodapé mostra se o servidor encontrou os compiladores.
- O editor salva os arquivos no armazenamento local do navegador; isso não é um sistema de pastas real nem sincroniza entre dispositivos.
- O terminal é de saída do programa, não um shell interativo. A entrada do programa é enviada pelo campo stdin antes da execução.
- Este projeto foi pensado para uso local. O servidor escuta somente em `127.0.0.1`; não o exponha publicamente.
- Programas executados têm limite de tempo, mas ainda rodam com as permissões do seu usuário do sistema. Execute apenas código em que confia.

## Estrutura

```text
CodeLab-Web/
├── INICIAR-WINDOWS.bat
├── package.json
├── README.md
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── server/
    └── index.js
```
