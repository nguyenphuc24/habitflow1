import { useEffect } from 'react'

export default function BottomSheet({ open, onClose, children, tall = false }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn .2s ease' }}
      />
      {/* Sheet */}
      <div
        className={[
          'relative bg-s1 rounded-t-3xl w-full max-w-[430px] overflow-y-auto',
          tall ? 'max-h-[88dvh]' : 'max-h-[85dvh]',
        ].join(' ')}
        style={{ animation: 'slideUp .28s cubic-bezier(.34,1.56,.64,1)', paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 20px)' }}
      >
        <div className="w-10 h-1 bg-bdr rounded-full mx-auto mt-3 mb-4" />
        <div className="px-5">{children}</div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
      `}</style>
    </div>
  )
}
