'use client'

import { useState, useCallback, KeyboardEvent, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════
// LOGO — SVG vetorial do símbolo ROXXO
// ═══════════════════════════════════════════════════════════════════════════
function RoxxoMark({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ROXXO Design"
    >
      {/* ── R principal — stem + bowl com counter interno ── */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="
          M 28 20
          L 28 180
          L 58 180
          L 58 122
          L 92 122
          L 150 180
          L 184 180
          L 122 118
          C 154 110 172 90 172 66
          C 172 38 152 20 116 20
          Z
          M 58 46
          L 110 46
          C 130 46 144 55 144 68
          C 144 81 130 96 110 96
          L 58 96
          Z
        "
        fill="url(#roxxo_grad)"
      />
      {/* ── Barra topo — corte angular característico da marca ── */}
      <path
        d="M 28 20 L 58 20 L 48 32 L 28 32 Z"
        fill="url(#roxxo_cyan)"
        opacity="0.85"
      />

      <defs>
        <linearGradient id="roxxo_grad" x1="24" y1="22" x2="180" y2="178" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9B72FF" />
          <stop offset="0.45" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="roxxo_cyan" x1="53" y1="22" x2="73" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function LogoBadge({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#0d0d0f',
        border: '1px solid rgba(124,58,237,0.35)',
        borderRadius: Math.round(size * 0.28),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 16px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
        flexShrink: 0,
      }}
    >
      <RoxxoMark size={Math.round(size * 0.62)} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & STEPS
// ═══════════════════════════════════════════════════════════════════════════
type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'choice' | 'multichoice'

interface Step {
  id: string
  question: string
  subtitle?: string
  type: FieldType
  placeholder?: string
  options?: string[]
  required?: boolean
}

const STEPS: Step[] = [
  {
    id: 'name',
    question: 'Qual é o seu nome?',
    subtitle: 'Como você prefere ser chamado?',
    type: 'text',
    placeholder: 'Seu nome completo',
    required: true,
  },
  {
    id: 'company',
    question: 'Nome da sua empresa ou marca?',
    type: 'text',
    placeholder: 'ACME Company',
    required: true,
  },
  {
    id: 'instagram',
    question: 'Instagram da marca?',
    subtitle: 'Vamos analisar sua presença digital atual.',
    type: 'text',
    placeholder: '@suamarca',
  },
  {
    id: 'whatsapp',
    question: 'Qual é o seu WhatsApp?',
    subtitle: 'Nosso time entrará em contato por aqui com a proposta.',
    type: 'tel',
    placeholder: '(11) 9 9999-9999',
    required: true,
  },
  {
    id: 'email',
    question: 'E-mail profissional?',
    subtitle: 'Você receberá a proposta por aqui.',
    type: 'email',
    placeholder: 'voce@suaempresa.com',
    required: true,
  },
  {
    id: 'business',
    question: 'O que sua empresa vende?',
    subtitle: 'Descreva seus produtos ou serviços. Quanto mais contexto, mais precisa será a estratégia.',
    type: 'textarea',
    placeholder: 'Ex: Oferecemos mentorias de negócios digitais para empreendedores que querem escalar para 6 dígitos sem trabalhar mais horas...',
    required: true,
  },
  {
    id: 'audience',
    question: 'Quem é o seu cliente ideal?',
    subtitle: 'Perfil, faixa etária, principais dores, desejos e objeções.',
    type: 'textarea',
    placeholder: 'Ex: Empreendedoras entre 30–45 anos, com negócio no digital, que já vendem mas querem se posicionar como premium...',
    required: true,
  },
  {
    id: 'objective',
    question: 'Objetivo principal deste projeto?',
    subtitle: 'Escolha o que mais se aproxima do que você precisa agora.',
    type: 'choice',
    options: [
      'Lançar um produto ou serviço',
      'Gerar mais leads qualificados',
      'Aumentar vendas e conversão',
      'Fortalecer autoridade e posicionamento',
      'Rebranding e reestruturação de marca',
      'Escalar retorno em tráfego pago',
    ],
    required: true,
  },
  {
    id: 'services',
    question: 'Quais serviços você procura?',
    subtitle: 'Selecione tudo que faz sentido. Pode marcar mais de um.',
    type: 'multichoice',
    options: [
      'Landing Page',
      'Criativos para Anúncios',
      'Carrosséis para Instagram',
      'Gestão de Redes Sociais',
      'Identidade Visual',
      'Pacote Completo',
      'Ainda não tenho certeza',
    ],
    required: true,
  },
  {
    id: 'priority',
    question: 'Qual é sua prioridade neste momento?',
    subtitle: 'Escolha o serviço mais urgente para o seu negócio agora.',
    type: 'choice',
    options: [
      'Landing Page',
      'Criativos para Anúncios',
      'Carrosséis para Instagram',
      'Gestão de Redes Sociais',
      'Identidade Visual',
      'Pacote Completo',
    ],
    required: true,
  },
  {
    id: 'references',
    question: 'Tem referências visuais para compartilhar?',
    subtitle: 'Sites, marcas ou perfis que admira. Cole os links, um por linha.',
    type: 'textarea',
    placeholder: 'https://exemplo.com\nhttps://instagram.com/marca',
  },
  {
    id: 'budget',
    question: 'Qual é o investimento disponível?',
    subtitle: 'Isso nos permite calibrar a melhor estratégia para a sua realidade.',
    type: 'choice',
    options: [
      'Até R$ 1.500',
      'R$ 1.500 — R$ 3.000',
      'R$ 3.000 — R$ 6.000',
      'R$ 6.000 — R$ 12.000',
      'Acima de R$ 12.000',
    ],
    required: true,
  },
  {
    id: 'deadline',
    question: 'Prazo desejado para entrega?',
    type: 'choice',
    options: [
      'Express — até 72 horas',
      'Rápido — 7 a 10 dias',
      'Normal — 15 a 20 dias',
      'Planejado — 30 dias',
      'Sem prazo definido',
    ],
    required: true,
  },
  {
    id: 'files',
    question: 'Você tem materiais para compartilhar?',
    subtitle: 'Logo, fotos, manual da marca, catálogo. Compartilhe um link do Google Drive.',
    type: 'text',
    placeholder: 'https://drive.google.com/drive/folders/...',
  },
  {
    id: 'final',
    question: 'A pergunta mais importante.',
    subtitle: 'Se este projeto ficar exatamente como você imagina, o que precisa acontecer para você dizer: "Foi o melhor investimento que já fiz"?',
    type: 'textarea',
    placeholder: 'Descreva o resultado dos seus sonhos para este projeto...',
    required: true,
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════
const slide = {
  enter: (dir: number) => ({
    x: dir > 0 ? 56 : -56,
    opacity: 0,
    filter: 'blur(6px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -56 : 56,
    opacity: 0,
    filter: 'blur(6px)',
    transition: { duration: 0.28, ease: [0.7, 0, 0.84, 0] },
  }),
}

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: (i = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  }),
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const itemFade = {
  hidden: { opacity: 0, x: -10 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function BriefingPage() {
  const prefersReduced = useReducedMotion()
  const [screen, setScreen]       = useState<'hero' | 'form' | 'success'>('hero')
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers]     = useState<Record<string, string | string[]>>({})
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  const step        = STEPS[stepIndex]
  const progress    = ((stepIndex + 1) / STEPS.length) * 100
  const isMulti     = step?.type === 'multichoice'
  const isChoice    = step?.type === 'choice'
  const curAnswer   = answers[step?.id] ?? ''
  const multiAns    = Array.isArray(answers[step?.id]) ? (answers[step.id] as string[]) : []

  // Auto-focus input on step change
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 380)
    return () => clearTimeout(t)
  }, [stepIndex])

  // ── Core navigation ────────────────────────────────────────────────────
  const goForward = useCallback(
    async (forced?: string | string[]) => {
      const val     = forced !== undefined ? forced : curAnswer
      const multiV  = Array.isArray(val) ? val : []

      if (step?.required && !isMulti && !val) {
        setError('Por favor, preencha este campo.')
        return
      }
      if (step?.required && isMulti && multiV.length === 0) {
        setError('Selecione pelo menos uma opção.')
        return
      }
      setError('')

      if (stepIndex < STEPS.length - 1) {
        setDirection(1)
        setStepIndex(i => i + 1)
      } else {
        await handleSubmit()
      }
    },
    [step, curAnswer, isMulti, stepIndex]
  )

  const goBack = useCallback(() => {
    setError('')
    if (stepIndex === 0) { setScreen('hero'); return }
    setDirection(-1)
    setStepIndex(i => i - 1)
  }, [stepIndex])

  const setValue = (val: string) => {
    setError('')
    setAnswers(prev => ({ ...prev, [step.id]: val }))
  }

  const toggleMulti = (opt: string) => {
    setError('')
    const cur  = Array.isArray(answers[step.id]) ? (answers[step.id] as string[]) : []
    const next = cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt]
    setAnswers(prev => ({ ...prev, [step.id]: next }))
  }

  // Choice: update state and advance atomically
  const pickChoice = (opt: string) => {
    setError('')
    setAnswers(prev => {
      setTimeout(() => {
        setError('')
        if (stepIndex < STEPS.length - 1) {
          setDirection(1)
          setStepIndex(i => i + 1)
        } else {
          handleSubmit()
        }
      }, 260)
      return { ...prev, [step.id]: opt }
    })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && step?.type !== 'textarea') {
      e.preventDefault()
      goForward()
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
      if (!res.ok) throw new Error()
      setScreen('success')
    } catch {
      if (process.env.NODE_ENV === 'development') {
        console.log('[ROXXO BRIEFING — DEV]', answers)
        setScreen('success')
      } else {
        setError('Ocorreu um erro. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // HERO
  // ══════════════════════════════════════════════════════════════════════
  if (screen === 'hero') {
    return (
      <main className="min-h-dvh bg-n900 flex flex-col items-center justify-center relative overflow-hidden px-5 py-20">

        {/* ── Background layers ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Glow primário */}
          <div style={{
            position: 'absolute', top: '30%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 800, height: 800, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.11) 0%, transparent 65%)',
          }} />
          {/* Glow secundário — ciano */}
          <div style={{
            position: 'absolute', bottom: '-10%', right: '10%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)',
          }} />
          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.025,
            backgroundImage: 'linear-gradient(rgba(124,58,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }} />
          {/* Vinheta */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,10,10,0.7) 100%)',
          }} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">

          {/* Logo */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="mb-10"
          >
            <motion.div
              animate={prefersReduced ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 88, height: 88, borderRadius: 22,
                background: 'linear-gradient(135deg, #0d0d0f, #131317)',
                border: '1px solid rgba(124,58,237,0.3)',
                boxShadow: '0 0 60px rgba(124,58,237,0.2), 0 0 120px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <RoxxoMark size={56} />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', borderRadius: 99,
              border: '1px solid rgba(6,182,212,0.25)',
              background: 'rgba(6,182,212,0.06)',
              marginBottom: 24,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#06B6D4',
                boxShadow: '0 0 8px rgba(6,182,212,0.6)',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#22D3EE',
              }}>
                Design · Estratégia · Crescimento
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={2} variants={fadeUp} initial="hidden" animate="show"
            style={{
              fontSize: 'clamp(2.25rem,5.5vw,3.5rem)',
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: '#F4F4F5',
              marginBottom: 20,
            }}
          >
            Design que vende.{' '}
            <span style={{
              background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 40%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Estratégia que escala.
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            custom={3} variants={fadeUp} initial="hidden" animate="show"
            style={{
              fontSize: 'clamp(1rem,2vw,1.125rem)',
              lineHeight: 1.7,
              color: 'rgba(161,161,170,0.85)',
              maxWidth: 520,
              marginBottom: 40,
            }}
          >
            Preencha o briefing e nossa equipe monta uma{' '}
            <span style={{ color: '#F4F4F5' }}>estratégia sob medida</span> para
            elevar sua marca, converter mais clientes e escalar seus resultados.
          </motion.p>

          {/* CTA */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 50px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setScreen('form'); setStepIndex(0) }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
                boxShadow: '0 0 32px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              Iniciar Briefing
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            <p style={{ marginTop: 16, fontSize: 12, color: 'rgba(113,113,122,0.7)', letterSpacing: '0.01em' }}>
              {STEPS.length} etapas · cerca de 3 minutos
            </p>
          </motion.div>
        </div>

        {/* Watermark */}
        <div style={{
          position: 'absolute', bottom: 20, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.07)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            ROXXO DESIGN · DESIGN ESTRATÉGICO PREMIUM
          </span>
        </div>
      </main>
    )
  }

  // ══════════════════════════════════════════════════════════════════════
  // SUCCESS
  // ══════════════════════════════════════════════════════════════════════
  if (screen === 'success') {
    const clientName = (answers.name as string) || 'você'

    const nextSteps = [
      { icon: '🔍', label: 'Leitura do briefing',       desc: 'Analisamos cada resposta com atenção estratégica.' },
      { icon: '🎯', label: 'Diagnóstico da marca',       desc: 'Identificamos oportunidades e o melhor caminho.' },
      { icon: '📋', label: 'Proposta personalizada',     desc: 'Você recebe uma proposta clara, com escopo e valor.' },
      { icon: '🚀', label: 'Início do projeto',          desc: 'Com tudo aprovado, colocamos sua marca em movimento.' },
    ]

    return (
      <main className="min-h-dvh bg-n900 flex flex-col items-center justify-center px-5 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div style={{
            position: 'absolute', top: '40%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
          }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md"
          style={{ textAlign: 'center' }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <LogoBadge size={52} />
          </div>

          {/* Ícone de sucesso */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 20 }}
            style={{
              width: 72, height: 72, borderRadius: 18,
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
              boxShadow: '0 0 36px rgba(16,185,129,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
            }}
          >
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.45, duration: 0.5, ease: 'easeOut' }}
              width="32" height="32" viewBox="0 0 32 32" fill="none"
            >
              <motion.path
                d="M5 16l8 8 14-14"
                stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.45, duration: 0.5, ease: 'easeOut' }}
              />
            </motion.svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 600, letterSpacing: '-0.03em', color: '#F4F4F5', marginBottom: 8 }}
          >
            Obrigado, {clientName.split(' ')[0]}.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 15, color: '#71717A', lineHeight: 1.6, marginBottom: 32 }}
          >
            Seu projeto foi recebido com sucesso. Nossa equipe analisa cada resposta com atenção e retorna em até{' '}
            <span style={{ color: '#06B6D4', fontWeight: 500 }}>24 horas úteis</span>{' '}
            com uma proposta comercial personalizada para o seu momento.
          </motion.p>

          {/* Próximos passos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '20px 24px',
              marginBottom: 28, textAlign: 'left',
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#52525B', marginBottom: 16 }}>
              O que acontece agora
            </p>
            {nextSteps.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < nextSteps.length - 1 ? 14 : 0 }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, marginTop: 1,
                }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#F4F4F5', marginBottom: 2 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: '#52525B', lineHeight: 1.4 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <a
              href="https://roxxodesign.com/portfolio"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 10,
                border: '1px solid rgba(124,58,237,0.3)',
                color: '#8B5CF6', fontSize: 13, fontWeight: 500,
                textDecoration: 'none',
                background: 'rgba(124,58,237,0.06)',
                transition: 'all 0.2s',
              }}
            >
              Ver Portfólio
            </a>
            <a
              href="https://wa.me/5571991730729?text=Ol%C3%A1%20Erick%2C%20acabei%20de%20concluir%20o%20briefing%20da%20ROXXO%20e%20gostaria%20de%20receber%20minha%20proposta%20personalizada."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 10,
                background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                color: 'white', fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 0 20px rgba(124,58,237,0.25)',
              }}
            >
              Solicitar Minha Proposta
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 11L11 2M11 2H5M11 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </main>
    )
  }

  // ══════════════════════════════════════════════════════════════════════
  // FORM
  // ══════════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-dvh bg-n900 flex flex-col relative" style={{ isolation: 'isolate' }}>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{ zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 1000, height: 1000, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 60%)',
        }} />
      </div>

      {/* ── Progress bar ── */}
      <div className="fixed top-0 left-0 right-0" style={{ zIndex: 50 }}>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #7C3AED, #8B5CF6, #06B6D4)',
            }}
          />
        </div>

        {/* Header */}
        <div className="glass" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setScreen('hero')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.65, cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.65')}
          >
            <LogoBadge size={28} />
            <span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}>ROXXO Design</span>
          </button>

          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {STEPS.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === stepIndex ? 18 : 4,
                  background: i < stepIndex ? '#06B6D4' : i === stepIndex ? '#7C3AED' : 'rgba(255,255,255,0.1)',
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: 4, borderRadius: 2 }}
              />
            ))}
            <span style={{ marginLeft: 8, fontSize: 11, color: '#52525B', fontWeight: 500 }}>
              {stepIndex + 1} / {STEPS.length}
            </span>
          </div>
        </div>
      </div>

      {/* ── Step content ── */}
      <div
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '96px 20px 96px',
          position: 'relative', zIndex: 1,
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIndex}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ width: '100%', maxWidth: 520 }}
          >
            {/* Step number */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#7C3AED' }}>
                {String(stepIndex + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.12)' }} />
            </div>

            {/* Question */}
            <h2 style={{
              fontSize: 'clamp(1.375rem,3vw,1.875rem)',
              fontWeight: 600, letterSpacing: '-0.025em',
              lineHeight: 1.25, color: '#F4F4F5', marginBottom: 6,
            }}>
              {step.question}
            </h2>

            {step.subtitle && (
              <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.65, marginBottom: 28 }}>
                {step.subtitle}
              </p>
            )}
            {!step.subtitle && <div style={{ height: 28 }} />}

            {/* ── Field: text / email / tel ── */}
            {(step.type === 'text' || step.type === 'email' || step.type === 'tel') && (
              <div>
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={step.type}
                  value={curAnswer as string}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={step.placeholder}
                  autoComplete="off"
                  className="input-line"
                  style={{ fontSize: 'clamp(1.125rem,2.5vw,1.375rem)' }}
                />
                <p style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                  Pressione{' '}
                  <kbd style={{
                    padding: '2px 6px', borderRadius: 4, fontSize: 10,
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.3)',
                  }}>Enter ↵</kbd>{' '}
                  para continuar
                </p>
              </div>
            )}

            {/* ── Field: textarea ── */}
            {step.type === 'textarea' && (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={curAnswer as string}
                onChange={e => setValue(e.target.value)}
                placeholder={step.placeholder}
                rows={5}
                className="input-area"
              />
            )}

            {/* ── Field: choice ── */}
            {step.type === 'choice' && (
              <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {step.options?.map(opt => (
                  <motion.button
                    key={opt}
                    variants={itemFade}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => pickChoice(opt)}
                    className={`choice-item${(curAnswer as string) === opt ? ' active' : ''}`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* ── Field: multichoice ── */}
            {step.type === 'multichoice' && (
              <motion.div
                variants={stagger} initial="hidden" animate="show"
                style={{ display: 'grid', gridTemplateColumns: (step.options?.length ?? 0) >= 7 ? '1fr' : '1fr 1fr', gap: 8 }}
              >
                {step.options?.map(opt => {
                  const on = multiAns.includes(opt)
                  return (
                    <motion.button
                      key={opt}
                      variants={itemFade}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleMulti(opt)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                        background: on ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.025)',
                        border: on ? '1px solid rgba(6,182,212,0.45)' : '1px solid rgba(255,255,255,0.06)',
                        color: on ? '#22D3EE' : 'rgba(244,244,245,0.55)',
                        fontSize: 13, fontWeight: 500,
                        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    >
                      <div style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: on ? '#06B6D4' : 'transparent',
                        border: on ? '2px solid #06B6D4' : '1.5px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.18s',
                      }}>
                        {on && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5l2.5 2.5 5-5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {opt}
                    </motion.button>
                  )
                })}
              </motion.div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{
                    marginTop: 14, display: 'flex', alignItems: 'center', gap: 7,
                    fontSize: 13, color: '#F87171',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 4v3.5M7 10h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer navigation ── */}
      <div
        className="glass"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '12px 20px', zIndex: 50,
        }}
      >
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={goBack}
            className="btn btn-ghost"
            style={{ flexShrink: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Voltar
          </motion.button>

          {!isChoice && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => goForward()}
              disabled={loading}
              className="btn"
              style={{
                flex: 1,
                ...(stepIndex === STEPS.length - 1
                  ? {
                      background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                      color: '#0A0A0A', fontWeight: 700,
                      boxShadow: '0 0 24px rgba(6,182,212,0.3)',
                    }
                  : {
                      background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                      color: 'white',
                      boxShadow: '0 0 20px rgba(124,58,237,0.25)',
                    }),
              }}
            >
              {loading ? (
                <motion.svg
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                >
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" opacity="0.35"/>
                  <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </motion.svg>
              ) : stepIndex === STEPS.length - 1 ? (
                <>
                  Enviar Briefing
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h9M7 2.5L11 7l-4 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              ) : (
                <>
                  Continuar
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M4 2l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </main>
  )
}
