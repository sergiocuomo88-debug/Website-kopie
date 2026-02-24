# Projekt-Kontext: ARD Stand-Up O365 Power Automate Flows

## SharePoint-Umgebung

- **Site:** `https://wdr.sharepoint.com/teams/ARDStand-UpO365`

### SharePoint-Listen

| Interner Name (GUID) | Liste |
|---|---|
| `08c76ffb-e10b-4158-92b5-73a509a221cc` | **Sendungsliste** |
| `6e406f83-7400-4568-88d3-25469885a7da` | **Content-Verzeichnis** |

### Feld-Mapping

| API-Feldname | Anzeigename | Liste | Pflichtfeld | Hinweise |
|---|---|---|---|---|
| `field_2` | **Rechte von** | Sendungsliste | **JA** | Muss bei jedem PATCH mitgesendet werden, sonst schlägt das Update fehl |
| `field_20` / `field_20/Value` | **Aggregierter Status** | Sendungsliste | Nein | Werte: "Fertig", "In Bearbeitung", "Abnahmebereit" |
| `Bearbeitungsstautus` | **Bearbeitungsstatus** | Content-Verzeichnis | Nein | Werte: "Entwurf", "In Bearbeitung", "Abnahmebereit", "Fertig" |
| `Folge_x003a__x0020_Nr_x002e_ID` | **Folge: Nr. ID** (Lookup) | Content-Verzeichnis | Nein | Lookup-Spalte zur Sendungsliste |

## Aktive Power Automate Flows

### Flow 1: Sync Plattform-Freigaben (Sendung → Content)
- **Trigger:** Sendungsliste geändert
- **Schreibt in:** Content-Verzeichnis
- **Risiko:** Teil des bidirektionalen Sync-Loops

### Flow 4: Sync Sendungs-Stand ← Content
- **ID:** `9bcce54b-395e-4a9b-91ed-700da09af079`
- **Trigger:** Content-Verzeichnis geändert (Polling alle 5 Min, Concurrency: 1)
- **Logik:** Berechnet aggregierten Bearbeitungsstatus aller Content-Items einer Sendung
- **Schreibt in:** Sendungsliste (`field_20` = aggregierter Status, `field_2` = Rechte von als Pflichtfeld)
- **Safeguard:** Schreibt nur, wenn sich der Status tatsächlich geändert hat (Bedingung_3)
- **Risiko:** Teil des bidirektionalen Sync-Loops mit Flow 1

### Bekannter Loop-Pfad
```
Sendungsliste ──[Flow 1]──▶ Content-Verzeichnis
      ▲                              │
      │         [Flow 4]             │
      └──────────────────────────────┘
```
Safeguard: Flow 4 schreibt nur bei Status-Differenz → Loop endet nach max. 2 Zyklen.
Aber: Jeder Zyklus verbraucht API-Calls und kann bei vielen gleichzeitigen Änderungen zu Throttling führen.
