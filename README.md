# JWT – Access & Refresh Token Demo

Ett mindre övningsprojekt byggt med React, Express och TypeScript för att testa och förstå JWT-baserad autentisering med kortlivade access tokens och långlivade refresh tokens.

## Så fungerar det

- **Sign in:** Skapar en access token och en refresh token som lagras i httpOnly-cookies.
- **Protected:** Verifierar access token innan åtkomst ges till en skyddad endpoint.
- **Refresh:** Använder refresh token för att utfärda en ny access token.
- **Sign out:** Rensar båda cookies och avslutar inloggningen i webbläsaren.

Access token gäller i 10 sekunder och refresh token i 7 dagar.

## Testa

1. Starta frontend och backend med konfigurerade miljövariabler.
2. Logga in med `user@example.com` / `password`.
3. Testa **Protected** direkt efter inloggningen.
4. Vänta minst 10 sekunder och testa igen. Anropet ska ge `401`.
5. Klicka på **Refresh** och kontrollera att **Protected** fungerar igen.
6. Klicka på **Sign out** och kontrollera att åtkomsten upphör.

Använd DevTools → Application → Cookies för att undersöka hur tokens hanteras.

## Från experiment till produktion

Den huvudsakliga begränsningen är att refresh tokens enbart verifieras genom sin signatur och utgångstid. Servern kan därför inte återkalla en tidigare utfärdad token om den exempelvis har kopierats innan utloggning.

För en produktionsimplementation bör refresh tokens registreras serverbaserat, roteras vid förnyelse och kunna återkallas. Det gör det även möjligt att upptäcka återanvändning av tidigare ogiltigförklarade tokens.

Kortlivade access tokens kan fortsätta verifieras utan databasuppslag och förblir normalt giltiga tills de löper ut.