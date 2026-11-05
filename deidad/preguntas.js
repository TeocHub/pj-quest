/* =====================================================================
   Test "¿De qué dios serías hijo o hija?" — preguntas.

   MODELO
   19 rasgos de conducta y personalidad (inspirados en los Cinco Grandes,
   la teoría de valores de Schwartz y los intereses de Holland). Cada
   deidad es un perfil sobre esos rasgos (ver deidades.js). El último
   rasgo, RO, no describe a ningún dios: decide el ASPECTO (griego o
   romano) del mismo dios, como Zeus y Júpiter.

   TIPOS DE PREGUNTA
   - Afirmaciones con escala 1 a 5. "inv": true = puntaje invertido.
   - PAIRS: dos opciones igual de deseables; la elegida suma a su rasgo.
   - "tie": afirmaciones de reserva. Solo aparecen en la ronda de
     desempate, cuando las dos deidades más cercanas quedan muy parejas:
     se eligen las de los rasgos que más separan a esas dos.

   Las afirmaciones hablan de conducta real y reciente, no de escenarios
   inventados. Si cambias preguntas, mantén 6 principales y 2 de reserva
   por rasgo, para que todos pesen lo mismo.
   ===================================================================== */
window.DEI_Q = {

FACETS: {
  PLA: { es:"Estrategia",        en:"Strategy",          d_es:"Planificar y pensar varias jugadas por adelantado.", d_en:"Planning and thinking several moves ahead." },
  CUR: { es:"Curiosidad",        en:"Curiosity",         d_es:"Aprender por gusto y entender cómo funcionan las cosas.", d_en:"Learning for its own sake and understanding how things work." },
  MIS: { es:"Intuición mística", en:"Mystic intuition",  d_es:"Corazonadas, sueños, símbolos y lo que no se puede comprobar.", d_en:"Hunches, dreams, symbols and what can't be proven." },
  MAN: { es:"Oficio",            en:"Craft",             d_es:"Pensar con las manos: arreglar, armar y construir.", d_en:"Thinking with your hands: fixing, assembling and building." },
  AUD: { es:"Audacia",           en:"Daring",            d_es:"Tomar riesgos y lanzarte a lo incierto.", d_en:"Taking risks and leaping into the unknown." },
  ING: { es:"Ingenio",           en:"Wit",               d_es:"Atajos, labia y reglas que se doblan.", d_en:"Shortcuts, a silver tongue and rules that bend." },
  LID: { es:"Liderazgo",         en:"Leadership",        d_es:"Tomar decisiones y que otros te sigan.", d_en:"Making decisions and having others follow you." },
  COM: { es:"Competitividad",    en:"Competitiveness",   d_es:"Querer ganar y superarte frente a otros.", d_en:"Wanting to win and outdo others." },
  CHO: { es:"Combate",           en:"Fight",             d_es:"Enfrentar el conflicto de frente y con intensidad.", d_en:"Facing conflict head-on and with intensity." },
  CUI: { es:"Cuidado",           en:"Care",              d_es:"Atender, sanar y acompañar a otros.", d_en:"Looking after, healing and supporting others." },
  ENC: { es:"Encanto",           en:"Charm",             d_es:"Atraer, convencer y vivir los vínculos con intensidad.", d_en:"Attracting, persuading and living relationships intensely." },
  LEA: { es:"Lealtad",           en:"Loyalty",           d_es:"Proteger a los tuyos y cumplir lo que prometes.", d_en:"Protecting your people and keeping your promises." },
  JUS: { es:"Justicia",          en:"Justice",           d_es:"Que cada quien reciba lo que merece.", d_en:"Everyone getting what they deserve." },
  ART: { es:"Arte",              en:"Art",               d_es:"Crear y expresarte: música, imagen, palabra, movimiento.", d_en:"Creating and expressing yourself: music, image, word, movement." },
  DIS: { es:"Disfrute",          en:"Enjoyment",         d_es:"Celebrar, reír y darte gustos.", d_en:"Celebrating, laughing and treating yourself." },
  SOL: { es:"Introspección",     en:"Introspection",     d_es:"La soledad, lo profundo y lo que otros no ven.", d_en:"Solitude, the depths and what others don't see." },
  CAL: { es:"Calma",             en:"Calm",              d_es:"La pausa, el descanso y la cabeza fría.", d_en:"Pausing, resting and keeping a cool head." },
  NAT: { es:"Naturaleza",        en:"Nature",            d_es:"El aire libre, lo vivo, el agua y la tierra.", d_en:"The outdoors, living things, water and earth." },
  RO:  { es:"Deber",             en:"Duty",              d_es:"Disciplina, jerarquía y el bien del grupo.", d_en:"Discipline, hierarchy and the good of the group." }
},

/* Etapas: cada una mide tres rasgos (y una afirmación de Deber). */
STAGES: [
  { f:["PLA","CUR","MIS"], es:{ t:"Cómo piensas",      d:"Sobre cómo decides, qué te da curiosidad y en qué confías cuando no hay certezas." },
                           en:{ t:"How you think",     d:"About how you decide, what makes you curious and what you trust when nothing is certain." } },
  { f:["MAN","AUD","ING"], es:{ t:"Cómo actúas",       d:"Sobre tus manos, tus riesgos y tu forma de resolver." },
                           en:{ t:"How you act",       d:"About your hands, your risks and your way of solving things." } },
  { f:["LID","COM","CHO"], es:{ t:"Frente a los demás", d:"Sobre mandar, competir y enfrentar." },
                           en:{ t:"Facing others",     d:"About leading, competing and confronting." } },
  { f:["CUI","ENC","LEA"], es:{ t:"Cómo quieres",      d:"Sobre las personas que te importan y lo que haces por ellas." },
                           en:{ t:"How you love",      d:"About the people who matter to you and what you do for them." } },
  { f:["JUS","ART","DIS"], es:{ t:"Qué te mueve",      d:"Sobre lo que te indigna, lo que creas y lo que disfrutas." },
                           en:{ t:"What moves you",    d:"About what outrages you, what you create and what you enjoy." } },
  { f:["SOL","CAL","NAT"], es:{ t:"Tu refugio",        d:"Sobre dónde y cómo recargas energía." },
                           en:{ t:"Your refuge",       d:"About where and how you recharge." } }
],

/* Afirmaciones por rasgo: 6 principales y 2 de reserva ("tie"). */
BANK: {
  PLA: [
    { es:"Antes de empezar algo importante, armo un plan con pasos.", en:"Before starting something important, I lay out a step-by-step plan." },
    { es:"Cuando hay un problema, pienso varias jugadas por adelantado.", en:"When there's a problem, I think several moves ahead." },
    { inv:true, es:"Suelo lanzarme a hacer las cosas sin pensar mucho en cómo.", en:"I usually dive into things without thinking much about how." },
    { es:"En juegos de mesa o videojuegos, gano más por estrategia que por reflejos o suerte.", en:"In board games or video games, I win more through strategy than reflexes or luck." },
    { es:"Uso una agenda, una lista o un calendario para no olvidar lo que tengo que hacer.", en:"I use a planner, a list or a calendar so I don't forget what I need to do." },
    { inv:true, es:"Los planes me aburren; prefiero ver qué pasa.", en:"Plans bore me; I'd rather see what happens." },
    { tie:true, es:"Cuando algo sale mal, ya tenía un plan B pensado.", en:"When something goes wrong, I already had a plan B in mind." },
    { tie:true, inv:true, es:"Suelo resolver lo práctico a última hora.", en:"I usually sort out the practical stuff at the last minute." }
  ],
  CUR: [
    { es:"Investigo por mi cuenta los temas que me llaman la atención, aunque nadie me lo pida.", en:"I research topics that catch my interest on my own, even when no one asks me to." },
    { es:"Me gusta entender cómo funcionan las cosas por dentro, no solo usarlas.", en:"I like understanding how things work inside, not just using them." },
    { inv:true, es:"Leer o estudiar por gusto no es algo que haga.", en:"Reading or studying for fun isn't something I do." },
    { es:"Me quedo dándole vueltas a una pregunta difícil hasta encontrar una respuesta que me convenza.", en:"I keep turning a hard question over until I find an answer that convinces me." },
    { es:"Disfruto las conversaciones sobre ideas, aunque no tengan utilidad práctica.", en:"I enjoy conversations about ideas, even when they have no practical use." },
    { inv:true, es:"Si algo funciona, no me interesa saber por qué.", en:"If something works, I'm not interested in why." },
    { tie:true, es:"Sé muchísimo más que la gente que me rodea sobre al menos un tema.", en:"I know far more than the people around me about at least one topic." },
    { tie:true, inv:true, es:"Prefiero que me den la respuesta antes que descubrirla.", en:"I'd rather be given the answer than figure it out." }
  ],
  MIS: [
    { es:"Presto atención a mis sueños y a veces les busco significado.", en:"I pay attention to my dreams and sometimes look for their meaning." },
    { es:"Me guío por corazonadas, y muchas veces aciertan.", en:"I follow my hunches, and they're often right." },
    { es:"Me atraen los rituales, los símbolos o prácticas como el tarot, la astrología o la meditación.", en:"I'm drawn to rituals, symbols or practices like tarot, astrology or meditation." },
    { inv:true, es:"Si algo no se puede comprobar, no le doy importancia.", en:"If something can't be proven, I don't give it much weight." },
    { es:"Siento cuando algo está por pasar, o cuando un lugar \"se siente raro\".", en:"I can sense when something is about to happen, or when a place \"feels off\"." },
    { inv:true, es:"Soy una persona totalmente práctica y no creo en señales.", en:"I'm a completely practical person and I don't believe in signs." },
    { tie:true, es:"Me fascinan los secretos, lo oculto y lo que la mayoría prefiere no mirar.", en:"I'm fascinated by secrets, the hidden and what most people would rather not look at." },
    { tie:true, es:"Disfruto lo misterioso: leyendas, historias de fantasmas, lo inexplicable.", en:"I enjoy the mysterious: legends, ghost stories, the unexplained." }
  ],
  MAN: [
    { es:"Arreglo cosas en casa en vez de llamar a alguien o comprar otra.", en:"I fix things at home instead of calling someone or buying a new one." },
    { es:"Pienso mejor cuando tengo algo en las manos para armar, desarmar o construir.", en:"I think best when I have something in my hands to assemble, take apart or build." },
    { es:"He construido o fabricado algo que usé de verdad: un mueble, un circuito, ropa, un objeto.", en:"I've built or made something I actually used: furniture, a circuit, clothes, an object." },
    { inv:true, es:"Las herramientas y las máquinas no son lo mío.", en:"Tools and machines aren't my thing." },
    { es:"Me fijo en cómo está hecho un objeto: sus materiales, sus uniones, su mecanismo.", en:"I notice how an object is made: its materials, its joints, its mechanism." },
    { inv:true, es:"Prefiero pagar a que me lo hagan antes que aprender a hacerlo.", en:"I'd rather pay someone to do it than learn how to do it myself." },
    { tie:true, es:"Pierdo la noción del tiempo cuando estoy haciendo algo con las manos.", en:"I lose track of time when I'm making something with my hands." },
    { tie:true, es:"Cuando veo un aparato roto, me dan ganas de abrirlo.", en:"When I see a broken device, I want to open it up." }
  ],
  AUD: [
    { es:"Me animo a cosas que a otros les dan miedo.", en:"I go for things that scare other people." },
    { es:"Si una oportunidad aparece de golpe, la tomo aunque no esté del todo seguro o segura.", en:"If an opportunity shows up suddenly, I take it even if I'm not completely sure." },
    { inv:true, es:"Evito los riesgos aunque la recompensa sea buena.", en:"I avoid risks even when the reward is good." },
    { es:"Me gustan las apuestas, los desafíos y los juegos de azar.", en:"I like bets, dares and games of chance." },
    { es:"He tomado decisiones grandes casi de improviso, y no me arrepiento.", en:"I've made big decisions almost on impulse, and I don't regret them." },
    { inv:true, es:"Necesito sentirme seguro o segura antes de dar cualquier paso.", en:"I need to feel safe before taking any step." },
    { tie:true, es:"La adrenalina me hace sentir vivo o viva.", en:"Adrenaline makes me feel alive." },
    { tie:true, inv:true, es:"Me cuesta mucho salir de mi zona de confort.", en:"I find it very hard to leave my comfort zone." }
  ],
  ING: [
    { es:"Encuentro atajos o trucos que a otros no se les ocurren.", en:"I find shortcuts or tricks that don't occur to others." },
    { es:"Si una regla me parece absurda, busco la forma de saltármela sin que se note.", en:"If a rule seems absurd to me, I find a way around it without anyone noticing." },
    { es:"Salgo de los líos con labia y buen humor.", en:"I talk my way out of trouble with quick words and humor." },
    { inv:true, es:"Me incomoda tomarle el pelo a alguien o hacer bromas.", en:"I'm uncomfortable teasing people or playing pranks." },
    { es:"Sé negociar: suelo conseguir un buen trato.", en:"I know how to negotiate: I usually get a good deal." },
    { inv:true, es:"Siempre hago las cosas por el camino oficial, aunque haya uno más rápido.", en:"I always do things the official way, even when there's a faster one." },
    { tie:true, es:"Disfruto preparar una buena broma.", en:"I enjoy setting up a good prank." },
    { tie:true, es:"Leo rápido lo que la gente quiere oír y lo uso a mi favor.", en:"I quickly read what people want to hear and use it to my advantage." }
  ],
  LID: [
    { es:"En un grupo sin líder, termino tomando las decisiones.", en:"In a group without a leader, I end up making the decisions." },
    { es:"Me siento cómodo o cómoda dando instrucciones a otros.", en:"I'm comfortable giving instructions to others." },
    { inv:true, es:"Prefiero que otra persona asuma la responsabilidad de decidir.", en:"I'd rather someone else take responsibility for deciding." },
    { es:"Cuando las cosas se ponen difíciles, la gente me mira a mí para saber qué hacer.", en:"When things get hard, people look to me to know what to do." },
    { es:"Me molesta cuando está al mando alguien con menos claridad que yo.", en:"It bothers me when someone with less clarity than me is in charge." },
    { inv:true, es:"No me gusta destacar ni estar al frente.", en:"I don't like standing out or being in front." },
    { tie:true, es:"He dirigido un equipo, un evento o un proyecto y me resultó natural.", en:"I've led a team, an event or a project and it felt natural." },
    { tie:true, es:"Sostengo mis decisiones aunque no sean populares.", en:"I stand by my decisions even when they're unpopular." }
  ],
  COM: [
    { es:"Me cuesta perder, incluso en juegos sin importancia.", en:"I hate losing, even in games that don't matter." },
    { es:"Me comparo con otros y quiero estar por encima.", en:"I compare myself to others and want to come out on top." },
    { inv:true, es:"No me importa quién gana, solo pasarlo bien.", en:"I don't care who wins, just having a good time." },
    { es:"Practico más que los demás para superarlos.", en:"I practice more than others in order to beat them." },
    { es:"Una competencia me motiva más que cualquier premio.", en:"A competition motivates me more than any prize." },
    { inv:true, es:"Cedo con facilidad cuando alguien quiere ganar más que yo.", en:"I easily give way when someone wants to win more than I do." },
    { tie:true, es:"Llevo la cuenta de mis récords o marcas personales.", en:"I keep track of my records or personal bests." },
    { tie:true, es:"Si me dicen que no puedo, me esfuerzo el doble para demostrar lo contrario.", en:"If I'm told I can't, I work twice as hard to prove otherwise." }
  ],
  CHO: [
    { es:"Si alguien me provoca, respondo.", en:"If someone provokes me, I respond." },
    { es:"Prefiero un conflicto directo a dejar las cosas sin decir.", en:"I prefer a direct conflict to leaving things unsaid." },
    { inv:true, es:"Me cuesta enojarme, incluso cuando tengo razones.", en:"I find it hard to get angry, even when I have reasons to." },
    { es:"Cuando me enojo, se nota enseguida.", en:"When I get angry, it shows right away." },
    { es:"Me atraen los deportes de contacto, el combate o el ejercicio intenso.", en:"I'm drawn to contact sports, combat or intense exercise." },
    { inv:true, es:"Evito discutir, aunque eso signifique quedarme callado o callada.", en:"I avoid arguing, even if it means keeping quiet." },
    { tie:true, es:"Me he metido en discusiones fuertes por defender algo.", en:"I've gotten into heated arguments to defend something." },
    { tie:true, es:"Cuando estoy tenso o tensa, necesito descargar energía física.", en:"When I'm tense, I need to burn off physical energy." }
  ],
  CUI: [
    { es:"Cuando alguien está mal, dejo lo que estoy haciendo para ayudarle.", en:"When someone is having a hard time, I drop what I'm doing to help." },
    { es:"Me fijo en si los demás comieron, durmieron o se sienten bien.", en:"I notice whether others have eaten, slept or are feeling okay." },
    { es:"Sé reaccionar ante una herida o una emergencia, o me gustaría aprender.", en:"I know how to react to an injury or emergency, or I'd like to learn." },
    { inv:true, es:"Los problemas de los demás me agotan y prefiero no involucrarme.", en:"Other people's problems drain me and I'd rather not get involved." },
    { es:"Disfruto enseñar o acompañar a alguien hasta que aprende.", en:"I enjoy teaching or supporting someone until they learn." },
    { inv:true, es:"No suelo ser la persona a la que acuden en busca de consuelo.", en:"I'm not usually the person people come to for comfort." },
    { tie:true, es:"He cuidado por mucho tiempo a alguien enfermo, a un niño o a un animal.", en:"I've spent a long time caring for someone sick, a child or an animal." },
    { tie:true, es:"Me hace muy bien ver que alguien se recupera gracias a mi ayuda.", en:"It feels great to see someone recover thanks to my help." }
  ],
  ENC: [
    { es:"Me resulta fácil caerle bien a gente nueva.", en:"It's easy for me to win over new people." },
    { es:"Convenzo a otros más por mi forma de hablar que por mis argumentos.", en:"I persuade others more through how I talk than through my arguments." },
    { es:"El amor y los vínculos intensos son una parte central de mi vida.", en:"Love and intense relationships are a central part of my life." },
    { inv:true, es:"Me cuesta expresar lo que siento.", en:"I find it hard to express what I feel." },
    { es:"Cuido mi apariencia porque me importa la impresión que dejo.", en:"I take care of my appearance because I care about the impression I make." },
    { inv:true, es:"El romance y la vida en pareja no me interesan mucho.", en:"Romance and relationships don't interest me much." },
    { tie:true, es:"Me doy cuenta enseguida de quién le gusta a quién.", en:"I notice right away who has a crush on whom." },
    { tie:true, es:"La gente suele contarme sus asuntos del corazón.", en:"People often tell me about their love lives." }
  ],
  LEA: [
    { es:"Por mis amigos o mi familia hago cosas que nunca haría por mí.", en:"For my friends or family I do things I'd never do for myself." },
    { es:"Mantengo amistades de hace muchos años.", en:"I keep friendships from many years ago." },
    { inv:true, es:"Si un grupo deja de servirme, me voy sin mucho problema.", en:"If a group stops working for me, I leave without much trouble." },
    { es:"Cuando atacan a alguien de los míos, lo tomo como algo personal.", en:"When someone attacks one of my people, I take it personally." },
    { es:"Cumplo una promesa aunque me cueste caro.", en:"I keep a promise even when it costs me." },
    { inv:true, es:"Cambio de amistades con facilidad.", en:"I change friends easily." },
    { tie:true, es:"He defendido a alguien aunque eso me trajera problemas.", en:"I've stood up for someone even when it got me in trouble." },
    { tie:true, es:"Prefiero unas pocas personas de confianza a muchos conocidos.", en:"I'd rather have a few people I trust than many acquaintances." }
  ],
  JUS: [
    { es:"Me molesta muchísimo que alguien no reciba lo que merece, para bien o para mal.", en:"It really bothers me when someone doesn't get what they deserve, good or bad." },
    { es:"Llevo la cuenta de los favores: si alguien me ayuda, se lo devuelvo.", en:"I keep track of favors: if someone helps me, I pay them back." },
    { es:"Creo que quien hace daño debe pagar por ello.", en:"I believe whoever causes harm should pay for it." },
    { inv:true, es:"Prefiero perdonar y olvidar antes que exigir que alguien enfrente las consecuencias.", en:"I'd rather forgive and forget than demand that someone face the consequences." },
    { es:"Cuando hay que repartir algo, me aseguro de que sea justo para todos.", en:"When something has to be shared out, I make sure it's fair to everyone." },
    { inv:true, es:"Las injusticias que no me afectan no me quitan el sueño.", en:"Injustices that don't affect me don't keep me up at night." },
    { tie:true, es:"Me cuesta olvidar cuando alguien me hace algo injusto.", en:"I find it hard to forget when someone treats me unfairly." },
    { tie:true, es:"He intervenido para que alguien se hiciera cargo de lo que hizo.", en:"I've stepped in so someone would own up to what they did." }
  ],
  ART: [
    { es:"Hago algo creativo con frecuencia: música, dibujo, escritura, baile o actuación.", en:"I often do something creative: music, drawing, writing, dance or acting." },
    { es:"La música cambia mi ánimo por completo.", en:"Music completely changes my mood." },
    { inv:true, es:"No me considero una persona artística en absoluto.", en:"I don't consider myself artistic at all." },
    { es:"Me gusta mostrarle a otros lo que creo.", en:"I like showing others what I create." },
    { es:"Noto la belleza en cosas cotidianas: una luz, un color, un sonido.", en:"I notice beauty in everyday things: a light, a color, a sound." },
    { inv:true, es:"Las actividades artísticas me parecen una pérdida de tiempo.", en:"Artistic activities seem like a waste of time to me." },
    { tie:true, es:"Tengo un instrumento, un cuaderno o una herramienta creativa que uso casi a diario.", en:"I have an instrument, sketchbook or creative tool I use almost daily." },
    { tie:true, es:"Me expreso mejor con arte que con palabras directas.", en:"I express myself better through art than through direct words." }
  ],
  DIS: [
    { es:"Siempre me apunto a una fiesta, una salida o un buen plan.", en:"I'm always up for a party, an outing or a good plan." },
    { es:"Me doy gustos sin sentir culpa.", en:"I treat myself without feeling guilty." },
    { inv:true, es:"Me cuesta relajarme y disfrutar si tengo pendientes.", en:"I find it hard to relax and enjoy myself when I have things pending." },
    { es:"Soy quien anima el ambiente en una reunión.", en:"I'm the one who livens up a gathering." },
    { es:"La comida, la música y la buena compañía son de lo mejor de la vida.", en:"Food, music and good company are among the best things in life." },
    { inv:true, es:"Las celebraciones me parecen una pérdida de tiempo.", en:"Celebrations seem like a waste of time to me." },
    { tie:true, es:"Improviso planes divertidos a último minuto.", en:"I come up with fun plans at the last minute." },
    { tie:true, es:"Me río con facilidad, incluso de mí.", en:"I laugh easily, even at myself." }
  ],
  SOL: [
    { es:"Necesito tiempo a solas para recargarme.", en:"I need time alone to recharge." },
    { es:"Pienso mucho en el pasado, en la muerte o en el sentido de las cosas.", en:"I think a lot about the past, about death or about the meaning of things." },
    { inv:true, es:"Me aburro rápido cuando estoy solo o sola.", en:"I get bored quickly when I'm alone." },
    { es:"Me siento más cómodo o cómoda observando que siendo el centro de atención.", en:"I'm more comfortable observing than being the center of attention." },
    { es:"Hay partes de mí que casi nadie conoce.", en:"There are parts of me almost no one knows." },
    { inv:true, es:"Siempre busco estar rodeado o rodeada de gente.", en:"I always look to be surrounded by people." },
    { tie:true, es:"Me atraen los lugares silenciosos, oscuros o abandonados.", en:"I'm drawn to silent, dark or abandoned places." },
    { tie:true, es:"Me han dicho que doy una impresión distante o misteriosa.", en:"I've been told I come across as distant or mysterious." }
  ],
  CAL: [
    { es:"Me tomo las cosas con calma, aunque otros se apuren.", en:"I take things calmly, even when others are rushing." },
    { es:"Dormir bien es una prioridad para mí.", en:"Getting good sleep is a priority for me." },
    { inv:true, es:"Me cuesta quedarme quieto o quieta sin hacer nada.", en:"I find it hard to stay still doing nothing." },
    { es:"En una crisis, mantengo la cabeza fría.", en:"In a crisis, I keep a cool head." },
    { es:"Disfruto no hacer nada sin sentir que pierdo el tiempo.", en:"I enjoy doing nothing without feeling I'm wasting time." },
    { inv:true, es:"Vivo con prisa y con muchas cosas a la vez.", en:"I live in a hurry, juggling many things at once." },
    { tie:true, es:"Puedo quedarme dormido o dormida casi en cualquier lugar.", en:"I can fall asleep almost anywhere." },
    { tie:true, es:"La gente me busca porque le transmito tranquilidad.", en:"People seek me out because I make them feel calm." }
  ],
  NAT: [
    { es:"Paso tiempo al aire libre siempre que puedo.", en:"I spend time outdoors whenever I can." },
    { es:"Cuido plantas, un huerto o animales.", en:"I look after plants, a garden or animals." },
    { inv:true, es:"Prefiero la ciudad y los espacios cerrados antes que el campo o el mar.", en:"I prefer the city and indoor spaces to the countryside or the sea." },
    { es:"Me siento renovado o renovada cerca del mar, un río, el bosque o la montaña.", en:"I feel renewed near the sea, a river, the woods or the mountains." },
    { es:"Me fijo en el clima, las estaciones y los ciclos de la naturaleza.", en:"I pay attention to the weather, the seasons and nature's cycles." },
    { inv:true, es:"La tierra, el barro y los bichos me desagradan.", en:"Dirt, mud and bugs put me off." },
    { tie:true, es:"He hecho caminatas, acampado o salido a la naturaleza por gusto.", en:"I've gone hiking, camping or out into nature for fun." },
    { tie:true, es:"El agua me calma como pocas cosas: nadar, el mar, la lluvia.", en:"Water calms me like few other things: swimming, the sea, the rain." }
  ],
  RO: [
    { es:"Me siento bien siguiendo reglas claras y una jerarquía.", en:"I feel good following clear rules and a hierarchy." },
    { es:"Pongo el bien del grupo por encima de lo que yo quiero.", en:"I put the good of the group above what I want." },
    { inv:true, es:"Hago las cosas a mi manera, aunque no sea la forma establecida.", en:"I do things my own way, even when it isn't the established one." },
    { es:"La disciplina me ha llevado más lejos que el talento.", en:"Discipline has taken me further than talent." },
    { es:"Respeto las tradiciones y los rangos, aunque no siempre los entienda.", en:"I respect traditions and ranks, even when I don't always understand them." },
    { inv:true, es:"Me cuesta aceptar órdenes de alguien solo porque tiene un cargo.", en:"I find it hard to take orders from someone just because of their title." },
    { tie:true, es:"Me gusta pertenecer a algo más grande que yo, con símbolos y deberes.", en:"I like belonging to something bigger than me, with symbols and duties." },
    { tie:true, inv:true, es:"Prefiero improvisar antes que seguir un protocolo.", en:"I'd rather improvise than follow a protocol." }
  ]
},

/* Pares: "s" = etapa en la que aparecen. */
PAIRS: [
  { s:0, a:{ f:"PLA", es:"Planifico antes de actuar.", en:"I plan before I act." }, b:{ f:"AUD", es:"Actúo y ajusto sobre la marcha.", en:"I act and adjust on the fly." } },
  { s:0, a:{ f:"MIS", es:"Confío en lo que siento.", en:"I trust what I feel." }, b:{ f:"CUR", es:"Confío en lo que puedo comprobar.", en:"I trust what I can verify." } },
  { s:0, a:{ f:"CUR", es:"Me atraen más las ideas.", en:"Ideas draw me in more." }, b:{ f:"MAN", es:"Me atraen más las cosas que se pueden construir.", en:"Things I can build draw me in more." } },
  { s:1, a:{ f:"ING", es:"Busco el atajo.", en:"I look for the shortcut." }, b:{ f:"RO", es:"Sigo el procedimiento.", en:"I follow the procedure." } },
  { s:1, a:{ f:"ART", es:"Creo para expresar algo.", en:"I create to express something." }, b:{ f:"MAN", es:"Creo para que algo funcione.", en:"I create to make something work." } },
  { s:1, a:{ f:"AUD", es:"Voy donde está la aventura.", en:"I go where the adventure is." }, b:{ f:"LEA", es:"Me quedo donde están los míos.", en:"I stay where my people are." } },
  { s:2, a:{ f:"LID", es:"Prefiero guiar al grupo.", en:"I'd rather lead the group." }, b:{ f:"LEA", es:"Prefiero cubrirle las espaldas al grupo.", en:"I'd rather watch the group's back." } },
  { s:2, a:{ f:"COM", es:"Juego para ganar.", en:"I play to win." }, b:{ f:"DIS", es:"Juego para pasarlo bien.", en:"I play to have fun." } },
  { s:2, a:{ f:"CHO", es:"Ante un problema, lo enfrento de frente.", en:"When there's a problem, I face it head-on." }, b:{ f:"CAL", es:"Ante un problema, espero a que se calmen las aguas.", en:"When there's a problem, I wait for things to settle." } },
  { s:3, a:{ f:"CUI", es:"Me importa más que nadie salga herido.", en:"What matters most to me is that no one gets hurt." }, b:{ f:"JUS", es:"Me importa más que cada quien reciba lo justo.", en:"What matters most to me is that everyone gets what's fair." } },
  { s:3, a:{ f:"ENC", es:"Recargo energía con gente.", en:"I recharge around people." }, b:{ f:"SOL", es:"Recargo energía a solas.", en:"I recharge alone." } },
  { s:3, a:{ f:"JUS", es:"Prefiero que me respeten.", en:"I'd rather be respected." }, b:{ f:"ENC", es:"Prefiero que me quieran.", en:"I'd rather be loved." } },
  { s:4, a:{ f:"RO", es:"Valoro más la disciplina.", en:"I value discipline more." }, b:{ f:"ART", es:"Valoro más la creatividad.", en:"I value creativity more." } },
  { s:4, a:{ f:"DIS", es:"Un viernes ideal: salir.", en:"An ideal Friday: going out." }, b:{ f:"SOL", es:"Un viernes ideal: tranquilidad en casa.", en:"An ideal Friday: a quiet night in." } },
  { s:5, a:{ f:"NAT", es:"Un día libre lo paso al aire libre.", en:"I spend a day off outdoors." }, b:{ f:"CUR", es:"Un día libre lo paso aprendiendo algo.", en:"I spend a day off learning something." } },
  { s:5, a:{ f:"CAL", es:"Me gusta ir a mi ritmo.", en:"I like going at my own pace." }, b:{ f:"AUD", es:"Me gusta lo que me acelera el pulso.", en:"I like what gets my pulse racing." } }
],

/* Cuánto suma elegir una opción en un par (sobre una escala de 0 a 1). */
PAIR_BONUS: 0.06,

/* Orden: dentro de cada etapa se alternan los rasgos; los pares van
   repartidos. Se arma igual para todos, siempre en el mismo orden. */
build(){
  const items = [];
  this.STAGES.forEach((st, s) => {
    const fs = st.f;
    const main = {};
    fs.concat("RO").forEach(f => main[f] = this.BANK[f].map((x, i) => Object.assign({ id: f.toLowerCase() + (i + 1), f }, x)).filter(x => !x.tie));
    const seq = [];
    for (let r = 0; r < 6; r++) fs.forEach((f, k) => seq.push(main[f][(r + k) % 6]));
    seq.splice(9, 0, main.RO[s]);           // una de Deber por etapa
    const prs = this.PAIRS.map((p, i) => Object.assign({ id: "p" + (i + 1), t: "p" }, p)).filter(p => p.s === s);
    const step = Math.floor(seq.length / (prs.length + 1));
    prs.forEach((p, k) => seq.splice(step * (k + 1) + k, 0, p));
    seq.forEach(it => { it.s = s; if (!it.t) it.t = "l"; items.push(it); });
  });
  const tie = {};
  Object.keys(this.BANK).forEach(f => tie[f] = this.BANK[f].map((x, i) => Object.assign({ id: f.toLowerCase() + (i + 1), f, t: "l" }, x)).filter(x => x.tie));
  return { items, tie };
}
};
