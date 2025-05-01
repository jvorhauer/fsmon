import watcher from "@parcel/watcher"
import { $ } from "bun"
import { unlink } from "node:fs"
import adze, { setup } from "adze"
import { format } from "date-fns/format"

setup({
	activeLevel: 3,
	format: "pretty",
	timestampFormatter: (date: Date) => format(date, "yyyy-MM-dd HH:mm:ss")
})
const logger = adze.withEmoji.timestamp.seal()

const here = process.env.ICA_DIR as string
const info = (msg: string) => logger.info(msg)
const error = (msg: string) => logger.error(msg)

const open = (filename: string): void => {
	($`open ${filename}`).catch((err) => {
		const { message, exitCode } = err as $.ShellError
		error(`opening ${filename} failed with error ${message} (${exitCode})`)
	})
}

export const del = (filename: string): void => {
	unlink(filename, (err) => {
		err ? error(`error unlinking ${filename}: ${err.message}`) : info(`${filename} was deleted`)
	})
}

const subs = await watcher.subscribe(here, async (_err, events) => {
	events
		.filter((evt) => evt.type === "create" && evt.path.endsWith(".ica"))
		.map((evt) => {
			info(`${evt.path} was created`)
			return Bun.file(evt.path)
		})
		.filter((file) => file.size > 0)
		.forEach(async (file) => {
			const text = await file.text()
				.then((txt) => txt.replace("DesktopViewer-ForceFullScreenStartup=On", "DesktopViewer-ForceFullScreenStartup=Off"))
			const outfile = `/tmp/${file.name}`
			await Bun.write(outfile, text)
			open(outfile)
			del(file.name!)
		})
})
info(`started watcher on ${here}`)

process.on("SIGINT", async () => {
	info("closing watcher.")
	await subs.unsubscribe()
	process.exit(0)
})
