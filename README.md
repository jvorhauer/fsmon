# fsmon

FileSystem MONitor: monitor one directory/folder for the arrival of `ica` files, Citrix-specific files.

[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

[![CI](https://github.com/jvorhauer/fsmon/actions/workflows/biome.yaml/badge.svg)](https://github.com/jvorhauer/fsmon/actions/workflows/biome.yaml)

## Why?

The client where I'm stationed at the moment is allowing remote work via **Citrix**.
Unfortunately their Citrix configuration file (`.ica`) has the full screen modus activated, which is not how I like it.
So, this little program watches a (download) directory of choice and replaces the full screen line with a line that disables full screen.
Then, the modified `.ica` file is opened, as my browser (Safari or Orion) does not do that automatically.

## Requirements

* a UNIX-like OS, such as Linux or macOS
* Bun, version **1.1.34** or later
* Citrix Workspace installed, version 24.02.10.6 or later

## Configuration

Make a `.env` file in this projects' root directory and put the line

```env
ICA_DIR=/some/where/over/the/rainbow
```

Now start the monitor with (with watch for changes)

```bash
bun dev
```

or (not watching for changes)

```bash
bun start
```

## build cli executable

```bash
bun build ./parcl.ts --compile --outfile fsmon
```

then execute the result:

```bash
./fsmon
```

Add an & after that command to run in the background. Make sure all errors are handled as the program will exit on error!

```bash
./fsmon &
```

When the executable is sufficiently stable, the fsmon executable can be moved to a direcotry in the path.

## Original README

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.15. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
