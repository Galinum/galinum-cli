#!/usr/bin/env bash
# Galinum CLI installer
#
# Usage:
#   curl -fsSL https://galinum.com/install.sh | bash
#   curl -fsSL https://galinum.com/install.sh | bash -s v0.2.2
#
# Environment variables:
#   GALINUM_INSTALL  Custom install directory (default: ~/.galinum)
#   GITHUB_BASE      Custom GitHub base URL (default: https://github.com)

main() {
set -euo pipefail

color_off="" red="" green="" yellow="" dim="" bold="" blue=""

if [[ -t 1 ]]; then
  color_off="\033[0m"
  red="\033[0;31m"
  green="\033[0;32m"
  yellow="\033[0;33m"
  dim="\033[0;2m"
  bold="\033[1m"
  blue="\033[0;34m"
fi

error() {
  printf "%b\n" "${red}error${color_off}: $*" >&2
  exit 1
}

warn() {
  printf "%b\n" "${yellow}warn${color_off}: $*" >&2
}

info() {
  printf "%b\n" "${dim}$*${color_off}"
}

success() {
  printf "%b\n" "${green}$*${color_off}"
}

heading() {
  printf "%b\n" "${bold}$*${color_off}"
}

tildify() {
  if [[ $1 == "$HOME"/* ]]; then
    echo "~${1#"$HOME"}"
  else
    echo "$1"
  fi
}

command -v curl >/dev/null 2>&1 || error "curl is required but was not found."
command -v tar >/dev/null 2>&1 || error "tar is required but was not found."

platform=$(uname -ms)

case "$platform" in
  "Darwin arm64") target="darwin-arm64" ;;
  "Darwin x86_64") target="darwin-x64" ;;
  "Linux aarch64") target="linux-arm64" ;;
  "Linux arm64") target="linux-arm64" ;;
  "Linux x86_64") target="linux-x64" ;;
  *)
    error "Unsupported platform: ${platform}.

  Galinum CLI supports:
    - macOS (Apple Silicon / Intel)
    - Linux (x64 / arm64)

  Fallback:
    npm install -g @galinum/cli"
    ;;
esac

if [[ $target == "darwin-x64" ]]; then
  if [[ $(sysctl -n sysctl.proc_translated 2>/dev/null || echo 0) == "1" ]]; then
    target="darwin-arm64"
    info "  Rosetta 2 detected; installing native arm64 binary."
  fi
fi

if [[ $target == linux-* ]]; then
  if ldd --version 2>&1 | grep -qi musl 2>/dev/null; then
    error "Alpine Linux (musl) is not currently supported.

  Fallback:
    npm install -g @galinum/cli"
  fi
fi

GITHUB_BASE=${GITHUB_BASE:-"https://github.com"}
case "$GITHUB_BASE" in
  https://*) ;;
  *) error "GITHUB_BASE must start with https:// (got: ${GITHUB_BASE})" ;;
esac

repo="${GITHUB_BASE}/Galinum/galinum-cli"
version="${1:-}"

if [[ -n $version ]]; then
  version="${version#v}"
  if ! [[ $version =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
    error "Invalid version format: ${version}

  Expected: 0.2.2 or v0.2.2"
  fi
  url="${repo}/releases/download/v${version}/galinum-${target}.tar.gz"
else
  url="${repo}/releases/latest/download/galinum-${target}.tar.gz"
fi

install_dir="${GALINUM_INSTALL:-$HOME/.galinum}"
bin_dir="${install_dir}/bin"
exe="${bin_dir}/galinum"

mkdir -p "$bin_dir" || error "Failed to create install directory: ${bin_dir}"

echo ""
heading "Installing Galinum CLI..."
echo ""

tmpdir=$(mktemp -d) || error "Failed to create temporary directory."
trap 'rm -rf "$tmpdir"' EXIT INT TERM

archive="${tmpdir}/galinum.tar.gz"

info "  Downloading ${url}"
echo ""

curl --fail --location --progress-bar --output "$archive" "$url" ||
  error "Download failed.

  Possible causes:
    - No internet connection
    - The requested version does not exist: ${version:-latest}
    - GitHub Releases does not have a Galinum CLI binary for ${target}

  Fallback:
    npm install -g @galinum/cli"

tar -xzf "$archive" -C "$bin_dir" ||
  error "Failed to extract archive. The download may be corrupted."

chmod +x "$exe" || error "Failed to make binary executable."

if [[ $(uname -s) == "Darwin" ]]; then
  xattr -d com.apple.quarantine "$exe" 2>/dev/null || true
fi

installed_version=$("$exe" --version 2>/dev/null || echo "unknown")

echo ""
success "Galinum CLI ${installed_version} installed successfully."
info "Binary: $(tildify "$exe")"

if command -v galinum >/dev/null 2>&1; then
  existing=$(command -v galinum)
  if [[ "$existing" == "$exe" ]]; then
    echo ""
    heading "Run ${blue}galinum help${color_off}${bold} to get started.${color_off}"
    echo ""
    return
  fi
  warn "another 'galinum' was found at ${existing}; the new binary may be shadowed."
fi

if echo "$PATH" | tr ":" "\n" | grep -qxF "$bin_dir" 2>/dev/null; then
  echo ""
  heading "Run ${blue}galinum help${color_off}${bold} to get started.${color_off}"
  echo ""
  return
fi

echo ""
info "Add Galinum to PATH:"
printf "%s\n" "  export PATH=\"$(tildify "$bin_dir"):\$PATH\""
echo ""
info "Then run:"
printf "%s\n" "  galinum help"
echo ""
}

main "$@"
