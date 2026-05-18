export default function Icon({ name, size = 17, filled = false, color = 'currentColor', stroke = 2, style }) {
  const s = size
  const common = {
    width: s, height: s, viewBox: '0 0 24 24',
    fill: filled ? color : 'none',
    stroke: filled ? 'none' : color,
    strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  }
  switch (name) {
    case 'today':
      return filled
        ? <svg {...common}><circle cx="12" cy="12" r="9.5" /></svg>
        : <svg {...common}><circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="12" r="4" fill={color} stroke="none" /></svg>
    case 'scheduled':
      return filled
        ? <svg {...common} fill="none"><rect x="3" y="5" width="18" height="16" rx="3" fill={color}/><rect x="6" y="3" width="2" height="4" rx="1" fill={color}/><rect x="16" y="3" width="2" height="4" rx="1" fill={color}/><circle cx="12" cy="14" r="2.4" fill="white"/></svg>
        : <svg {...common}><rect x="3" y="5" width="18" height="16" rx="3"/><line x1="7" y1="3" x2="7" y2="7"/><line x1="17" y1="3" x2="17" y2="7"/></svg>
    case 'all':
      return filled
        ? <svg {...common} fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill={color}/><path d="M7 9h10M7 13h10M7 17h6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
        : <svg {...common}><rect x="3" y="3" width="18" height="18" rx="4"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="17" y2="13"/><line x1="7" y1="17" x2="13" y2="17"/></svg>
    case 'flagged':
      return filled
        ? <svg {...common} fill="none"><path d="M5 3v18M5 4h11l-2 4 2 4H5" fill={color} stroke={color} strokeWidth="1.4" strokeLinejoin="round"/></svg>
        : <svg {...common}><line x1="5" y1="3" x2="5" y2="21"/><path d="M5 4h11l-2 4 2 4H5"/></svg>
    case 'list':
      return <svg {...common}><line x1="8" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill={color} stroke="none"/><circle cx="4" cy="12" r="1" fill={color} stroke="none"/><circle cx="4" cy="18" r="1" fill={color} stroke="none"/></svg>
    case 'plus':
      return <svg {...common}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    case 'plus-circle':
      return <svg {...common} fill="none"><circle cx="12" cy="12" r="10" fill={color} stroke="none"/><line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="2"/><line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeWidth="2"/></svg>
    case 'search':
      return <svg {...common}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    case 'chevron':
      return <svg {...common}><polyline points="9 6 15 12 9 18"/></svg>
    case 'chevron-down':
      return <svg {...common}><polyline points="6 9 12 15 18 9"/></svg>
    case 'sun':
      return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
    case 'moon':
      return <svg {...common}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
    case 'flag-small':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}><path d="M5 3v18l3-1V4l-3-1zM8 4l11 1.5L17 9l2 3.5L8 11V4z"/></svg>
    case 'check':
      return <svg {...common}><polyline points="6 12 10 16 18 8"/></svg>
    case 'x':
      return <svg {...common}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    case 'i':
      return <svg {...common}><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5v.01"/></svg>
    case 'arrow-left':
      return <svg {...common}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
    case 'ellipsis':
      return <svg {...common}><circle cx="5" cy="12" r="1.5" fill={color} stroke="none"/><circle cx="12" cy="12" r="1.5" fill={color} stroke="none"/><circle cx="19" cy="12" r="1.5" fill={color} stroke="none"/></svg>
    case 'pencil':
      return <svg {...common}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    case 'trash':
      return <svg {...common}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    case 'help':
      return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    case 'bell':
      return filled
        ? <svg {...common} fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill={color}/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} fill="none" strokeWidth={stroke}/></svg>
        : <svg {...common}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    case 'folder':
      return filled
        ? <svg {...common} fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill={color}/></svg>
        : <svg {...common}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
    case 'star':
      return filled
        ? <svg {...common} fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color}/></svg>
        : <svg {...common}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    case 'person':
      return <svg {...common}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    case 'check-circle':
      return filled
        ? <svg {...common} fill="none"><circle cx="12" cy="12" r="10" fill={color}/><polyline points="9 12 11 14 15 10" stroke="white" strokeWidth={stroke}/></svg>
        : <svg {...common}><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
    default: return null
  }
}

export function RepeatIcon({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  )
}
