export const AuthStats = () => (
  <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-3 gap-4">
    {[
      { label: 'Uptime', val: '99.9%' },
      { label: 'Active nodes', val: '24/7' },
      { label: 'Encryption', val: 'AES-256' },
    ].map((s) => (
      <div key={s.label} className="text-center">
        <div className="text-slate-900 font-bold text-sm">{s.val}</div>
        <div className="text-slate-500 text-[10px] uppercase tracking-wider">{s.label}</div>
      </div>
    ))}
  </div>
);