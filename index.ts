import { formatDuration } from "date-fns"

const res = formatDuration({ seconds: 750 }, { format: ["hours", "minutes"] })
console.info("res:", res)
