# brandomica

CLI tool for [Brandomica Lab](https://www.brandomica.com) — brand name verification from the terminal.

Check your brand name across domains, social handles, trademarks, web presence, app stores, and package registries. Get safety scores, filing readiness, and full reports — all from the command line.

## Install

```bash
npm install -g brandomica
```

Or run directly:

```bash
npx brandomica check acme
```

## Commands

### `check <name>` — Full brand check

```bash
brandomica check acme           # Full check (score + safety + evidence)
brandomica check acme --quick   # Quick mode (fewer checks, faster)
brandomica check acme --json    # Raw JSON output
```

### `compare <names...>` — Compare brands

```bash
brandomica compare acme nimbus zenflow
```

### `batch <names...>` — Batch check

```bash
brandomica batch acme nimbus zenflow spark bolt     # Quick mode (default)
brandomica batch acme nimbus --mode full             # Full mode
```

### `domains <name>` — Domain availability

```bash
brandomica domains acme
```

### `social <name>` — Social handles

```bash
brandomica social acme
```

### `trademarks <name>` — Trademark search

```bash
brandomica trademarks acme
```

### `safety <name>` — Safety assessment

```bash
brandomica safety acme
```

### `filing <name>` — Filing readiness

```bash
brandomica filing acme
```

### `report <name>` — Full brand report

```bash
brandomica report acme
brandomica report acme --save report.json   # Save to file
```

### `health` — API health

```bash
brandomica health
```

## Global Flags

| Flag | Description |
|------|-------------|
| `--json` | Raw JSON output (pipeable) |
| `--plain` | No colors or spinners (auto-detected when not a TTY) |
| `--api-url <url>` | Override API base URL |
| `-V, --version` | Show version |
| `-h, --help` | Show help |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success, no blockers |
| `1` | Error (API failure, invalid input, network) |
| `2` | Success but brand has safety blockers (for CI) |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `BRANDOMICA_API_URL` | Override API base URL (default: `https://www.brandomica.com`) |
| `NO_COLOR` | Disable colors (respects [no-color.org](https://no-color.org)) |

## CI Integration

```bash
# Check for blockers before deploying
brandomica check mybrand --json | jq '.safety.blockers | length'

# Exit code 2 = blockers found
brandomica safety mybrand || echo "Safety blockers detected"
```

## License

MIT
