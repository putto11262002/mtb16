- things that are safe to assume wnat dont need to include detail in the docs but  how to iuse it
  - the better auth handler it mounted for you, the middleare for better auth is set for you so it is safe for you to called ctx.locals.user in the action.
  - Cann asumme that the can function and other typing for it is exported from the @/lib/auth/acl.ts

  

- incoopreate this into the plan phase ensure you have enough information about the technolyuog or lib to confidenctly inplement the feature it not plese folow link and gather enough info. If there is info missing that you are not confidence about ALWAYS ask for more info before you start the plan phase. NEVER use your intenral know for lib, framework specific stuff.

- Corrections:
    - the better auth instnaces are exported from @/lib/auth/index.ts and @/lib/auth/client.ts
    - We are not using drizzle-zod but i am just saying that look at the schema file before writing out the zod schema make sure thety are in sync. the schema file is the source of truth of the data.

- Be more specific about how to follow docs links. 

