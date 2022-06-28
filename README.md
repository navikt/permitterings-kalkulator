# permitterings-kalkulator
Kalkulator for å gi informasjon om permitteringsregelverket.

Mye av koden er knyttet til spesialtilfeller i forbindelse med koronaepidemien. Beregningene og tekstgenerering er hendholdsvis i beregningerForSluttPåDagpengeforlengelse og utregningstekst-avvikling-av-koronaregler-utils.
Casene disse filene blir brukt til vil gli ut uten at det kreves endringer i koden, men med tanke på at de blir utdaterte kan det være greit å fjerne de.

Ingen vil bli berørt av disse casene etter 30. september 2023. Da kan disse filene slettes. 

Om permitteringsreglene skulle endre seg:
Reglene har under koronaepidemien har gått ut på å forlenge dagpengeordningen slik at arbeidsgiverne kunne permittere fritt inntil en viss dato. Dette Tilsvarer i koden i dag (oppdatert 28.06.2022) datoen 1. april 2022. Denne kan bare byttes ut i algoritmene,
Andre variabler 18 måneder, som er tidsintervallet maks permittering gjelder for, og 26 uker som er maks antall dager arbeidsgiver kan permittere. Disse datoene kan byttes ut og kalkulatoren vil fungere med de nye datoene.

## Datohåndtering og konstanter brukt i utregningen
Vi har valgt å bruke dayjs i stedet for javascript innebygde Date-bibliotek. Dette gjorde utregningene enklere ved at dayjs har mer stabile beregninger som inkluderer år, dager og måneder. Dayjs baserer seg mer på milisekund som gjør det inkonsekvent med tanke på tidssoner, skuddår og andre kompliserende faktorer.
Dagens dato er global for forenkling, og er spesifisert til å være i starten av dagens dato, da vi så det skapte problemer, siden denne også bruker milisekund i dataobjektet som gjorde at beregningene oppførte seg uventet.
På et tidspunkt vil både 1. juli 2021 og 1. april være utdatert og kun dagens dato vil være aktuell for utregningen. For å regne ut permitteringsdager blir alle datointervall fyllt inn av brukerern omgjort til en tidslinje, der som håndterer datoer utenfor tidslinja og overlappende perioder håndteres.

Hvilket case brukeren havner i, og som bestemmer hvilken tekst brukerer for opp i resultatboksen vil da blir forenklet til å gi ut to forskjellige tekster. èn dersom de har nådd 26 uker i løpet av 18 måneder og en for hvis de ikke har gjort det. 

De mest omfattende funksjonene er knyttet til å lage illustrasjonen (tidslinja). Den baserer seg kun på standard HTML og css, og den trenger ikke oppdateres med tanke på ekstrene biblioteker. Det eneste er et bibliotek som gjør at man kan dra i ddet blå elementet. 
Tidslinjen er bygd opp dagene som løper dynamisk 18 måneder framover og 18 måneder tilbake i tid. Hver dato har en kategori, permittert uten fravær, permittert med fravær, ikke permittert og slettet permittering (i casene der permitteringen er fyllt i før 1. juli 2021 da permitteringene ble nullstilt). 
Hver av disse dagene er et transparent html-objekt som tar opp sin prosentandel av bredden av containerer. 
Dette vil si at bredden til et hvert dagsobjekt er 100%/(dager i løpet av 18*2 måneder).

For å få den til å se penere ut er det fargede HTML-objekter med border der utregnet basert på størrelsen av de underliggende gjennomsiktige HTML-dagsobjektene. 
Dette vil si at dersom det finnes en permitteringsperiode på 18 dager, vil det bli konstruert en 18*bredden av hvert dagsobjekt med farge og border som legges i tidslinja. 
Størrelsen baserer seg alltid på bredden av dagsobjekt * lengde av av periode. Dette gjelder også det blå drag-elementet. 
Datomarkørene for år, dagens dato og datoen der maks nås er plassert i forhold til det gjennomsiktige underliggende dagsobjektet for å sørge for riktige proposjoner.

Det er en del logikk knyttet til utseendet til tidslinja i tidslinjefunksjoner.ts, og også finnDatoForMaksPermittering er knyttet til denne. Dersom tidslinja på et tidspunkt slutter å fungere er den ikke kritisk for å gi arbeidsgivere informasjon på spørsmålet om de kan permittere lenger eller ikke.
Den er allikevel viktig fordi arbeidsgivere har vanskelig for å forstå 18-månedsperioden som glidende og illustrasjonen gjør det enklere for Arbeidsgivertelefonen å forklare/dobbelsjekke utregningen.

DetaljertUtregningskomponenten er ikke i bruk i dag, men den viser utfylt permittering fyllt inn av brukeren i en tabell (liste på mobil)










