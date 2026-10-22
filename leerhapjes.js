// Leerhapjes: bite-sized simulations of 1 to 3 minutes.
// Format (see DESIGN.md, section "Leerhapje"):
//   { id, title, minutes, skill, course, steps: [step, ...] }
// Step types:
//   context  { type, kind: 'mail'|'teams'|'letter', intro, ...scene }
//   choice   { type, prompt, situation?, options: [{ label, correct, feedback }] }
//   hotspot  { type, prompt, kind: 'mail'|'text', parts: [{ id, label?, text, flag, feedback }] }
//   result   { type, points, well, tip }
// skill uses the course topics of the app: sec, ai, sch, ov, data.
window.LEERHAPJES = [
  {
    id: 'phishing-mail',
    title: 'Is deze mail echt?',
    minutes: 2,
    skill: 'sec',
    course: 'sec',
    steps: [
      {
        type: 'context',
        kind: 'mail',
        intro: 'Deze mail staat net in je inbox. Lees hem rustig door.',
        from: 'ICT Servicedesk <servicedesk@breda-ict-support.com>',
        to: 'jij@breda.nl',
        subject: 'Actie vereist: je wachtwoord verloopt vandaag',
        body: [
          'Beste medewerker,',
          'Je wachtwoord verloopt binnen 2 uur. Bevestig je account via de link hieronder, anders wordt je toegang geblokkeerd.',
        ],
        link: 'Account bevestigen',
        sign: 'Met vriendelijke groet, ICT Servicedesk',
      },
      {
        type: 'hotspot',
        prompt: 'Tik op de 3 dingen die niet kloppen.',
        kind: 'mail',
        parts: [
          { id: 'from', label: 'Van', text: 'servicedesk@breda-ict-support.com', flag: true,
            feedback: 'Goed gezien. Het adres eindigt niet op breda.nl.' },
          { id: 'subject', label: 'Onderwerp', text: 'Actie vereist: je wachtwoord verloopt vandaag', flag: false,
            feedback: 'Het onderwerp alleen zegt nog niet zoveel. Kijk naar de afzender en de tekst.' },
          { id: 'greet', text: 'Beste medewerker,', flag: false,
            feedback: 'Een algemene aanhef komt ook in echte mails voor. Zoek verder.' },
          { id: 'urgency', text: 'Je wachtwoord verloopt binnen 2 uur. Bevestig je account, anders wordt je toegang geblokkeerd.', flag: true,
            feedback: 'Klopt. Haast en dreigen zijn een bekende truc om je te laten klikken.' },
          { id: 'link', text: 'Account bevestigen', flag: true,
            feedback: 'Ja. Een link om je wachtwoord te bevestigen stuurt de echte servicedesk nooit.' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Wat doe je met deze mail?',
        options: [
          { label: 'Melden met de knop Phishing melden in Outlook', correct: true,
            feedback: 'Precies. ICT kan de mail nu ook bij je collega\'s weghalen.' },
          { label: 'Even op de link klikken om te kijken of hij echt is', correct: false,
            feedback: 'Begrijpelijk, maar alleen het openen van de link kan al genoeg zijn voor een aanvaller. Meld de mail liever.' },
          { label: 'Doorsturen naar je team zodat iedereen gewaarschuwd is', correct: false,
            feedback: 'Goed bedoeld, maar zo komt de link bij meer mensen terecht. Met Phishing melden waarschuw je iedereen veilig.' },
        ],
      },
      {
        type: 'result',
        points: 20,
        well: 'Je herkende de nep-afzender, de haast en de verdachte link.',
        tip: 'Twijfel je? Bel de servicedesk via het nummer op intranet, niet via een nummer uit de mail.',
      },
    ],
  },
  {
    id: 'copilot-of-niet',
    title: 'Copilot of niet?',
    minutes: 2,
    skill: 'ai',
    course: 'ai',
    steps: [
      {
        type: 'context',
        kind: 'teams',
        intro: 'Je collega stuurt je een bericht in Teams.',
        who: 'Ahmed Benali',
        text: 'Ik gebruik Copilot steeds vaker, maar ik weet nooit zeker wat ik erin mag zetten. Doen we er samen even drie?',
      },
      {
        type: 'choice',
        prompt: 'Mag dit in Copilot?',
        situation: 'Je wilt een openbare raadsbrief laten samenvatten. Je bent ingelogd met je Breda-account.',
        options: [
          { label: 'Ja, dat mag', correct: true,
            feedback: 'Klopt. Het is openbare informatie en je werkt in de beveiligde omgeving van de gemeente.' },
          { label: 'Alleen zonder namen', correct: false,
            feedback: 'Niet nodig hier. In een openbare raadsbrief staan geen gegevens die je moet weghalen.' },
          { label: 'Nee, liever niet', correct: false,
            feedback: 'Je mag voorzichtig zijn, maar dit is juist waar Copilot je tijd bespaart.' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Mag dit in Copilot?',
        situation: 'Je wilt een antwoord laten schrijven op een bezwaar. Daarin staan de naam, het BSN en medische informatie van een inwoner.',
        options: [
          { label: 'Ja, dat mag', correct: false,
            feedback: 'Pas op: een BSN en medische gegevens zijn bijzondere persoonsgegevens. Die horen er niet in.' },
          { label: 'Alleen zonder persoonsgegevens', correct: true,
            feedback: 'Goed. Haal naam, BSN en medische details weg. De opbouw van je antwoord kan Copilot dan wel helpen maken.' },
          { label: 'Nee, nooit bij bezwaren', correct: false,
            feedback: 'Te streng. Zonder persoonsgegevens kan Copilot je prima helpen met de opbouw.' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Mag dit in een AI-tool?',
        situation: 'Je plakt een interne concepttekst in een gratis AI-website die je via Google vond.',
        options: [
          { label: 'Ja, het is maar een concept', correct: false,
            feedback: 'Ook een concept is informatie van de gemeente. Een gratis site kan je tekst bewaren of gebruiken.' },
          { label: 'Nee, gebruik Copilot met je werkaccount', correct: true,
            feedback: 'Precies. Met je Breda-account blijft je tekst binnen de omgeving van de gemeente.' },
          { label: 'Alleen als je het daarna verwijdert', correct: false,
            feedback: 'Verwijderen helpt niet: de tekst is dan al verstuurd. Kies de Copilot van je werkaccount.' },
        ],
      },
      {
        type: 'result',
        points: 20,
        well: 'Je weet wanneer Copilot helpt en wanneer je gegevens eerst weghaalt.',
        tip: 'Vuistregel: zou je het in een mail naar een collega zetten? Dan mag het meestal ook in Copilot met je werkaccount.',
      },
    ],
  },
  {
    id: 'zeg-het-in-b1',
    title: 'Zeg het in B1',
    minutes: 3,
    skill: 'sch',
    course: 'sch',
    steps: [
      {
        type: 'context',
        kind: 'letter',
        intro: 'Je schrijft een inwoner terug over een aanvraag. Dit is de eerste zin uit de standaardbrief:',
        text: 'Naar aanleiding van uw schrijven delen wij u mede dat uw aanvraag in behandeling is genomen en dat u binnen de wettelijke termijn een beschikking tegemoet kunt zien.',
      },
      {
        type: 'hotspot',
        prompt: 'Tik op de 3 stukjes die een inwoner lastig vindt.',
        kind: 'text',
        parts: [
          { id: 'naar', text: 'Naar aanleiding van uw schrijven', flag: true,
            feedback: 'Goed. Zeg gewoon: "Bedankt voor uw brief."' },
          { id: 'mede', text: 'delen wij u mede dat', flag: false,
            feedback: 'Wat stijf, maar nog te volgen. Er zitten lastigere stukjes in.' },
          { id: 'aanvraag', text: 'uw aanvraag in behandeling is genomen', flag: false,
            feedback: 'Dit snappen de meeste mensen wel. Kijk naar de andere stukjes.' },
          { id: 'termijn', text: 'binnen de wettelijke termijn', flag: true,
            feedback: 'Klopt. Noem liever de datum of het aantal weken.' },
          { id: 'beschikking', text: 'een beschikking tegemoet kunt zien', flag: true,
            feedback: 'Ja. "Beschikking" is ambtelijk. Zeg: "krijgt u ons besluit".' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Welke zin is het duidelijkst?',
        options: [
          { label: 'Bedankt voor uw brief. We hebben uw aanvraag ontvangen. U krijgt ons besluit uiterlijk op 12 december.', correct: true,
            feedback: 'Ja. Korte zinnen, gewone woorden en een concrete datum.' },
          { label: 'Wij hebben uw aanvraag in goede orde ontvangen en zullen u binnen de daarvoor geldende termijn berichten.', correct: false,
            feedback: 'Netjes, maar "in goede orde" en "geldende termijn" zeggen een inwoner weinig. Wanneer krijgt diegene antwoord?' },
          { label: 'Uw aanvraag is ontvangen. Een besluit volgt conform de Awb.', correct: false,
            feedback: 'Wel kort, maar "conform de Awb" kent bijna niemand. Noem liever de datum.' },
        ],
      },
      {
        type: 'result',
        points: 20,
        well: 'Je koos korte zinnen met gewone woorden en een concrete datum.',
        tip: 'Lees je zin hardop. Zou je het zo tegen je buurman zeggen? Dan zit je meestal goed.',
      },
    ],
  },
];
