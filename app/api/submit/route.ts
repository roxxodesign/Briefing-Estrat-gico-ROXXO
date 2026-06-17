import { NextRequest, NextResponse } from 'next/server'

const LABELS: Record<string, string> = {
  name: 'Nome',
  company: 'Empresa',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  business: 'O que vende',
  audience: 'Cliente ideal',
  objective: 'Objetivo',
  services: 'Serviços desejados',
  priority: 'Prioridade principal',
  references: 'Referências visuais',
  budget: 'Orçamento',
  deadline: 'Prazo',
  files: 'Arquivos (Drive)',
  final: 'Definição de sucesso',
}

function label(key: string) {
  return LABELS[key] || key
}

function buildEmailHtml(data: Record<string, string | string[]>): string {
  const rows = Object.entries(data)
    .map(([key, val]) => {
      const value = Array.isArray(val) ? val.join(', ') : val || '—'
      return `
        <tr>
          <td style="padding:10px 18px;background:#13101f;color:#9b7aff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;border-bottom:1px solid #1e1a2e;vertical-align:top;width:150px">
            ${label(key)}
          </td>
          <td style="padding:10px 18px;color:#d4d0f0;font-size:14px;line-height:1.65;border-bottom:1px solid #1e1a2e">
            ${value.replace(/\n/g, '<br>')}
          </td>
        </tr>`
    })
    .join('')

  const clientName = (data.name as string) || 'Novo Lead'

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07060e;font-family:-apple-system,BlinkMacSystemFont,'Inter',Arial,sans-serif">
  <div style="max-width:640px;margin:40px auto;background:#0d0b18;border-radius:16px;overflow:hidden;border:1px solid #1e1a2e">

    <div style="padding:32px;background:linear-gradient(135deg,#2d1b69,#4C1D95,#7C3AED);text-align:center">
      <div style="font-family:'Arial Black',sans-serif;font-size:28px;font-weight:900;color:white;letter-spacing:-1px;margin-bottom:4px">ROXXO</div>
      <div style="color:rgba(255,255,255,0.6);font-size:13px">Design Estratégico Premium</div>
    </div>

    <div style="padding:20px 24px;background:#100e1e;border-bottom:1px solid #1e1a2e">
      <p style="margin:0;color:#9b7aff;font-size:13px">
        🎯 Novo briefing de <strong style="color:#e2defc">${clientName}</strong> ·
        <span style="color:#666">${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</span>
      </p>
    </div>

    <table style="width:100%;border-collapse:collapse">${rows}</table>

    <div style="padding:20px 24px;background:#07060e;text-align:center">
      <p style="margin:0;color:#333;font-size:11px">ROXXO Design · briefing automático</p>
    </div>
  </div>
</body>
</html>`
}

function buildConfirmHtml(clientName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#07060e;font-family:-apple-system,BlinkMacSystemFont,'Inter',Arial,sans-serif">
  <div style="max-width:580px;margin:40px auto;background:#0d0b18;border-radius:16px;overflow:hidden;border:1px solid #1e1a2e">
    <div style="padding:32px;background:linear-gradient(135deg,#2d1b69,#4C1D95,#7C3AED);text-align:center">
      <div style="font-family:'Arial Black',sans-serif;font-size:28px;font-weight:900;color:white;letter-spacing:-1px">ROXXO</div>
    </div>
    <div style="padding:40px 32px;text-align:center">
      <div style="width:60px;height:60px;border-radius:14px;background:rgba(0,245,160,0.1);border:1px solid rgba(0,245,160,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px">✅</div>
      <h1 style="color:#e2defc;font-size:22px;margin:0 0 12px">Briefing recebido!</h1>
      <p style="color:#666;font-size:14px;line-height:1.7;margin:0 0 28px">
        Olá, <strong style="color:#e2defc">${clientName}</strong>.<br>
        Recebemos suas respostas e nossa equipe já está analisando seu projeto.<br>
        Em breve você receberá uma <span style="color:#00F5A0">proposta personalizada</span>.
      </p>
      <a href="https://instagram.com/roxxodesign" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#4C1D95,#7C3AED);border-radius:10px;color:white;text-decoration:none;font-size:13px;font-weight:600">
        Acompanhar no Instagram →
      </a>
    </div>
    <div style="padding:16px;text-align:center;background:#07060e">
      <p style="margin:0;color:#2a2a2a;font-size:11px">ROXXO Design · Design estratégico premium</p>
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  let data: Record<string, string | string[]> = {}

  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  // ── Log no servidor (sempre) ────────────────────────────────────────────
  console.log('\n======= NOVO BRIEFING ROXXO =======')
  Object.entries(data).forEach(([k, v]) => {
    console.log(`${label(k)}: ${Array.isArray(v) ? v.join(', ') : v}`)
  })
  console.log('===================================\n')

  const errors: string[] = []

  // ── E-mail via Resend ───────────────────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      // Para a ROXXO
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? 'ROXXO Design <onboarding@resend.dev>',
        to: process.env.EMAIL_TO ?? 'contato@roxxodesign.com',
        subject: `🚀 Novo briefing: ${data.name || 'Lead'} — ${data.company || ''}`.trim(),
        html: buildEmailHtml(data),
      })

      // Confirmação ao cliente
      if (data.email) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM ?? 'ROXXO Design <onboarding@resend.dev>',
          to: data.email as string,
          subject: 'Seu briefing foi recebido | ROXXO Design',
          html: buildConfirmHtml((data.name as string) || 'Cliente'),
        })
      }
    } catch (err) {
      console.error('Resend error:', err)
      errors.push('email')
    }
  } else {
    console.log('[INFO] RESEND_API_KEY não configurado — e-mail não enviado.')
  }

  // ── Google Sheets ───────────────────────────────────────────────────────
  if (process.env.SHEETS_WEBHOOK_URL) {
    try {
      const row = {
        timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        ...Object.fromEntries(
          Object.entries(data).map(([k, v]) => [label(k), Array.isArray(v) ? v.join(', ') : v])
        ),
      }
      await fetch(process.env.SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
      })
    } catch (err) {
      console.error('Sheets error:', err)
      errors.push('sheets')
    }
  }

  // Sempre retorna 200 — erros de integração não bloqueiam o usuário
  return NextResponse.json({ ok: true, warnings: errors.length ? errors : undefined })
}
