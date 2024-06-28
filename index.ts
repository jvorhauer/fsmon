import { watch } from "node:fs"
import { $ } from "bun"

const here = "/Users/juvor/Downloads" //import.meta.dir

const watcher = watch(here, async (event, filename) => {
	console.info(`Detected ${event} on ${here}/${filename}`)
	if (filename?.endsWith(".ica")) {
		const file = Bun.file(`${here}/${filename}`)
		const text = await file.text()
		const replaced = text.replace("DesktopViewer-ForceFullScreenStartup=On", "DesktopViewer-ForceFullScreenStartup=Off")
		Bun.write(`/tmp/${filename}`, replaced)
		await $`open /tmp/${filename}`
	}
})

console.info(`Started watcher on ${here}`)

process.on("SIGINT", () => {
	console.info("Closing watcher...")
	watcher.close()
	process.exit(0)
})
