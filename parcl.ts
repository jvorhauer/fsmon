import watcher from "@parcel/watcher"
import { $, ShellError } from "bun"
import { format } from "date-fns"
import { unlinkSync } from "node:fs"

const here = process.env.ICA_DIR as string
const DTF = "yyyy-MM-dd HH:mm:ss"
const now = () => format(new Date(), DTF)

const subs = await watcher.subscribe(here, async (_err, events) => {
  for (const event of events) {
    if (event.type === "create" && event.path.endsWith(".ica")) {
      console.info(`${now()} - ${event.path} was created`)
      const file = Bun.file(event.path)
      if (file.size > 0) {
        const text = await file.text()
        const replaced = text.replace("DesktopViewer-ForceFullScreenStartup=On", "DesktopViewer-ForceFullScreenStartup=Off")
        Bun.write(`/tmp/${file.name}`, replaced);
        try {
          await $`open /tmp/${file.name}`
        } catch (e) {
          const se = e as ShellError
          console.error(
            `${now()} - Opening ${file.name} failed with exit code ${se.exitCode}`,
          )
        }
        unlinkSync(`${event.path}`)
      }
    }
  }
});
console.info(`${now()} Started watcher on /Users/juvor/Downloads`)

process.on("SIGINT", async () => {
  console.info(`${now()} - Closing watcher...`)
  await subs.unsubscribe()
  process.exit(0)
});
