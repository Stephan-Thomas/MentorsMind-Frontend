import React from 'react'
import { NotificationPayload } from '../../services/notification.service'
import useNotifications from '../../hooks/useNotifications'

export const NotificationItem: React.FC<{ n: NotificationPayload }> = ({ n }) => {
  const { markRead, dismiss, snooze } = useNotifications()
  return (
    <div className={`p-3 border-b last:border-b-0 ${n.read ? 'bg-surface' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-text">{n.title || 'Update'}</div>
          <div className="text-sm text-muted-foreground">{n.message}</div>
          <div className="text-xs text-muted-foreground/70">{new Date(n.createdAt).toLocaleString()}</div>
        </div>
        <div className="flex flex-col gap-2 ml-3">
          <button className="text-xs text-primary" onClick={() => markRead(n.id)}>
            Mark read
          </button>
          <button className="text-xs text-destructive" onClick={() => dismiss(n.id)}>
            Dismiss
          </button>
          <button className="text-xs text-muted-foreground" onClick={() => snooze(n.id, 10)}>
            Snooze 10m
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
