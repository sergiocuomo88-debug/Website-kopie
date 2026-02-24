# Trigger-Loop: Sync Plattform-Freigaben Flows

## Status: TEILWEISE BEHOBEN
**Datum:** 2026-02-24
**Betrifft:** Sync Plattform-Freigaben (Sendung → Content) & Sync Plattform-Freigaben (Content ← Sendung)
**Symptom:** Flows laufen endlos ohne manuelle Listenänderung, Microsoft Leistungswarnung erhalten

### Aktueller Zustand (2026-02-24)
| Flow | Status | Notiz |
|---|---|---|
| Sync Plattform-Freigaben (Sendung → Content) | **AKTIV** | Haupt-Sync läuft, Dauerloop gestoppt |
| Sync Plattform-Freigaben (Content ← Sendung) | **ABGESCHALTET** | Manuell deaktiviert als Sofortmaßnahme |

> **Achtung:** Der direkte Ping-Pong-Loop ist gestoppt, aber es muss noch geprüft werden,
> ob andere aktive Flows indirekt denselben Rückweg erzeugen (siehe Abschnitt "Audit-Checkliste").

---

## Problem

Die beiden Flows "Sync Plattform-Freigaben" synchronisieren Daten in entgegengesetzte Richtungen zwischen der **Sendungsliste** und dem **Content-Verzeichnis**. Jeder Flow triggert auf "Wenn ein Element erstellt oder geändert wird" in seiner jeweiligen Quell-Liste.

### Ablauf des Loops

```
1. Sendungsliste wird geändert (manuell oder durch Flow)
   → Triggert "Sync Plattform-Freigaben (Sendung → Content)"
   → Aktualisiert Plattform-Freigaben im Content-Verzeichnis

2. Content-Verzeichnis wurde geändert (durch Flow aus Schritt 1)
   → Triggert "Sync Plattform-Freigaben (Content ← Sendung)"
   → Aktualisiert Plattform-Freigaben in der Sendungsliste

3. Sendungsliste wurde geändert (durch Flow aus Schritt 2)
   → Zurück zu Schritt 1 → ENDLOSSCHLEIFE
```

### Auswirkungen
- Hunderte parallele Flow-Runs in "Warten"-Status
- Microsoft Leistungswarnung: Flow wird in 7 Tagen zwangsdeaktiviert
- Unnötiger API-Verbrauch (Aktionslimits werden überschritten)
- Potenzielle Dateninkonsistenz durch Race Conditions

---

## Fix: Trigger Conditions

### Option A: Editor-Prüfung (empfohlen)

Verhindert, dass Flow-eigene Änderungen den jeweils anderen Flow erneut triggern.

**In beiden Flows:** Trigger → Einstellungen → Trigger Conditions:

```
@not(equals(triggerOutputs()?['body/Editor/Email'], 'FLOW-SERVICE-ACCOUNT@wdr.de'))
```

> **Hinweis:** `FLOW-SERVICE-ACCOUNT@wdr.de` durch die tatsächliche E-Mail des Service-Accounts ersetzen, unter dem die Flows laufen. Diese findet man im Run-Verlauf unter den Trigger-Outputs → `Editor/Email`.

### Option B: FlowProcessing-Flag

1. In beiden Listen eine Ja/Nein-Spalte `FlowProcessing` anlegen (Default: Nein)
2. Trigger Condition in beiden Flows:
   ```
   @equals(triggerOutputs()?['body/FlowProcessing'], false)
   ```
3. Im Flow-Ablauf:
   - Zuerst: Element aktualisieren → `FlowProcessing = Ja`
   - Dann: Sync-Aktionen durchführen
   - Zuletzt: Element aktualisieren → `FlowProcessing = Nein`

### Option C: Zeitstempel-Vergleich

In beiden Listen eine DateTime-Spalte `LastFlowSync` anlegen. Der Flow setzt diese bei jeder Ausführung. Trigger Condition prüft, ob die letzte Änderung mehr als 5 Sekunden nach dem letzten Sync liegt:

```
@greater(
  ticks(triggerOutputs()?['body/Modified']),
  ticks(addSeconds(triggerOutputs()?['body/LastFlowSync'], 5))
)
```

---

## Umsetzung Schritt-für-Schritt

1. **Beide Flows deaktivieren** in Power Automate
2. **Service-Account E-Mail ermitteln:**
   - Einen der letzten (erfolgreichen) Runs öffnen
   - Trigger-Output anschauen → Feld `Editor/Email` notieren
3. **Trigger Condition einbauen** (Option A, B oder C — siehe oben)
4. **Concurrency Control aktivieren:**
   - In beiden Flows: Trigger → Einstellungen → Parallelität → auf `1` setzen
   - Das verhindert parallele Runs und reduziert Race Conditions
5. **Flows nacheinander wieder aktivieren:**
   - Erst "Sendung → Content" aktivieren
   - Manuell ein Element in der Sendungsliste ändern
   - Prüfen: Es sollte genau **1 Run** starten (nicht mehrere)
   - Dann "Content ← Sendung" aktivieren
   - Manuell ein Element im Content-Verzeichnis ändern
   - Prüfen: Es sollte genau **1 Run** starten

---

## Audit-Checkliste: Alle Flows auf Loop-Gefahr prüfen

Der direkte Ping-Pong zwischen Flow 1 und Flow 2 ist durch Abschalten von Flow 2 gestoppt.
**Aber:** Jeder andere Flow, der in die **Sendungsliste** oder das **Content-Verzeichnis** schreibt,
kann den Loop indirekt wieder auslösen.

### Gefährliche Szenarien

```
SZENARIO A — Indirekter Rückweg (HÖCHSTES RISIKO):
  Ein anderer Flow ersetzt den abgeschalteten Flow 2:

  Sendungsliste ──[Flow 1]──▶ Content-Verzeichnis
       ▲                            │
       │                     [Anderer Flow]
       │                            │
       └────────────────────────────┘
  → Endlosschleife wie vorher, nur über Umweg!

SZENARIO B — Self-Loop:
  Ein Flow triggert auf eine Liste und schreibt in dieselbe zurück.
  → Löst sich selbst in Endlosschleife aus.

SZENARIO C — Kaskade:
  Flow X ändert Content-Verzeichnis → Flow Y triggert darauf
  → Flow Y schreibt in Sendungsliste → Flow 1 triggert → Loop
```

### Schritt-für-Schritt Prüfung in Power Automate

Für **jeden aktiven Flow** in deiner Umgebung folgende Fragen beantworten:

#### Schritt 1: Flow-Liste erstellen
Gehe zu Power Automate → Meine Flows → Liste aller aktiven Flows notieren.

#### Schritt 2: Jeden Flow einzeln prüfen

| Frage | Wo nachschauen | Gefährlich wenn... |
|---|---|---|
| **A) Worauf triggert der Flow?** | Flow öffnen → Trigger-Schritt ganz oben → Listenname ablesen | Er triggert auf **Sendungsliste** oder **Content-Verzeichnis** |
| **B) In welche Liste(n) schreibt er?** | Alle Aktionen durchgehen → "Element aktualisieren" / "Element erstellen" → Ziel-Liste ablesen | Er schreibt in **Sendungsliste** oder **Content-Verzeichnis** |
| **C) Hat er eine Trigger Condition?** | Trigger → ⋮ Menü → Einstellungen → Trigger Conditions | Feld ist **leer** (= keine Bedingung, jede Änderung löst aus) |
| **D) Ist Parallelität begrenzt?** | Trigger → ⋮ Menü → Einstellungen → Parallelität | Parallelität ist **nicht auf 1** gesetzt |

#### Schritt 3: Ergebnis einordnen

| Trigger-Liste | Schreibt in | Risiko | Erklärung |
|---|---|---|---|
| Sendungsliste | Content-Verzeichnis | **MITTEL** | Wie Flow 1, könnte Content-seitig Kette auslösen |
| Content-Verzeichnis | Sendungsliste | **KRITISCH** | Ersetzt den abgeschalteten Flow 2 → Ping-Pong! |
| Sendungsliste | Sendungsliste | **KRITISCH** | Self-Loop → triggert sich selbst endlos |
| Content-Verzeichnis | Content-Verzeichnis | **KRITISCH** | Self-Loop → triggert sich selbst endlos |
| Andere Liste | Sendungsliste | **MITTEL** | Kann Flow 1 triggern → prüfen ob Kaskade entsteht |
| Andere Liste | Content-Verzeichnis | **NIEDRIG** | Kein Rückweg, solange Flow 2 aus bleibt |
| Andere Liste | Andere Liste | **KEIN RISIKO** | Unabhängig von der Freigaben-Sync-Kette |

### Bekannte verdächtige Flows

| Flow | Vermuteter Trigger | Vermutetes Ziel | Risiko | Status |
|---|---|---|---|---|
| `sync-sendungs-stand` | Sendungsliste? | Sendungsliste? | **HOCH** — Self-Loop möglich | ⬜ Noch zu prüfen |
| `sync-sendungs-stand-from-content` | Content-Verzeichnis? | Sendungsliste? | **KRITISCH** — Indirekter Rückweg! | ⬜ Noch zu prüfen |
| `sync-content-elemente-lookup` | Unbekannt | Content-Verzeichnis? | **MITTEL** — Kaskade möglich | ⬜ Noch zu prüfen |

### Quick-Check: 3er-Batch-Runs klären

Im Flow-Verlauf von "Sendung → Content" sind Gruppen von je 3 Runs zur gleichen Zeit sichtbar.
Um zu klären, ob diese von einem anderen Flow stammen:

1. Einen der 3er-Runs öffnen (z.B. von 16:56)
2. Trigger-Schritt aufklappen
3. Feld **`Editor/Email`** prüfen:
   - **Dein Name** → Du hast die Änderung ausgelöst (kein Problem)
   - **Service-Account / anderer Name** → Ein anderer Flow hat die Sendungsliste geändert → **Loop-Gefahr!**

---

## Referenzen
- [Microsoft: Trigger Conditions](https://learn.microsoft.com/en-us/power-automate/triggers-introduction#trigger-conditions)
- [Microsoft: Aktionslimits für Power Automate](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- [Microsoft: Concurrency Control](https://learn.microsoft.com/en-us/power-automate/configure-settings)
