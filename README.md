# fsmon

[![Tests](https://github.com/jvorhauer/fsmon/actions/workflows/test.yml/badge.svg)](https://github.com/jvorhauer/fsmon/actions/workflows/test.yml)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![macOS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=macos&logoColor=F0F0F0)](https://www.apple.com/macos/macos-sequoia/)

FileSystem MONitor: monitor one directory/folder for the arrival of `ica` files, Citrix-specific files.

*Maybe rename to ICAfixer?*

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

Run all tests:

```sh
bun test
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

Building a standalone executable can be achieved by running

```sh
bun build
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

