import { useState, useEffect, useRef } from 'react'
import QRCodeLib from 'qrcode'
import { Logo } from './Logo'

export function QRCode({ value = 'jynx-chamada', size = 320, className = '', withFinderLogo = false }) {
  const canvasRef = useRef(null)

  // Monta a URL completa para o aluno acessar
  const url = (() => {
    const origin = window.location.origin
    // Se o value já é uma URL, usa direto; senão, monta a rota de chamada
    if (value.startsWith('http')) return value
    // Extrai o turmaId do formato "jynx-{id}"
    const turmaId = value.replace('jynx-', '')
    return `${origin}?chamada=${turmaId}`
  })()

  useEffect(() => {
    if (!canvasRef.current) return
    QRCodeLib.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 2,
      color: { dark: '#0A0A0A', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    }).catch(err => console.error('Erro ao gerar QR Code:', err))
  }, [url, size])

  return (
    <div className={`relative bg-white ${className}`} style={{ width: size, height: size }}>
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
      {withFinderLogo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-1.5 rounded-md shadow-sm">
            <Logo size={28} withWordmark={false} />
          </div>
        </div>
      )}
    </div>
  )
}
