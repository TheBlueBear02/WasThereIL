import { useState } from 'react'
import { EVENTS } from '../../data/events'
import { EventCard } from './EventCard'

export function EventList() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <ul className="flex flex-col gap-3">
      {EVENTS.map((event) => (
        <li key={event.id}>
          <EventCard
            event={event}
            isExpanded={expandedId === event.id}
            onToggle={() =>
              setExpandedId((current) =>
                current === event.id ? null : event.id,
              )
            }
          />
        </li>
      ))}
    </ul>
  )
}
