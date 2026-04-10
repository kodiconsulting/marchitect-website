'use client'

import { useState } from 'react'

type Screen = 'intro' | 'question' | 'results'

const questions = [
  {
    text: "What's your company's approximate annual revenue?",
    options: ['Under $1M', '$1M \u2013 $5M', '$5M \u2013 $20M', '$20M \u2013 $50M', 'Over $50M'],
  },
  {
    text: 'What best describes your business?',
    options: [
      'High-ticket ecommerce (physical products, $300+)',
      'Service business (recurring or project-based)',
      'SaaS or subscription',
      'Other',
    ],
  },
  {
    text: 'Which statement best describes your marketing right now?',
    options: [
      "We're running campaigns but can't tell what's actually working",
      'We have activity but no clear strategy or priorities',
      'Our conversion rates are lower than they should be and we don\u2019t know why',
      "We're spending on marketing but it's not producing predictable ROI",
      "We're just getting started and trying to build the right foundation",
    ],
  },
  {
    text: "What's the biggest marketing challenge you're facing?",
    options: [
      "We don't know who our real customer is or how to speak to cold traffic",
      "Our reporting is unreliable \u2014 we can't trust our own data",
      "We've tried agencies and it hasn't worked",
      "We don't have a clear offer or message for top-of-funnel",
      "We're not sure which channels to prioritize or in what order",
      "Leadership doesn't agree on what success looks like",
    ],
  },
  {
    text: 'Do you currently have someone (internal or vendor) to execute marketing?',
    options: [
      'Yes \u2014 internal team in place',
      'Yes \u2014 we use agencies or contractors',
      'Both \u2014 internal team + external vendors',
      'No \u2014 we need to build this out',
    ],
  },
  {
    text: 'Have you worked with a marketing agency or consultant before?',
    options: [
      'Yes, and it worked reasonably well',
      "Yes, and it didn't deliver what we needed",
      'Yes, multiple times \u2014 mixed results',
      'No, this would be our first outside engagement',
    ],
  },
  {
    text: 'How urgently are you looking to make a change?',
    options: [
      'We need help now \u2014 this is a top priority',
      "We're exploring options in the next 1\u20133 months",
      "We're in research mode \u2014 no firm timeline yet",
    ],
  },
]

export default function AssessmentShell() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [sessionId] = useState<string>(() => crypto.randomUUID())

  function handleStart() {
    setScreen('question')
    setCurrentQuestion(0)
  }

  function handleOptionClick(option: string) {
    const updatedResponses = { ...responses, [currentQuestion]: option }
    setResponses(updatedResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setScreen('results')
      fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, responses: updatedResponses }),
      }).catch(() => {})
    }
  }

  function handleBack() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else {
      setScreen('intro')
    }
  }

  const progressPct = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white px-6 py-4 flex-shrink-0">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <a
            href="/"
            className="text-lg font-bold text-gray-900"
            style={{ letterSpacing: '-0.01em' }}
          >
            Marchitect
          </a>
          {screen === 'question' && (
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          )}
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Exit
          </a>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {screen === 'intro' && (
          <div className="max-w-xl w-full text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-5" style={{ letterSpacing: '-0.02em' }}>
              Let&rsquo;s find out what&rsquo;s breaking your marketing ROI.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              This takes about 5 minutes. Based on your answers, we&rsquo;ll tell you where the
              biggest gaps typically are for a business like yours &mdash; and what to fix first. At
              the end, you&rsquo;ll have the option to book a free 30-minute call with Michael.
            </p>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--m-accent)' }}
            >
              Start Assessment &rarr;
            </button>
          </div>
        )}

        {screen === 'question' && (
          <div className="max-w-xl w-full">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPct}%`,
                    backgroundColor: 'var(--m-accent)',
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
              {questions[currentQuestion].text}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-8">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 text-gray-800 font-medium text-base transition-all hover:border-[var(--m-accent)] hover:bg-[color-mix(in_srgb,var(--m-accent)_5%,transparent)] focus:outline-none focus:ring-2 focus:ring-[var(--m-accent)] focus:ring-offset-2"
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Back */}
            <button
              onClick={handleBack}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              &larr; Back
            </button>
          </div>
        )}

        {screen === 'results' && (
          <div className="max-w-lg w-full text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-5" style={{ letterSpacing: '-0.02em' }}>
              Here&rsquo;s what we found.
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Based on your answers, Marchitect is built for companies in exactly your situation.
              The most common root cause of unpredictable marketing ROI isn&rsquo;t the channels,
              the vendors, or the budget &mdash; it&rsquo;s the absence of a governing framework. No
              clear success definitions. No offer designed for cold traffic. No attribution you can
              trust. No one layer that coordinates all the moving parts. That&rsquo;s what the
              Marchitect Marketing Operating Framework fixes. The next step is a free 30-minute call
              with Michael. No pitch &mdash; just a diagnostic conversation about your situation.
              You&rsquo;ll know by the end of the call whether Marchitect is the right fit.
            </p>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl text-base transition-opacity hover:opacity-90 mb-6"
              style={{ backgroundColor: 'var(--m-accent)' }}
            >
              Book Your Free 30-Minute Call
            </a>

            <p className="text-sm text-gray-500 mb-10">
              Prefer to email instead?{' '}
              <a
                href="mailto:hello@marchitect.com"
                className="text-gray-700 underline hover:text-gray-900"
              >
                hello@marchitect.com
              </a>
            </p>

            {/* Calendly placeholder */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-gray-400 text-sm">
              Calendly calendar &mdash; URL will be embedded before launch
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
