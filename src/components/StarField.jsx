import { useMemo } from 'react'

export default function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      top:      `${Math.random() * 100}%`,
      left:     `${Math.random() * 100}%`,
      size:     Math.random() * 2.5 + 0.5,
      duration: `${Math.random() * 4 + 2}s`,
      delay:    `${Math.random() * 5}s`,
      color:    ['#fbbf24', '#fb923c', '#f9a8d4', '#ffffff'][Math.floor(Math.random() * 4)],
    }))
  }, [])

  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            top:       s.top,
            left:      s.left,
            width:     `${s.size}px`,
            height:    `${s.size}px`,
            background: s.color,
            '--duration': s.duration,
            '--delay':    s.delay,
          }}
        />
      ))}
    </div>
  )
}
