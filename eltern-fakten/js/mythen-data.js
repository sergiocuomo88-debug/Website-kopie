/* ============================
   eltern-fakten – Mythen-Datenbank
   15 initiale Mythen, priorisiert nach
   Emotion + Suchvolumen (Reddit-Recherche)
   ============================ */

const MythenDB = [
    {
        id: "durchschlafen",
        mythos: "Babys müssen spätestens mit 6 Monaten durchschlafen",
        bewertung: "falsch",
        emotion: 5,
        kategorie: "schlafen",
        kurzantwort: "Falsch. „Durchschlafen" bedeutet in der Schlafforschung nur 5–6 Stunden am Stück – nicht 8 oder 12. Viele Babys wachen bis weit ins 2. Lebensjahr nachts auf, und das ist biologisch völlig normal.",
        erklaerung: "Der Mythos vom durchschlafenden Baby ist einer der größten Stressfaktoren für junge Eltern. In der Forschung gilt ein Baby bereits als „durchschlafend", wenn es 5–6 Stunden am Stück schläft – meist von Mitternacht bis 5 Uhr morgens. Das ist weit entfernt von dem, was die meisten Eltern sich darunter vorstellen.\n\nSchlafmuster sind stark vom Temperament des Kindes, dem Alter und der Entwicklungsphase abhängig. Häufiges Aufwachen im ersten Jahr ist kein Zeichen dafür, dass Eltern etwas „falsch machen". Im Gegenteil: Nächtliches Aufwachen hat evolutionär eine Schutzfunktion und ist bei gestillten Babys besonders häufig.\n\nSogenannte „Schlafregressionen" (z.B. mit 4, 8, 12 Monaten) sind ebenfalls normal und spiegeln Entwicklungsschübe wider, keine Probleme.",
        quellen: [
            { name: "Mindell et al. (2010): Behavioral Treatment of Bedtime Problems and Night Wakings", org: "Sleep Medicine" },
            { name: "Pennestri et al. (2018): Sleeping Through the Night in 6–12 Month Old Infants", org: "Pediatrics" },
            { name: "Bundeszentrale für gesundheitliche Aufklärung (BZgA): Babyschlaf", org: "kindergesundheit-info.de" }
        ],
        herkunft: "Kommt häufig von der älteren Generation („meine Kinder haben mit 3 Monaten durchgeschlafen"), von Schlafcoach-Marketing auf Instagram und von Social-Media-Posts über „Unicorn Babies", die angeblich 12 Stunden schlafen.",
        verwandt: ["schlaftraining-schadet", "familienbett"],
        tags: ["durchschlafen", "schlaf", "nacht", "aufwachen", "schlafregression", "wachfenster"]
    },
    {
        id: "schlaftraining-schadet",
        mythos: "Schreien lassen (Cry-it-out) schädigt die Bindung dauerhaft",
        bewertung: "falsch",
        emotion: 5,
        kategorie: "schlafen",
        kurzantwort: "Falsch. Mehrere Langzeitstudien (bis 5 Jahre Follow-up) zeigen keine Unterschiede in Bindungsqualität oder Verhaltensproblemen zwischen Kindern, die mit Schlaftraining begleitet wurden, und Kontrollgruppen.",
        erklaerung: "Dieses Thema ist einer der emotionalsten Streitpunkte in Elternforen. Die Angst basiert auf einer Fehlinterpretation der Bindungstheorie: Demnach würde jedes Schreienlassen die Bindung beschädigen.\n\nDie Forschungslage zeigt jedoch ein anderes Bild: Eine australische Studie (Gradisar et al., 2016) verglich verschiedene Schlaftraining-Methoden und fand nach 3 Monaten keine erhöhten Cortisol-Werte bei den Kindern. Ein 5-Jahres-Follow-up (Price et al., 2012) fand keine Unterschiede in emotionaler Entwicklung, Bindung oder Verhalten.\n\nDas bedeutet nicht, dass Schlaftraining für jede Familie richtig ist. Es ist eine Option unter vielen. Aber die Behauptung, es verursache dauerhafte Schäden, ist wissenschaftlich nicht haltbar.\n\nWichtig: Schlaftraining wird vor 4–6 Monaten generell nicht empfohlen, da der Schlaf neurologisch noch zu unreif ist.",
        quellen: [
            { name: "Gradisar et al. (2016): Behavioral Interventions for Infant Sleep Problems", org: "Pediatrics" },
            { name: "Price et al. (2012): Five-Year Follow-up of Sleep Intervention", org: "Pediatrics" },
            { name: "Mindell et al. (2006): Behavioral Treatment of Bedtime Problems", org: "Sleep" }
        ],
        herkunft: "Verbreitet durch Anti-Schlaftraining-Influencer (z.B. HeySleepyBaby auf Instagram), Attachment-Parenting-Blogs und eine vereinfachte Darstellung von Bindungstheorie auf Social Media.",
        verwandt: ["durchschlafen", "verwoehnen"],
        tags: ["schlaftraining", "cry it out", "CIO", "ferber", "schreien lassen", "bindung", "cortisol"]
    },
    {
        id: "formula-schadet",
        mythos: "Säuglingsnahrung (Formula) macht Babys dick und dumm",
        bewertung: "falsch",
        emotion: 5,
        kategorie: "ernaehrung",
        kurzantwort: "Falsch. Moderne Säuglingsnahrung ernährt Babys sicher und vollwertig. Die messbaren Vorteile des Stillens sind in entwickelten Ländern deutlich kleiner als oft kommuniziert. Bindung entsteht durch Zuwendung, nicht durch die Ernährungsform.",
        erklaerung: "Der Satz „Breast is best" hat Generationen von Müttern enormen Druck gemacht. Die Realität ist differenzierter:\n\nStillen hat nachgewiesene Vorteile (z.B. bei Infektionsschutz in den ersten Monaten, Risikoreduktion für NEC bei Frühgeborenen). Aber: In Ländern mit sauberem Wasser und guter Gesundheitsversorgung sind die messbaren Langzeitunterschiede zwischen gestillten und formula-ernährten Kindern gering.\n\nGroße Geschwisterstudien (die genetische und sozioökonomische Faktoren kontrollieren) zeigen kaum noch Unterschiede bei IQ, Adipositas oder Langzeitgesundheit.\n\nBindung entsteht durch feinfühlige Interaktion – durch Blickkontakt, Hautkontakt, Trösten – nicht durch die Art der Milch.",
        quellen: [
            { name: "Colen & Ramey (2014): Is Breast Truly Best? (Geschwisterstudie)", org: "Social Science & Medicine" },
            { name: "DGKJ: Ernährung von Säuglingen – Empfehlungen", org: "Deutsche Gesellschaft für Kinder- und Jugendmedizin" },
            { name: "WHO: Infant and young child feeding", org: "Weltgesundheitsorganisation" }
        ],
        herkunft: "Kommt aus „Breast is best"-Kampagnen, Krankenhausplakaten, Stillberaterinnen und Instagram-Stillaccounts. Viele Mütter berichten auf Reddit von massivem Druck und Schuldgefühlen.",
        verwandt: ["stillen-immer-moeglich"],
        tags: ["formula", "flasche", "stillen", "muttermilch", "pre-nahrung", "breast is best", "flaschenkind"]
    },
    {
        id: "stillen-immer-moeglich",
        mythos: "Stillen ist immer möglich – wer es nicht schafft, hat sich nicht genug angestrengt",
        bewertung: "falsch",
        emotion: 5,
        kategorie: "ernaehrung",
        kurzantwort: "Falsch. Etwa 5–15% der Frauen haben physiologische Gründe, die ausreichende Milchbildung erschweren oder verhindern. Dazu gehören Brustdrüsengewebe-Mangel, hormonelle Störungen, bestimmte Medikamente und frühere Operationen.",
        erklaerung: "Der Mythos „Jede Frau kann stillen" setzt Mütter unter enormen Druck und kann zu ernsthaften psychischen Belastungen führen.\n\nReale Gründe für unzureichende Milchbildung:\n• Insuffizientes Drüsengewebe (IGT/Hypoplasie)\n• Hormonelle Faktoren (PCOS, Schilddrüse, Diabetes)\n• Brustoperationen (Reduktion, Implantate)\n• Bestimmte Medikamente\n• Frühgeburt oder Kaiserschnitt (verzögerter Milcheinschuss)\n• Zungenbändchen beim Baby\n\nForschung zeigt: Die Rate an echten Stillproblemen wird systematisch unterschätzt, weil Frauen, die aufhören, als „nicht genug bemüht" abgestempelt werden, statt dass die physiologischen Ursachen anerkannt werden.\n\nDie beste Empfehlung: „Informed is best" – eine informierte Entscheidung ist besser als Dogma in jede Richtung.",
        quellen: [
            { name: "Neifert (2001): Prevention of Breastfeeding Tragedies", org: "Pediatric Clinics of North America" },
            { name: "BZgA: Stillen – was tun bei Problemen?", org: "kindergesundheit-info.de" },
            { name: "Nationale Stillkommission am BfR", org: "Bundesinstitut für Risikobewertung" }
        ],
        herkunft: "Verbreitet durch die „Breast is best"-Bewegung, Baby-Friendly-Hospital-Initiative, manche Hebammen und Stillberaterinnen. Auf Social Media als moralischer Druck verstärkt.",
        verwandt: ["formula-schadet"],
        tags: ["stillen", "nicht stillen", "milchbildung", "milch", "zufüttern", "abstillen", "stillprobleme"]
    },
    {
        id: "impfen-autismus",
        mythos: "Impfungen verursachen Autismus",
        bewertung: "falsch",
        emotion: 5,
        kategorie: "gesundheit",
        kurzantwort: "Falsch. Diese Behauptung basiert auf einer 1998 gefälschten Studie von Andrew Wakefield, der seine Zulassung verlor. Dutzende Großstudien mit Millionen Kindern haben keinen Zusammenhang gefunden.",
        erklaerung: "Der Mythos geht zurück auf eine Studie von Andrew Wakefield (1998, The Lancet), die einen Zusammenhang zwischen MMR-Impfung und Autismus behauptete. Die Studie wurde zurückgezogen, nachdem aufgedeckt wurde, dass Wakefield Daten gefälscht hatte und finanzielle Interessen hatte. Er verlor seine ärztliche Zulassung.\n\nSeitdem haben zahlreiche große Studien den behaupteten Zusammenhang untersucht und widerlegt:\n• Eine dänische Studie (2019) mit über 650.000 Kindern fand keinen Zusammenhang.\n• Eine Meta-Analyse (2014) mit über 1,2 Millionen Kindern bestätigte: kein erhöhtes Autismusrisiko.\n\nWarum der Mythos trotzdem überlebt: Autismus wird oft im selben Alter diagnostiziert, in dem Kinder geimpft werden (12–18 Monate). Diese zeitliche Überschneidung wird fälschlich als Ursache interpretiert.\n\nVerzögerte Impfschemata haben keinen belegten Sicherheitsvorteil, erhöhen aber das Zeitfenster ohne Schutz vor Krankheiten.",
        quellen: [
            { name: "Hviid et al. (2019): MMR Vaccination and Autism (657.461 Kinder)", org: "Annals of Internal Medicine" },
            { name: "Taylor et al. (2014): Meta-Analyse zu Impfungen und Autismus (1,2 Mio. Kinder)", org: "Vaccine" },
            { name: "STIKO: Impfempfehlungen", org: "Robert Koch-Institut" }
        ],
        herkunft: "Geht zurück auf die gefälschte Wakefield-Studie (1998). Heute verbreitet über Anti-Vax-Influencer, Telegram-Kanäle und Social Media. In DACH auch durch anthroposophische Kreise und Heilpraktiker.",
        verwandt: [],
        tags: ["impfen", "impfung", "autismus", "MMR", "wakefield", "impfgegner", "impfschema"]
    },
    {
        id: "honig-erstes-jahr",
        mythos: "Babys dürfen im ersten Jahr keinen Honig essen",
        bewertung: "stimmt",
        emotion: 4,
        kategorie: "ernaehrung",
        kurzantwort: "Stimmt! Honig kann Sporen des Bakteriums Clostridium botulinum enthalten. Der Darm von Säuglingen unter 12 Monaten ist noch nicht reif genug, diese abzuwehren. Es droht Säuglingsbotulismus – selten, aber potenziell lebensbedrohlich.",
        erklaerung: "Dies ist einer der wenigen Mythen, die tatsächlich stimmen. Honig – egal ob roh, pasteurisiert oder in Backwaren – kann Sporen von Clostridium botulinum enthalten. Bei Erwachsenen und älteren Kindern werden diese Sporen im Darm neutralisiert. Bei Säuglingen unter 12 Monaten ist die Darmflora noch nicht ausgereift genug dafür.\n\nSäuglingsbotulismus kann zu Muskelschwäche, Trinkschwäche, Verstopfung und in schweren Fällen zu Atemlähmung führen.\n\nWichtig: Auch Ahornsirup und Maissirup können theoretisch betroffen sein. In gekochten Speisen werden die Sporen NICHT zuverlässig zerstört, da sie extrem hitzeresistent sind.\n\nAb dem 1. Geburtstag ist Honig unbedenklich.",
        abWann: "Ab 12 Monaten unbedenklich",
        quellen: [
            { name: "BfR: Säuglingsbotulismus durch Honig", org: "Bundesinstitut für Risikobewertung" },
            { name: "WHO: Complementary Feeding Guidelines", org: "Weltgesundheitsorganisation" },
            { name: "DGKJ: Empfehlung zur Säuglingsernährung", org: "Deutsche Gesellschaft für Kinder- und Jugendmedizin" }
        ],
        herkunft: "Dies ist eine korrekte und wichtige medizinische Empfehlung, die von allen großen Gesundheitsorganisationen geteilt wird.",
        verwandt: [],
        tags: ["honig", "botulismus", "beikost", "1 jahr", "essen", "gefährlich"]
    },
    {
        id: "bernsteinkette",
        mythos: "Bernsteinketten helfen gegen Zahnungsschmerzen",
        bewertung: "falsch",
        emotion: 5,
        kategorie: "hausmittel",
        kurzantwort: "Falsch und gefährlich. Bernstein gibt bei Körpertemperatur kein schmerzlinderndes Succinat ab. Gleichzeitig besteht reales Strangulations- und Erstickungsrisiko durch verschluckte Perlen. Es gibt dokumentierte Todesfälle.",
        erklaerung: "Die Behauptung: Bernstein enthält Bernsteinsäure (Succinat), die bei Hautkontakt freigesetzt wird und schmerzlindernd wirkt. Die Realität: Bernstein müsste auf über 200°C erhitzt werden, um Bernsteinsäure freizusetzen. Bei Körpertemperatur passiert nichts.\n\nDie echten Gefahren:\n• Strangulationsrisiko: Auch „Sicherheitsverschlüsse" haben versagt – es gibt dokumentierte Todesfälle.\n• Erstickungsrisiko: Kleine Perlen können sich lösen und verschluckt/eingeatmet werden.\n• Viele Kitas und Kinderärzte verbieten Bernsteinketten ausdrücklich.\n\nWas stattdessen hilft: Gekühlte Beißringe, sanftes Zahnfleischmassieren, bei starken Schmerzen altersgerechte Schmerzmedikation (z.B. Ibuprofen ab 6 Monaten) nach Absprache mit dem Kinderarzt.",
        quellen: [
            { name: "BfArM: Warnung vor Erstickungsgefahr durch Bernsteinketten", org: "Bundesinstitut für Arzneimittel und Medizinprodukte" },
            { name: "AAP: Choking Prevention (Schmuck bei Säuglingen)", org: "American Academy of Pediatrics" },
            { name: "Cox et al. (2017): Safety and Efficacy of Teething Necklaces", org: "Canadian Family Physician" }
        ],
        herkunft: "Verbreitet durch Esoterik-Shops, manche Hebammen, Instagram-„Granola Moms" und Naturheilkunde-Blogs. In DACH besonders populär durch Drogerieregale und Babygeschäfte, die sie aktiv bewerben.",
        verwandt: ["globuli"],
        tags: ["bernsteinkette", "zahnen", "zahnungsschmerzen", "amber", "bernstein", "strangulation", "erstickung"]
    },
    {
        id: "familienbett",
        mythos: "Familienbett ist entweder immer tödlich oder immer völlig sicher",
        bewertung: "teilweise",
        emotion: 5,
        kategorie: "schlafen",
        kurzantwort: "Weder noch. Bedsharing hat ein statistisch erhöhtes SIDS-Risiko gegenüber dem eigenen Babybett im Elternzimmer. Aber: Unter bestimmten Bedingungen (kein Rauchen, kein Alkohol, stillendes Elternteil, feste Matratze) ist das Restrisiko gering. Die Wahrheit liegt zwischen den Extremen.",
        erklaerung: "Dieses Thema ist kulturell extrem aufgeladen – besonders zwischen US-amerikanischen und europäischen Empfehlungen:\n\n🇺🇸 USA (AAP): Klare Empfehlung gegen Bedsharing. Room-Sharing ja, Bed-Sharing nein.\n🇩🇪 DACH (Hebammenkultur): Familienbett ist weit verbreitet und wird oft aktiv empfohlen, mit Sicherheitsregeln.\n\nWas die Forschung zeigt:\n• Room-Sharing (Baby im eigenen Bett im Elternzimmer) senkt das SIDS-Risiko um etwa 50%.\n• Bedsharing erhöht das Risiko statistisch, ABER: Die größten Risikofaktoren sind Rauchen, Alkohol/Drogen, weiche Unterlagen und Sofa-Schlaf.\n• Bei nichtrauchenden, stillenden Müttern auf fester Matratze ohne Alkoholeinfluss ist das absolute Restrisiko gering.\n\nDie sicherste Option ist ein eigenes Babybett im Elternzimmer. Wenn Familien sich für Bedsharing entscheiden, sollten sie die Sicherheitsregeln kennen und konsequent umsetzen.",
        quellen: [
            { name: "DGKJ/DGSM: Empfehlungen zum sicheren Babyschlaf", org: "Deutsche Gesellschaft für Kinder- und Jugendmedizin" },
            { name: "Blair et al. (2014): Bedsharing and SIDS risk", org: "BMJ Open" },
            { name: "BZgA: Sicherer Schlafplatz für das Baby", org: "kindergesundheit-info.de" }
        ],
        herkunft: "Die Extrempositionen kommen von beiden Seiten: US-Sicherheitsgruppen verteufeln jedes Bedsharing, während manche Attachment-Parenting-Kreise jedes Risiko herunterspielen. Die Wahrheit ist nuanciert.",
        dpiNote: "DACH-spezifisch: In Deutschland ist das Familienbett kulturell viel akzeptierter als in den USA. Deutsche Hebammen empfehlen es häufig mit Sicherheitsregeln. Die AAP-Empfehlung (kein Bedsharing) wird in DACH deutlich kritischer gesehen.",
        verwandt: ["durchschlafen", "schlaftraining-schadet"],
        tags: ["familienbett", "co-sleeping", "cosleeping", "bedsharing", "SIDS", "plötzlicher kindstod", "ammenschlaf"]
    },
    {
        id: "blw-ersticken",
        mythos: "Baby-led Weaning (BLW) ist extrem gefährlich – Babys ersticken ständig",
        bewertung: "falsch",
        emotion: 5,
        kategorie: "ernaehrung",
        kurzantwort: "Falsch. Studien zeigen kein erhöhtes Erstickungsrisiko bei korrekt durchgeführtem BLW. Wichtig: Würgen (Gagging) ist ein normaler Schutzreflex und nicht dasselbe wie Ersticken (Choking). Der Würgereflex sitzt bei Babys weiter vorne im Mund als bei Erwachsenen.",
        erklaerung: "Baby-led Weaning – also dem Baby statt Brei direkt weiche Fingerfood-Stücke anzubieten – löst bei vielen Eltern Panik aus. Besonders TikTok-Videos, in denen Babys große Stücke essen, verstärken die Angst.\n\nDie Forschung zeigt:\n• Gagging ≠ Choking: Würgen ist laut, sichtbar und ein Schutzreflex. Echtes Ersticken ist leise. Babys haben den Würgereflex weiter vorne im Mund als Erwachsene – genau um Ersticken zu verhindern.\n• Studien (z.B. Fangupo et al., 2016) finden kein erhöhtes Erstickungsrisiko bei BLW im Vergleich zu Brei, wenn grundlegende Regeln beachtet werden.\n\nWichtige Sicherheitsregeln:\n• Baby muss aufrecht sitzen können (mit Unterstützung)\n• Weiche, altersgerechte Konsistenz\n• Keine runden, harten Lebensmittel (ganze Nüsse, Weintrauben, rohe Karotten)\n• Baby NIE allein essen lassen\n• Erste-Hilfe-Kurs Säugling ist empfehlenswert\n\nÜbrigens: Babys brauchen keine Zähne zum BLW – der Kieferkamm ist stark genug, um weiche Lebensmittel zu zerdrücken.",
        quellen: [
            { name: "Fangupo et al. (2016): Choking Risk in BLW", org: "Journal of Human Nutrition and Dietetics" },
            { name: "Brown (2018): No difference in choking frequency between BLW and traditional weaning", org: "Pediatric Obesity" },
            { name: "BZgA: Beikost einführen", org: "kindergesundheit-info.de" }
        ],
        herkunft: "Die Angst kommt vor allem von TikTok-Videos (ohne Sicherheitshinweise), Horrorgeschichten in Facebook-Gruppen und Großeltern. Auch manche Kinderärzte raten pauschal ab, ohne die aktuelle Studienlage zu kennen.",
        verwandt: ["beikost-4-monate"],
        tags: ["BLW", "baby led weaning", "beikost", "ersticken", "choking", "würgen", "fingerfood", "brei"]
    },
    {
        id: "fieber-hirnschaden",
        mythos: "Fieber über 40°C verursacht Hirnschäden",
        bewertung: "falsch",
        emotion: 4,
        kategorie: "gesundheit",
        kurzantwort: "Falsch. Infektbedingtes Fieber verursacht keine Hirnschäden – auch nicht bei 40°C oder darüber. Kritisch wird es erst ab ca. 42°C, was bei einer normalen Infektion praktisch nicht vorkommt. Gefahr besteht nur bei externer Überhitzung (z.B. Kind im heißen Auto).",
        erklaerung: "Die „Fieberangst" (Fever Phobia) ist eines der am besten untersuchten Phänomene in der Elternforschung. Viele Eltern greifen sofort zu Fiebersenkern, sobald das Thermometer 38,5°C zeigt.\n\nWas die Forschung sagt:\n• Fieber ist eine Immunreaktion, kein Feind. Der Körper erhöht die Temperatur gezielt, um Erreger zu bekämpfen.\n• Bei normalen Infektionen reguliert der Körper die Temperatur selbst und überschreitet 42°C nicht.\n• Hirnschäden durch Temperatur treten erst ab ca. 42°C auf – das passiert nur bei externer Überhitzung (Hitzschlag, Auto in der Sonne), nicht bei Infektfieber.\n\nWann zum Arzt?\n• Bei Neugeborenen unter 3 Monaten: JEDES Fieber über 38°C → sofort zum Arzt\n• Bei älteren Babys: Weniger auf die Zahl schauen, mehr auf den Allgemeinzustand (trinkt das Kind? reagiert es? wie ist die Hautfarbe?)\n• Fieberkrämpfe sehen dramatisch aus, sind aber in der Regel harmlos und verursachen keine Hirnschäden.",
        quellen: [
            { name: "Sullivan & Farrar (2011): Fever and Antipyretic Use in Children", org: "Pediatrics (AAP Clinical Report)" },
            { name: "DGKJ: Fieber im Kindesalter", org: "Deutsche Gesellschaft für Kinder- und Jugendmedizin" },
            { name: "NICE Guideline: Fever in under 5s", org: "National Institute for Health and Care Excellence" }
        ],
        herkunft: "Kommt von älteren Familienmitgliedern, veralteten Ratgebern und der allgemeinen Angst vor hohen Zahlen auf dem Thermometer. Wird verstärkt durch Facebook-Gruppen, die extreme Maßnahmen bei jedem Fieber empfehlen.",
        verwandt: ["zahnen-fieber"],
        tags: ["fieber", "temperatur", "hirnschäden", "fieberkrampf", "fiebersaft", "fieberzäpfchen", "40 grad"]
    },
    {
        id: "globuli",
        mythos: "Globuli und Homöopathie sind sanfte, aber wirksame Babymedizin",
        bewertung: "falsch",
        emotion: 4,
        kategorie: "hausmittel",
        kurzantwort: "Falsch. Homöopathische Mittel sind nach dem Verdünnungsprinzip so stark verdünnt, dass kein einziges Molekül des Wirkstoffs mehr enthalten ist. Sie wirken nicht über den Placebo-Effekt hinaus. Gefährlich wird es, wenn sie echte Behandlungen ersetzen.",
        erklaerung: "Homöopathie ist in Deutschland tief kulturell verankert – viele Kinderärzte, Apotheken und Hebammen empfehlen Globuli aktiv. Das macht es für Eltern schwer, die Evidenz einzuordnen.\n\nWarum Homöopathie nicht wirkt:\n• Das Grundprinzip: Ein Wirkstoff wird so oft verdünnt (z.B. D12 = 1:1.000.000.000.000), dass statistisch kein einziges Molekül mehr in der Lösung ist.\n• Die behauptete „Wassergedächtnis"-Erklärung hat keine physikalische Grundlage.\n• Hunderte von Studien und systematische Reviews (Cochrane, australischer NHMRC) kommen zum Schluss: Homöopathie wirkt nicht besser als Placebo.\n\nWarum es trotzdem „hilft":\n• Placebo-Effekt (bei Kindern: Zuwendung der Eltern)\n• Natürlicher Krankheitsverlauf (die Erkältung wäre auch ohne Globuli weggegangen)\n• Regression zur Mitte (man nimmt Globuli am schlimmsten Punkt → es wird danach besser)\n\nWann es gefährlich wird:\n• Wenn Globuli echte Medikamente ERSETZEN (z.B. bei Mittelohrentzündung, hohem Fieber bei Neugeborenen)\n• Belladonna-Präparate haben zu dokumentierten Vergiftungen bei Kindern geführt (FDA-Warnung)",
        dpiNote: "DACH-spezifisch: Deutschland ist weltweit eines der Länder mit der höchsten Akzeptanz von Homöopathie. Viele gesetzliche Krankenkassen haben Globuli bis vor kurzem erstattet. Anthroposophische Kinderärzte verschreiben sie routinemäßig. Das macht es für Eltern besonders schwer, kritisch zu hinterfragen.",
        quellen: [
            { name: "NHMRC (2015): Evidence on Homeopathy (300+ Studien ausgewertet)", org: "Australischer National Health and Medical Research Council" },
            { name: "Cochrane Reviews zu Homöopathie", org: "Cochrane Library" },
            { name: "FDA Safety Alert: Homeopathic Teething Products (Belladonna)", org: "U.S. Food and Drug Administration" }
        ],
        herkunft: "In DACH tief verwurzelt durch: Anthroposophische Medizin (Weleda, WALA), Krankenkassen-Erstattung, aktive Empfehlung durch Apotheken und manche Ärzte. In den USA/UK deutlich randständiger.",
        verwandt: ["bernsteinkette"],
        tags: ["globuli", "homöopathie", "anthroposophie", "alternativmedizin", "placebo", "weleda", "naturheilkunde"]
    },
    {
        id: "verwoehnen",
        mythos: "Babys darf man nicht verwöhnen – zu viel Tragen und Trösten verdirbt den Charakter",
        bewertung: "falsch",
        emotion: 4,
        kategorie: "entwicklung",
        kurzantwort: "Falsch. Säuglinge können nicht „manipulieren" oder „verwöhnt" werden. Feinfühlige, prompte Reaktion auf ihre Signale fördert die sichere Bindung und damit langfristig genau die Selbstständigkeit, die Eltern sich wünschen.",
        erklaerung: "Dieser Mythos stammt aus einer Zeit, in der man glaubte, Babys müssten „abgehärtet" werden. Die moderne Entwicklungspsychologie zeigt das Gegenteil:\n\n• Babys schreien nicht „aus Trotz" oder um zu manipulieren. Dafür fehlt ihnen die kognitive Reife. Schreien ist ihr einziges Kommunikationsmittel für Bedürfnisse (Hunger, Nähe, Unbehagen).\n\n• Prompte, feinfühlige Reaktion fördert „sichere Bindung" – und sicher gebundene Kinder werden SELBSTSTÄNDIGER, nicht unselbstständiger.\n\n• Tragende und Trösten aktiviert das Beruhigungssystem des Babys und hilft ihm langfristig, eigene Regulationsstrategien zu entwickeln.\n\n• Die Bindungsforschung (Bowlby, Ainsworth) ist eine der am besten belegten Theorien der Entwicklungspsychologie.\n\nKurzum: Man kann ein Baby im ersten Lebensjahr nicht verwöhnen. Was Großeltern als „Verwöhnen" bezeichnen, ist genau das, was Babys für eine gesunde Entwicklung brauchen.",
        quellen: [
            { name: "Ainsworth et al.: Patterns of Attachment", org: "Klassiker der Bindungsforschung" },
            { name: "DGKJ: Bindung und Entwicklung", org: "Deutsche Gesellschaft für Kinder- und Jugendmedizin" },
            { name: "BZgA: Signale des Babys", org: "kindergesundheit-info.de" }
        ],
        herkunft: "Kommt fast ausschließlich von der älteren Generation und autoritären Erziehungskonzepten. Wird manchmal auch von frustrierten, übermüdeten Familienmitgliedern als Rat getarnt.",
        verwandt: ["schlaftraining-schadet"],
        tags: ["verwöhnen", "tragen", "trösten", "schreien", "bindung", "attachment", "großeltern", "charakter"]
    },
    {
        id: "bildschirmzeit",
        mythos: "Bildschirmzeit vor 2 Jahren zerstört das Gehirn",
        bewertung: "teilweise",
        emotion: 4,
        kategorie: "entwicklung",
        kurzantwort: "Übertrieben, aber mit Kern. Starker, unbegleiteter Medienkonsum unter 2 Jahren ist problematisch (weniger Sprachentwicklung, weniger Interaktion). Aber: Kurze, gezielte Nutzung (z.B. 10 Min. Ms. Rachel) ist wahrscheinlich geringes Risiko – besonders wenn Eltern sonst viel interagieren.",
        erklaerung: "Die WHO- und AAP-Empfehlung „keine Bildschirmzeit unter 2 Jahren" wird oft als absolutes Verbot interpretiert. Die Realität ist differenzierter:\n\nWas die Forschung zeigt:\n• Exzessiver, passiver Bildschirmkonsum (Kinder allein vor dem Fernseher) ist mit verzögerter Sprachentwicklung und weniger Eltern-Kind-Interaktion assoziiert.\n• Hintergrundfernsehen (TV läuft „nebenbei") reduziert die Qualität der Eltern-Kind-Interaktion messbar.\n• ABER: Es gibt kaum Forschung, die kurze, gezielte Nutzung (z.B. 10-20 Minuten pädagogischer Content, während Eltern kochen/duschen) von stundenlangem Dauerkonsum unterscheidet.\n\nWas das für den Alltag heißt:\n• Kurze Bildschirmzeit ist wahrscheinlich kein Problem, wenn der Rest des Tages reich an Interaktion ist.\n• Die Qualität des Contents spielt eine Rolle (Ms. Rachel vs. YouTube-Autoplay).\n• Die Dosis macht das Gift – 15 Minuten sind nicht 4 Stunden.\n• Schuldgefühle wegen gelegentlicher Bildschirmzeit sind unbegründet, wenn Eltern ansonsten feinfühlig und präsent sind.",
        quellen: [
            { name: "WHO: Guidelines on Physical Activity, Sedentary Behaviour and Sleep (Under 5s)", org: "Weltgesundheitsorganisation" },
            { name: "Madigan et al. (2019): Association Between Screen Time and Children's Performance on Developmental Screening", org: "JAMA Pediatrics" },
            { name: "BZgA: Medien in der Familie", org: "kindergesundheit-info.de" }
        ],
        herkunft: "Die Angst kommt von dramatischen Headlines über Studien, die oft nur exzessiven Konsum untersuchen. TikTok-„Experten" verstärken Schuldgefühle. Gleichzeitig nutzen fast alle Eltern Bildschirme als gelegentliche Entlastung.",
        verwandt: [],
        tags: ["bildschirmzeit", "screen time", "fernsehen", "ms rachel", "handy", "tablet", "medien", "gehirn"]
    },
    {
        id: "beikost-4-monate",
        mythos: "Beikost muss mit 4 Monaten starten – sonst ist es zu spät",
        bewertung: "teilweise",
        emotion: 4,
        kategorie: "ernaehrung",
        kurzantwort: "Übertrieben. Das empfohlene Fenster für den Beikoststart liegt zwischen dem 5. und 7. Lebensmonat (nicht vor dem 5., nicht nach dem 7.). Entscheidend sind die Reifezeichen des Babys, nicht ein festes Datum im Kalender.",
        erklaerung: "Dieses Thema ist in DACH ein Dauerbrenner, weil Eltern von allen Seiten widersprüchliche Infos bekommen:\n\n• Kinderarzt: „Ab der 17. Woche möglich"\n• Gläschenhersteller: Produkte mit „ab 4. Monat"\n• WHO: „Exklusiv stillen bis 6 Monate"\n• Hebamme: „Warte auf die Reifezeichen"\n\nWas die aktuelle Leitlinie (ESPGHAN) sagt:\n• Beikost nicht vor dem 5. Lebensmonat (17. Woche) und nicht nach dem 7. Lebensmonat (26. Woche)\n• Das ist ein FENSTER, kein fixes Datum\n• Entscheidend: Reifezeichen des Babys (Kopfkontrolle, Interesse am Essen, Zungenstoßreflex lässt nach)\n\nWichtig für Allergieprävention:\n• Neue Forschung zeigt: Allergene Lebensmittel (Erdnuss, Ei, Fisch) sollten eher FRÜHER als später eingeführt werden (im Beikostfenster), um Allergierisiko zu SENKEN.\n• Das widerspricht der älteren Empfehlung „möglichst spät einführen".",
        dpiNote: "DACH-spezifisch: In Deutschland ist die Verwirrung besonders groß, weil Gläschenhersteller mit „ab 4. Monat" werben, während viele Hebammen „mindestens 6 Monate voll stillen" empfehlen. Die DGKJ/ESPGHAN-Leitlinie wird in der Praxis oft nicht klar kommuniziert.",
        quellen: [
            { name: "ESPGHAN (2017): Complementary Feeding Position Paper", org: "Journal of Pediatric Gastroenterology and Nutrition" },
            { name: "DGKJ: Ernährung von Säuglingen", org: "Deutsche Gesellschaft für Kinder- und Jugendmedizin" },
            { name: "S3-Leitlinie Allergieprävention (2022)", org: "AWMF" }
        ],
        herkunft: "Verwirrung durch Industriemarketing (Gläschen „ab 4. Monat"), unterschiedliche Empfehlungen von Kinderärzten und Hebammen, und veraltete Allergiepräventions-Ratschläge.",
        verwandt: ["blw-ersticken", "honig-erstes-jahr"],
        tags: ["beikost", "beikoststart", "4 monate", "6 monate", "brei", "gläschen", "allergie", "reifezeichen"]
    },
    {
        id: "zahnen-fieber",
        mythos: "Zahnen verursacht hohes Fieber und Durchfall",
        bewertung: "teilweise",
        emotion: 4,
        kategorie: "gesundheit",
        kurzantwort: "Übertrieben. Zahnen kann leicht erhöhte Temperatur (bis 38°C) und Unruhe verursachen, aber KEIN echtes Fieber (>38,5°C) und keinen starken Durchfall. Werden diese Symptome auf „nur Zähne" geschoben, können echte Infekte übersehen werden.",
        erklaerung: "Dieser Mythos ist besonders tückisch, weil er dazu führen kann, dass Eltern echte Krankheiten nicht ernst nehmen.\n\nWas beim Zahnen normal ist:\n• Leicht erhöhte Temperatur (bis ca. 38°C)\n• Vermehrtes Speicheln und Kauen\n• Leichte Unruhe und Schlafstörungen\n• Gerötetes Zahnfleisch\n\nWas NICHT vom Zahnen kommt:\n• Echtes Fieber über 38,5°C → Das ist fast immer ein Infekt!\n• Starker Durchfall → Kann auf eine Infektion hindeuten\n• Erbrechen, Hautausschlag, Lethargie → Zum Arzt!\n\nWarum die Verwechslung passiert:\n• Zahnen fällt in eine Phase (6–24 Monate), in der Babys ohnehin häufig krank werden (Nestschutz lässt nach, mehr Kontakt zu Keimen).\n• Zeitliche Überschneidung wird fälschlich als Ursache interpretiert.\n\nFaustregel: Wenn du dich fragst „Sind das nur Zähne?" – ist es wahrscheinlich mehr als nur Zähne. Lieber einmal zu viel zum Arzt als einmal zu wenig.",
        quellen: [
            { name: "Massignan et al. (2016): Signs and Symptoms of Primary Tooth Eruption: A Meta-analysis", org: "Pediatrics" },
            { name: "DGZMK: Leitlinie zum Zahndurchbruch", org: "Deutsche Gesellschaft für Zahn-, Mund- und Kieferheilkunde" },
            { name: "Wake et al. (2000): Teething and tooth eruption in infants", org: "Pediatrics" }
        ],
        herkunft: "Einer der hartnäckigsten Mythen, verbreitet seit Jahrhunderten durch Großeltern, alte Kinderbücher und sogar manche Kinderärzte. Auf Reddit beschreiben viele Eltern den Konflikt: „Arzt sagt nein, alle anderen sagen ja."",
        verwandt: ["fieber-hirnschaden"],
        tags: ["zahnen", "zähne", "fieber", "durchfall", "zahnungsschmerzen", "38 grad", "infekt"]
    }
];
