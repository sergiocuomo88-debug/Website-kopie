# Trigger-Loop: Sync Plattform-Freigaben Flows

## Status: KRITISCH
**Datum:** 2026-02-24
**Betrifft:** Sync Plattform-Freigaben (Sendung → Content) & Sync Plattform-Freigaben (Content ← Sendung)
**Symptom:** Flows laufen endlos ohne manuelle Listenänderung, Microsoft Leistungswarnung erhalten

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

## Weitere betroffene Flow-Paare prüfen

Gleiche Logik könnte auch bei diesen Flows greifen:

| Flow | Prüfen ob Loop möglich |
|---|---|
| `sync-sendungs-stand.json` | Schreibt in Sendungsliste zurück? |
| `sync-sendungs-stand-from-content.json` | Triggert auf Content + schreibt in Sendung? |
| `sync-content-elemente-lookup.json` | Lookup-Aktualisierung könnte Trigger auslösen |

---

## Referenzen
- [Microsoft: Trigger Conditions](https://learn.microsoft.com/en-us/power-automate/triggers-introduction#trigger-conditions)
- [Microsoft: Aktionslimits für Power Automate](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- [Microsoft: Concurrency Control](https://learn.microsoft.com/en-us/power-automate/configure-settings)
