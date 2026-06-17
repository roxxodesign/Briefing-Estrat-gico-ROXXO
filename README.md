# ROXXO Design — Briefing Premium

Formulário de briefing premium para captação de clientes.

---

## O QUE VOCÊ PRECISA CRIAR (contas e chaves)

Antes de publicar, você precisa de:

1. **Conta na Vercel** (gratuita) → vercel.com
2. **Conta no Resend** (gratuita) → resend.com
3. **Conta no GitHub** (gratuita) → github.com
4. **Google Sheets** (opcional — para planilha de leads)

---

## PASSO 1 — Criar conta no Resend e pegar a API Key

1. Acesse **resend.com** e clique em **Sign Up**
2. Faça login com Google
3. No painel, clique em **API Keys** no menu lateral
4. Clique em **Create API Key**
5. Dê um nome (ex: "roxxo-briefing") e clique em **Add**
6. **Copie a chave** que aparece (começa com `re_...`) — você só verá ela uma vez!

> ⚠️ No plano gratuito do Resend, você só pode enviar e-mails para o seu próprio e-mail cadastrado até verificar um domínio. Funciona perfeitamente para começar.

---

## PASSO 2 — Configurar domínio no Resend (para enviar com seu domínio)

1. No Resend, clique em **Domains**
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `roxxodesign.com`)
4. Siga as instruções para adicionar os registros DNS no seu provedor
5. Aguarde a verificação (pode levar alguns minutos)

Se não tiver domínio ainda, use: `FROM=onboarding@resend.dev` (funciona no plano gratuito para testes).

---

## PASSO 3 — Criar planilha no Google Sheets (opcional)

Para receber os leads em uma planilha automaticamente:

### 3a. Criar a planilha
1. Acesse **sheets.google.com**
2. Crie uma nova planilha em branco
3. Nomeie ela como "Leads ROXXO"

### 3b. Criar o script webhook
1. Na planilha, clique em **Extensões → Apps Script**
2. Apague tudo que aparecer e cole este código:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Se a planilha está vazia, criar cabeçalhos
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(Object.keys(data));
    }
    
    sheet.appendRow(Object.values(data));
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Clique em **Salvar** (ícone de disquete)
4. Clique em **Implantar → Nova implantação**
5. Em "Tipo", selecione **App da Web**
6. Em "Executar como", selecione **Eu**
7. Em "Quem tem acesso", selecione **Qualquer pessoa**
8. Clique em **Implantar**
9. Autorize o acesso quando solicitado
10. **Copie a URL** que aparecer (começa com `https://script.google.com/macros/s/...`)

---

## PASSO 4 — Subir o projeto no GitHub

1. Acesse **github.com** e faça login
2. Clique em **New repository** (botão verde)
3. Nome: `roxxo-briefing`
4. Deixe **Private** marcado
5. Clique em **Create repository**
6. Siga as instruções que o GitHub mostra para fazer upload dos arquivos

> Alternativa mais fácil: instale o **GitHub Desktop** (desktop.github.com) e faça o upload pela interface visual.

---

## PASSO 5 — Publicar na Vercel

1. Acesse **vercel.com** e faça login com sua conta GitHub
2. Clique em **Add New → Project**
3. Encontre o repositório `roxxo-briefing` e clique em **Import**
4. Em **Environment Variables**, adicione as seguintes variáveis:

| Nome | Valor |
|------|-------|
| `RESEND_API_KEY` | sua chave do Resend (re_...) |
| `EMAIL_TO` | contato@roxxodesign.com |
| `EMAIL_FROM` | ROXXO Design \<noreply@roxxodesign.com\> |
| `SHEETS_WEBHOOK_URL` | URL do Google Apps Script (opcional) |

5. Clique em **Deploy**
6. Aguarde o deploy (cerca de 1-2 minutos)
7. Seu site estará disponível em `https://roxxo-briefing.vercel.app`

---

## PASSO 6 — Adicionar seu domínio personalizado

1. No painel da Vercel, acesse seu projeto
2. Clique em **Settings → Domains**
3. Digite seu domínio (ex: `briefing.roxxodesign.com`)
4. Siga as instruções para apontar o DNS
5. A Vercel configura o HTTPS automaticamente

---

## DESENVOLVIMENTO LOCAL (opcional)

Se quiser testar no seu computador antes de publicar:

```bash
# 1. Instale as dependências
npm install

# 2. Copie o arquivo de variáveis
cp .env.example .env.local
# Edite .env.local com suas chaves reais

# 3. Inicie o servidor local
npm run dev

# 4. Acesse http://localhost:3000
```

---

## SUPORTE

Dúvidas? Entre em contato: contato@roxxodesign.com
