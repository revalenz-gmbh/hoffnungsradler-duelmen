#!/usr/bin/env bash
# Holt den neuesten Stand eines Branches, baut ihn und schaltet um, wenn alles läuft.
#
# Aufruf: aktualisieren.sh <instanz>        (z. B. "live" oder "vorschau")
#
# Erwartet:
#   /etc/hoffnungsradler/<instanz>.env   Umgebungsvariablen (BRANCH, PORT, Geheimnisse …)
#   /opt/hoffnungsradler/<instanz>/repo  git clone des Repos
# Legt an:
#   /opt/hoffnungsradler/<instanz>/releases/<commit>  gebaute Stände (die letzten 3 bleiben)
#   /opt/hoffnungsradler/<instanz>/current            Symlink auf den laufenden Stand
#
# Läuft als root (für systemctl), baut aber als Benutzer "hoffnungsradler".
# Wird vom Timer hoffnungsradler-update@<instanz>.timer alle 2 Minuten gestartet und
# tut nichts, solange es keinen neuen Commit gibt.
set -euo pipefail

INSTANZ="${1:?Instanz fehlt (z. B. live oder vorschau)}"
BASIS="/opt/hoffnungsradler/${INSTANZ}"
ENV_DATEI="/etc/hoffnungsradler/${INSTANZ}.env"
BENUTZER="hoffnungsradler"
DIENST="hoffnungsradler-web@${INSTANZ}.service"
BEHALTEN=3

als_benutzer() { runuser -u "$BENUTZER" -- env HOME="/home/${BENUTZER}" "$@"; }
log() { echo "[aktualisieren ${INSTANZ}] $*"; }

# Nur ein Lauf gleichzeitig pro Instanz
exec 9>"/run/hoffnungsradler-${INSTANZ}.lock"
flock -n 9 || { log "läuft bereits"; exit 0; }

# Umgebung laden (VITE_* werden beim Bauen ins Bundle geschrieben)
set -a
# shellcheck source=/dev/null
. "$ENV_DATEI"
set +a
BRANCH="${BRANCH:-main}"
PORT="${PORT:?PORT fehlt in ${ENV_DATEI}}"

cd "${BASIS}/repo"
als_benutzer git fetch --quiet origin "$BRANCH"
NEU="$(als_benutzer git rev-parse "origin/${BRANCH}")"
AKTUELL="$(basename "$(readlink -f "${BASIS}/current" 2>/dev/null || echo keiner)")"

if [[ "$NEU" == "$AKTUELL" && "${ERZWINGEN:-0}" != "1" ]]; then
  exit 0
fi
log "neuer Stand ${NEU:0:7} auf ${BRANCH} (bisher ${AKTUELL:0:7})"

RELEASE="${BASIS}/releases/${NEU}"
rm -rf "$RELEASE"
als_benutzer mkdir -p "$RELEASE"
als_benutzer bash -c "git archive '${NEU}' | tar -x -C '${RELEASE}'"

cd "$RELEASE"
log "npm ci …"
als_benutzer npm ci --no-audit --no-fund --loglevel=error
log "Build …"
als_benutzer npm run build

# Rauchtest auf einem freien Port, bevor umgeschaltet wird
TESTPORT=$((PORT + 100))
# Antwortet auf dem Testport schon etwas, ist es ein Rest eines früheren Laufs. Der Test
# fragte dann diesen alten Server und bestünde, egal ob der neue Stand läuft.
if curl -fsS "http://127.0.0.1:${TESTPORT}/healthz" >/dev/null 2>&1; then
  log "FEHLER: Testport ${TESTPORT} ist schon belegt, bleibe auf ${AKTUELL:0:7}"
  exit 1
fi
log "Rauchtest auf Port ${TESTPORT} …"
# 9>&-: Der Testserver darf die Sperre nicht erben, sonst blockiert ein Rest jeden weiteren Lauf.
als_benutzer env PORT="$TESTPORT" HOST=127.0.0.1 node server/server.mjs >/dev/null 2>&1 9>&- &
TESTPID=$!
# runuser reicht SIGTERM nicht an node weiter: erst das Kind beenden, dann runuser.
stoppe_test() {
  pkill -TERM -P "$TESTPID" 2>/dev/null || true
  kill "$TESTPID" 2>/dev/null || true
  wait "$TESTPID" 2>/dev/null || true
}
trap stoppe_test EXIT
ok=0
for _ in $(seq 1 20); do
  if curl -fsS "http://127.0.0.1:${TESTPORT}/healthz" >/dev/null 2>&1 \
     && curl -fsS "http://127.0.0.1:${TESTPORT}/" | grep -q '<div id="root">'; then
    ok=1; break
  fi
  sleep 0.5
done
stoppe_test
trap - EXIT
if [[ $ok != 1 ]]; then
  log "FEHLER: Rauchtest fehlgeschlagen, bleibe auf ${AKTUELL:0:7}"
  exit 1
fi

# Umschalten (atomar) und neu starten
VORHER="$(readlink -f "${BASIS}/current" 2>/dev/null || true)"
ln -sfn "$RELEASE" "${BASIS}/current.neu"
mv -T "${BASIS}/current.neu" "${BASIS}/current"
systemctl restart "$DIENST"

ok=0
for _ in $(seq 1 20); do
  if curl -fsS "http://127.0.0.1:${PORT}/healthz" >/dev/null 2>&1; then ok=1; break; fi
  sleep 0.5
done
if [[ $ok != 1 ]]; then
  log "FEHLER: ${DIENST} antwortet nach Umschalten nicht, zurück auf ${VORHER##*/}"
  if [[ -n "$VORHER" ]]; then
    ln -sfn "$VORHER" "${BASIS}/current.neu"
    mv -T "${BASIS}/current.neu" "${BASIS}/current"
    systemctl restart "$DIENST"
  fi
  exit 1
fi
log "live: ${NEU:0:7}"

# Alte Stände aufräumen (der laufende bleibt immer)
cd "${BASIS}/releases"
ls -1t | tail -n +$((BEHALTEN + 1)) | while read -r alt; do
  [[ "${BASIS}/releases/${alt}" == "$(readlink -f "${BASIS}/current")" ]] && continue
  rm -rf "${BASIS}/releases/${alt}"
done
