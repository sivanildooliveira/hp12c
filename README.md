# HP 12C Calculator

Uma calculadora HP 12C completa e funcional implementada em HTML, CSS e JavaScript puro. Funciona em dispositivos mobile e desktop.

## 🚀 Como Usar

Simplesmente abra o arquivo `index.html` em seu navegador. Não é necessária instalação ou dependências externas.

## ✨ Características

### Visual Autêntico
- Design fiel à HP 12C original
- Visor LCD estilo clássico verde/cinza
- Logo HP 12C no topo
- Indicadores de pilha RPN (X, Y, Z, T)
- Botões com 3 níveis de função (primária, f-laranja, g-azul)
- Cores diferenciadas para tipos de botões
- Efeito 3D realista nos botões

### Responsividade Total
- **Desktop**: Layout centralizado e confortável
- **Mobile Portrait**: Todos os botões visíveis sem scroll
- **Mobile Landscape**: Aproveitamento do espaço horizontal
- Adaptação automática via CSS media queries

## 📖 Funcionalidades

### Sistema RPN (Notação Polonesa Reversa)
A HP 12C usa RPN, que é diferente de calculadoras convencionais:
- Digite o primeiro número e pressione `ENTER`
- Digite o segundo número
- Pressione a operação (+, -, ×, ÷)

**Exemplo**: Para calcular 5 + 3:
1. Digite `5`
2. Pressione `ENTER`
3. Digite `3`
4. Pressione `+`
5. Resultado: `8`

### Operações Básicas
- `+` - Adição
- `-` - Subtração
- `×` - Multiplicação
- `÷` - Divisão
- `CHS` - Troca de sinal
- `EEX` - Entrada de expoente (notação científica)
- `CLx` - Limpar X
- `.` - Ponto decimal
- `⟵` - Backspace

### Funções da Pilha
- `ENTER` - Empilhar valor
- `R↓` - Roll down (rotação da pilha)
- `f` + botão - Acessar função laranja (f)
- `g` + botão - Acessar função azul (g)
- `x⇌y` (f + R↓) - Trocar X e Y

### Funções Matemáticas

#### Funções f (laranja):
- `√x` (f + .) - Raiz quadrada
- `eˣ` (f + +) - Exponencial
- `LN` (f + Σ+) - Logaritmo natural
- `yˣ` (f + 1) - Potência
- `1/x` (f + 2) - Recíproco
- `%` (f + 3) - Percentagem

#### Funções g (azul):
- `Δ%` (g + 3) - Variação percentual
- `x²` (g + CLx) - Quadrado
- `INT` (g + ×) - Parte inteira
- `FRAC` (g + ÷) - Parte fracionária
- `12×` (g + i) - Multiplicar por 12
- `12÷` (g + i) - Dividir por 12

### Funções Financeiras (TVM)

A HP 12C pode resolver problemas de valor do dinheiro no tempo. Você precisa fornecer 4 dos 5 valores:

- `n` - Número de períodos
- `i` - Taxa de juros por período (em %)
- `PV` - Valor Presente (Present Value)
- `PMT` - Pagamento (Payment)
- `FV` - Valor Futuro (Future Value)

**Exemplo**: Calcular o valor futuro de um investimento
- 12 meses (n): Digite `12`, pressione `n`
- 1.5% ao mês (i): Digite `1.5`, pressione `i`
- Investimento inicial de R$ 1000 (PV): Digite `1000`, `CHS`, pressione `PV` (negativo porque é saída de dinheiro)
- Sem pagamentos mensais: Digite `0`, pressione `PMT`
- Calcular FV: Pressione `FV`

### Funções de Memória
- `STO` + dígito (0-9) - Armazenar em memória
- `RCL` + dígito (0-9) - Recuperar da memória

**Exemplo**:
1. Digite `100`
2. Pressione `STO` e depois `5` (armazena 100 no registro 5)
3. Digite `200`
4. Pressione `RCL` e depois `5` (recupera 100)
5. Pressione `+` (resultado: 300)

### Controle de Casas Decimais
- `f` + dígito (0-9) - Define número de casas decimais
- Exemplo: `f` + `2` mostra 2 casas decimais

### Suporte ao Teclado
- Números `0-9` - Dígitos
- `+` `-` `*` `/` - Operações
- `Enter` - ENTER
- `.` - Ponto decimal
- `Backspace` - Limpar X
- `Escape` - ON (reset)

## 🎯 Exemplos de Uso

### Exemplo 1: Cálculo simples
**Calcular (8 + 2) × 5**
1. Digite `8` `ENTER` `2` `+` (resultado: 10)
2. Digite `5` `×` (resultado: 50)

### Exemplo 2: Percentual
**Calcular 15% de 200**
1. Digite `200` `ENTER`
2. Digite `15`
3. Pressione `f` depois `%` (resultado: 30)

### Exemplo 3: Potência
**Calcular 2³**
1. Digite `2` `ENTER`
2. Digite `3`
3. Pressione `f` depois `1` (yˣ) (resultado: 8)

### Exemplo 4: Financeiro
**Empréstimo: R$ 10.000 em 12 meses a 2% a.m. Qual o valor da parcela?**
1. `12` `n` (12 meses)
2. `2` `i` (2% ao mês)
3. `10000` `PV` (valor emprestado)
4. `0` `FV` (sem valor final)
5. `PMT` (calcula a parcela)

## 🛠️ Estrutura do Projeto

```
hp12c/
├── index.html    # Estrutura HTML da calculadora
├── style.css     # Estilos e responsividade
├── script.js     # Lógica da calculadora (RPN, TVM, funções)
└── README.md     # Este arquivo
```

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (versões modernas)
- ✅ Dispositivos mobile (iOS e Android)
- ✅ Tablets
- ✅ Desktop

## 🎨 Tecnologias

- HTML5
- CSS3 (Grid, Flexbox, Media Queries)
- JavaScript ES6+ (Vanilla, sem frameworks)

## 📄 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido com ❤️ para fãs da HP 12C**