import { unlinkSync } from "node:fs"
import watcher from "@parcel/watcher"
import { $, type ShellError } from "bun"
import moment from "moment"

const here = process.env.ICA_DIR as string

const subs = await watcher.subscribe(here, async (_err, events) => {
	for (const event of events) {
		if (event.type === "create" && event.path.endsWith(".ica")) {
			console.info(`${event.path} was created`)
			const file = Bun.file(event.path)
			if (file.size > 0) {
				const text = await file.text()
				const replaced = text.replace("DesktopViewer-ForceFullScreenStartup=On", "DesktopViewer-ForceFullScreenStartup=Off")
				Bun.write(`/tmp/${file.name}`, replaced)
				try {
					await $`open /tmp/${file.name}`
				} catch (e) {
					const se = e as ShellError
					console.error(`Opening ${file.name} failed with exit code ${se.exitCode}`)
					console.error(se.stderr.toString())
					console.error(se.stdout.toString())
				}
				unlinkSync(`${event.path}`)
			}
		}
	}
})
console.info(`> ${moment().format("YYYY-MM-DD HH:mm:ss")} Started watcher on /Users/juvor/Downloads`)

process.on("SIGINT", async () => {
	console.info("Closing watcher...")
	await subs.unsubscribe()
	process.exit(0)
})
