import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface TimeRangePickerProps {
  onChange: (start: string, end: string) => void
  className?: string
  startTime: string
  endTime: string
}

const TimeRangePicker = React.forwardRef<any, TimeRangePickerProps>(
  ({ className, ...props }, ref) => {
    const [start, setStart] = useState(props.startTime)
    const [end, setEnd] = useState(props.endTime)

    const handleStartChange = (e: React.ChangeEvent<any>) => {
      const newStart = e.target.value;
      setStart(newStart);
      (props.onChange as any)?.(newStart, end);
    }

    const handleEndChange = (e: React.ChangeEvent<any>) => {
      const newEnd = e.target.value;
      setEnd(newEnd);
      (props.onChange as any)?.(start, newEnd);
    }

    return (
      <div ref={ref} className="time-range-picker">
        <input type="time" className={cn('mr-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-950 dark:text-white', className)} value={start} onChange={handleStartChange} />
        <span className="text-sm">to</span>
        <input type="time" className={cn('ml-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-950 dark:text-white', className)} value={end} onChange={handleEndChange} />
      </div>
    )
  }
)

TimeRangePicker.displayName = "TimeRangePicker"

export { TimeRangePicker }