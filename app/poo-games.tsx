"use client";

import { useEffect, useMemo, useState } from "react";

type PillarId = "encapsulamiento" | "abstraccion" | "herencia" | "polimorfismo";
type Challenge = {
  prompt: string;
  code: string;
  options: string[];
  answer: string;
  explanation: string;
};
type Pillar = {
  id: PillarId;
  name: string;
  short: string;
  icon: string;
  color: string;
  mission: string;
  unlock: string;
  technical: string;
  kid: string;
  example: string;
  challenges: Challenge[];
};

const pillars: Pillar[] = [
  {
    id: "encapsulamiento",
    name: "Encapsulamiento",
    short: "Protege el estado",
    icon: "◈",
    color: "game-violet",
    mission: "Diseña objetos que protejan sus datos y expongan solo operaciones seguras.",
    unlock: "Empieza aquí",
    technical: "Técnica: agrupa el estado y el comportamiento de un objeto, restringiendo el acceso directo para proteger sus invariantes.",
    kid: "Para un niño: imagina una mochila con cierre. Puedes usar lo que hay dentro mediante reglas, pero no cualquiera puede abrirla y revolverla.",
    example: "Vida de un videojuego: el jugador no cambia directamente sus corazones; llama a RecibirDaño() y el objeto decide si pierde una vida.",
    challenges: [
      { prompt: "Un saldo no debe poder cambiarse desde fuera de la cuenta. ¿Cuál diseño es correcto?", code: "class Account {\n  ___ decimal balance;\n  public void Deposit(decimal amount) { ... }\n}", options: ["public", "private", "static", "internal"], answer: "private", explanation: "private oculta el estado. La clase controla los cambios a través de métodos como Deposit." },
      { prompt: "Quieres permitir leer Name, pero solo el objeto puede modificarlo. ¿Qué propiedad eliges?", code: "public string Name { get; ___ set; }", options: ["public", "private", "static", "virtual"], answer: "private", explanation: "Un setter privado permite lectura pública y escritura controlada desde la propia clase." },
      { prompt: "¿Qué principio estás aplicando al validar amount antes de cambiar balance?", code: "public void Deposit(decimal amount) {\n  if (amount > 0) balance += amount;\n}", options: ["Proteger invariantes", "Duplicar estados", "Herencia múltiple", "Acoplar detalles"], answer: "Proteger invariantes", explanation: "Una invariante es una regla que siempre debe cumplirse. El objeto evita que el saldo reciba valores inválidos." },
      { prompt: "¿Qué miembro debería ocultar la cantidad de vidas del jugador?", code: "class Player {\n  ___ int lives = 3;\n}", options: ["private", "public", "global", "open"], answer: "private", explanation: "El estado interno debe protegerse para que solo los métodos del objeto puedan cambiarlo correctamente." },
      { prompt: "¿Qué método mantiene controlado el cambio de temperatura?", code: "public void SetTemperature(int value) {\n  if (value >= -20 && value <= 50) ___;\n}", options: ["temperature = value", "public temperature", "delete value", "return class"], answer: "temperature = value", explanation: "El método valida el dato antes de guardarlo, protegiendo una regla del objeto." },
      { prompt: "¿Cuál es una señal de encapsulamiento débil?", code: "public List<Item> Items { get; set; }", options: ["Cualquiera puede modificar la lista", "La lista está protegida", "El método valida entradas", "La clase oculta detalles"], answer: "Cualquiera puede modificar la lista", explanation: "Exponer una colección mutable permite cambios sin pasar por las reglas del objeto." },
      { prompt: "¿Qué opción ofrece una operación segura para retirar dinero?", code: "public bool Withdraw(decimal amount) { ... }", options: ["Validar saldo dentro del método", "Hacer balance público", "Devolver todos los campos", "Usar una variable global"], answer: "Validar saldo dentro del método", explanation: "El propio objeto conserva el control sobre sus reglas y comunica si la operación fue posible." },
      { prompt: "¿Qué protege el encapsulamiento principalmente?", code: "private decimal balance;", options: ["El estado y sus reglas", "La velocidad de Internet", "El color de la interfaz", "El nombre del proyecto"], answer: "El estado y sus reglas", explanation: "La meta es evitar estados inválidos y reducir dependencias sobre detalles internos." },
      { prompt: "¿Qué acceso permite que solo la clase y sus hijas escriban el valor?", code: "protected ___ Score;", options: ["int", "private", "public", "interface"], answer: "int", explanation: "int es el tipo del campo; protected sería el modificador de acceso. Aquí la pregunta identifica el tipo correcto del dato." },
      { prompt: "¿Por qué un constructor puede ayudar al encapsulamiento?", code: "new User(\"Ana\");", options: ["Crea un objeto válido desde el inicio", "Hace todos los campos públicos", "Elimina las reglas", "Evita usar métodos"], answer: "Crea un objeto válido desde el inicio", explanation: "El constructor puede validar y dejar listo el estado inicial del objeto." },
      { prompt: "¿Qué diseño respeta mejor una contraseña?", code: "user.___(password);", options: ["ChangePassword con validación", "user.Password = password", "global.Password = password", "public Password[]"], answer: "ChangePassword con validación", explanation: "Una operación controlada permite validar la contraseña sin exponer el dato sensible como un campo público." },
      { prompt: "Si un objeto impide que su saldo sea negativo, está protegiendo una...", code: "balance >= 0", options: ["Invariante", "Herencia", "Interfaz gráfica", "Sobrecarga"], answer: "Invariante", explanation: "Una invariante es una condición que debe mantenerse verdadera durante la vida del objeto." },
    ],
  },
  {
    id: "abstraccion",
    name: "Abstracción",
    short: "Modela lo esencial",
    icon: "✦",
    color: "game-peach",
    mission: "Quédate con el contrato importante y oculta la complejidad que no necesita el consumidor.",
    unlock: "Completa Encapsulamiento",
    technical: "Técnica: modela las características esenciales mediante contratos y oculta los detalles de implementación que no necesita el consumidor.",
    kid: "Para un niño: un control remoto tiene botones para subir volumen, pero no necesitas saber cómo funcionan los cables por dentro.",
    example: "Una interfaz IPayment dice Pay(amount). La tienda usa ese contrato sin conocer si el pago se hace con tarjeta, efectivo o una app.",
    challenges: [
      { prompt: "El cliente solo necesita pedir un pago. ¿Qué debería conocer?", code: "public interface IPayment {\n  ___ Pay(decimal amount);\n}", options: ["El contrato", "La conexión SQL", "Los reintentos internos", "Todos los campos"], answer: "El contrato", explanation: "La abstracción expone qué se puede hacer, no cómo se implementa internamente." },
      { prompt: "¿Qué miembro expresa mejor una capacidad esencial de un reporte?", code: "public abstract class Report {\n  public abstract ___ Render();\n}", options: ["string", "private", "database", "constructor"], answer: "string", explanation: "Render representa el resultado esencial. Cada tipo concreto decide cómo construir ese string." },
      { prompt: "Una clase Facade simplifica cinco servicios detrás de un único método. ¿Qué está haciendo?", code: "checkout.___(order);", options: ["Ocultando complejidad", "Copiando herencia", "Exponiendo campos", "Rompiendo el contrato"], answer: "Ocultando complejidad", explanation: "Una fachada ofrece una entrada simple y mantiene los detalles de coordinación detrás de la abstracción." },
      { prompt: "¿Qué parte debe ver quien usa una cafetera?", code: "coffeeMachine.___(button);", options: ["El botón para preparar café", "Los cables internos", "El algoritmo del calor", "Cada tornillo"], answer: "El botón para preparar café", explanation: "La abstracción muestra la acción útil y oculta cómo se ejecuta." },
      { prompt: "Una interfaz funciona como...", code: "interface IPlayable { void Play(); }", options: ["Un contrato", "Una base de datos", "Un campo público", "Una contraseña"], answer: "Un contrato", explanation: "La interfaz define qué debe poder hacer un tipo, sin imponer todos sus detalles internos." },
      { prompt: "¿Qué detalle conviene ocultar en un método SendEmail?", code: "mailer.SendEmail(to, body);", options: ["SMTP, reintentos y conexión", "El destinatario", "El cuerpo del mensaje", "La acción de enviar"], answer: "SMTP, reintentos y conexión", explanation: "El consumidor necesita pedir el envío; no necesita coordinar todos los detalles técnicos." },
      { prompt: "¿Qué elemento describe mejor la abstracción?", code: "printer.Print(document);", options: ["Qué hace el objeto", "Cada paso interno", "Todos sus campos", "Su memoria exacta"], answer: "Qué hace el objeto", explanation: "La abstracción permite trabajar con una idea sencilla en lugar de con toda la complejidad." },
      { prompt: "¿Qué tipo de miembro suele expresar una operación abstracta?", code: "public abstract void ___();", options: ["Draw", "database", "private", "field"], answer: "Draw", explanation: "Draw es un nombre de operación. Una clase derivada deberá aportar la forma concreta de dibujar." },
      { prompt: "Si una app llama Login() sin conocer cómo verifica la contraseña, usa...", code: "auth.___(user, password);", options: ["Abstracción", "Campos expuestos", "Herencia múltiple", "Acoplamiento directo"], answer: "Abstracción", explanation: "Login ofrece una acción simple y mantiene los pasos de seguridad detrás del método." },
      { prompt: "¿Qué ventaja tiene programar contra una interfaz?", code: "void Run(IJob job) { job.Execute(); }", options: ["Cambiar implementaciones fácilmente", "Conocer todos los detalles", "Crear más variables globales", "Evitar contratos"], answer: "Cambiar implementaciones fácilmente", explanation: "El consumidor depende del contrato y puede recibir diferentes implementaciones compatibles." },
      { prompt: "¿Qué NO es una buena abstracción?", code: "order.ProcessEverythingIncludingSQLAndUI();", options: ["Un método gigante con demasiadas responsabilidades", "Un contrato claro", "Una acción sencilla", "Una interfaz enfocada"], answer: "Un método gigante con demasiadas responsabilidades", explanation: "Una buena abstracción simplifica y comunica; no debe esconder un diseño confuso y enorme." },
      { prompt: "¿Qué pregunta ayuda a encontrar una abstracción?", code: "IStorage.Save(data);", options: ["¿Qué necesita saber el usuario?", "¿Qué variable tiene más letras?", "¿Qué color usaré?", "¿Cuántos cables hay?"], answer: "¿Qué necesita saber el usuario?", explanation: "La abstracción parte de las necesidades del consumidor y deja fuera lo que no necesita conocer." },
    ],
  },
  {
    id: "herencia",
    name: "Herencia",
    short: "Reutiliza una base",
    icon: "⌘",
    color: "game-blue",
    mission: "Comparte comportamiento común con una relación genuina de tipo base y tipo derivado.",
    unlock: "Completa Abstracción",
    technical: "Técnica: permite crear tipos derivados que reutilizan y especializan miembros de una clase base, expresando una relación es-un.",
    kid: "Para un niño: una bicicleta y una moto son vehículos. Comparten cosas como moverse, pero cada una puede hacerlo de una forma diferente.",
    example: "Animal puede ser la clase base; Dog hereda de Animal y agrega Bark(), porque un perro es un animal.",
    challenges: [
      { prompt: "Dog es un Animal y necesita el comportamiento común de Animal. ¿Qué sintaxis usas?", code: "public class Dog ___ Animal { }", options: [":", "=>", "implements", "extends"], answer: ":", explanation: "En C#, dos puntos indican la clase base y las interfaces que implementa el tipo." },
      { prompt: "La clase hija cambia una implementación virtual heredada. ¿Qué palabra clave necesita?", code: "public ___ void Speak() { ... }", options: ["override", "overload", "replace", "inherit"], answer: "override", explanation: "override reemplaza el comportamiento virtual de la clase base manteniendo el contrato polimórfico." },
      { prompt: "¿Cuándo es una mala señal usar herencia?", code: "class Report : DatabaseConnection { }", options: ["Cuando solo quieres reutilizar código", "Cuando existe un verdadero es-un", "Cuando la base define un contrato", "Cuando hay polimorfismo"], answer: "Cuando solo quieres reutilizar código", explanation: "Si la relación no es un verdadero es-un, composición suele comunicar mejor el diseño y reduce el acoplamiento." },
      { prompt: "¿Qué clase sería una buena base para Car y Bicycle?", code: "class Car : ___ { }", options: ["Vehicle", "Engine", "Wheel", "Garage"], answer: "Vehicle", explanation: "Car y Bicycle son vehículos; la relación es-un justifica compartir una base Vehicle." },
      { prompt: "¿Qué palabra impide crear una instancia directa de una base?", code: "public ___ class Shape { }", options: ["abstract", "private", "sealed", "static"], answer: "abstract", explanation: "Una clase abstracta define una base incompleta que se usa para crear tipos derivados." },
      { prompt: "¿Qué palabra impide que otra clase herede de Token?", code: "public ___ class Token { }", options: ["sealed", "virtual", "abstract", "base"], answer: "sealed", explanation: "sealed cierra la cadena de herencia para ese tipo." },
      { prompt: "¿Qué miembro permite que una hija personalice la conducta?", code: "public ___ void Move() { }", options: ["virtual", "private", "const", "readonly"], answer: "virtual", explanation: "virtual permite que una clase derivada lo reemplace con override." },
      { prompt: "¿Qué palabra llama a la implementación de la clase base?", code: "return ___ .Calculate();", options: ["base", "this", "parent", "superclass"], answer: "base", explanation: "base permite acceder a miembros de la clase base desde la clase derivada." },
      { prompt: "¿Qué riesgo aparece en una jerarquía de herencia demasiado profunda?", code: "A : B : C : D : E", options: ["Es difícil entender y cambiar el comportamiento", "Todos los objetos son más seguros", "No hay acoplamiento", "El código se vuelve mágico"], answer: "Es difícil entender y cambiar el comportamiento", explanation: "Muchas capas hacen difícil saber de dónde viene una conducta; conviene mantener jerarquías simples." },
      { prompt: "¿Qué significa principalmente que Cat herede de Animal?", code: "class Cat : Animal { }", options: ["Cat es un Animal", "Animal es un Cat", "Cat contiene una base de datos", "Cat no puede tener métodos"], answer: "Cat es un Animal", explanation: "La herencia expresa una relación de especialización: Cat es una versión particular de Animal." },
      { prompt: "¿Qué opción usa composición en lugar de herencia?", code: "class Car {\n  private Engine engine;\n}", options: ["Car tiene un Engine", "Car es un Engine", "Engine es un Car", "Car hereda todo"], answer: "Car tiene un Engine", explanation: "La composición modela tiene-un y suele ser mejor cuando una clase usa otra sin ser del mismo tipo." },
      { prompt: "¿Qué se reutiliza normalmente desde una clase base?", code: "class Admin : User { }", options: ["Miembros y comportamiento compartido", "La cuenta de otra persona", "La memoria del computador", "El diseño visual"], answer: "Miembros y comportamiento compartido", explanation: "La clase derivada puede reutilizar miembros accesibles y agregar especializaciones propias." },
    ],
  },
  {
    id: "polimorfismo",
    name: "Polimorfismo",
    short: "Una interfaz, muchas formas",
    icon: "∞",
    color: "game-mint",
    mission: "Escribe código que dependa de contratos y permita que cada tipo responda a su manera.",
    unlock: "Completa Herencia",
    technical: "Técnica: permite tratar objetos de tipos diferentes mediante un mismo contrato, mientras cada implementación responde con su comportamiento propio.",
    kid: "Para un niño: si dices “habla” a un perro, un gato o un robot, todos responden, pero cada uno lo hace con un sonido distinto.",
    example: "Una lista de IShape puede contener Circle y Rectangle. Al llamar Draw(), cada figura se dibuja según su propia implementación.",
    challenges: [
      { prompt: "Quieres procesar EmailNotification y SmsNotification sin preguntar el tipo concreto. ¿Qué recibes?", code: "void Send( ___ notification) {\n  notification.Deliver();\n}", options: ["INotification", "EmailNotification", "object", "dynamic"], answer: "INotification", explanation: "El consumidor depende de la interfaz. Cada implementación resuelve Deliver con su propia forma." },
      { prompt: "¿Qué salida demuestra despacho dinámico?", code: "Animal pet = new Dog();\npet.Speak();", options: ["La versión de Dog", "Siempre la versión de Animal", "No compila", "Ambas a la vez"], answer: "La versión de Dog", explanation: "Con un método virtual, la implementación concreta se elige en tiempo de ejecución." },
      { prompt: "¿Qué beneficio obtienes al agregar CardPayment sin modificar Checkout?", code: "checkout.Pay(new CardPayment());", options: ["Extensión sin cambiar el consumidor", "Más if por tipo", "Acoplamiento a Card", "Eliminar la interfaz"], answer: "Extensión sin cambiar el consumidor", explanation: "El polimorfismo permite agregar formas nuevas que cumplen el contrato sin reescribir el código que las usa." },
      { prompt: "¿Qué tienen en común las clases que participan en polimorfismo?", code: "void Play(IPlayable item) { item.Play(); }", options: ["Comparten un contrato", "Tienen exactamente el mismo código", "Usan el mismo estado", "Son siempre la misma clase"], answer: "Comparten un contrato", explanation: "El contrato permite que el consumidor las use de forma uniforme aunque internamente sean diferentes." },
      { prompt: "¿Qué método se ejecuta con una referencia Animal que apunta a Dog?", code: "Animal a = new Dog();\na.Speak();", options: ["Dog.Speak", "Solo Animal.Speak", "Ninguno", "El constructor"], answer: "Dog.Speak", explanation: "El despacho dinámico selecciona la implementación concreta del objeto real." },
      { prompt: "¿Qué elimina el polimorfismo en este diseño?", code: "if (x is Dog) ...\nelse if (x is Cat) ...", options: ["Muchos if por tipo", "Los contratos", "Los métodos", "Las clases"], answer: "Muchos if por tipo", explanation: "En lugar de preguntar qué tipo es, se llama al mismo método y cada objeto resuelve su versión." },
      { prompt: "¿Qué palabra permite reemplazar un método virtual?", code: "public ___ void Draw() { }", options: ["override", "newonly", "replace", "inherit"], answer: "override", explanation: "override conecta la implementación de la clase derivada con el método virtual de la base." },
      { prompt: "¿Qué objeto puede recibir este método?", code: "void Save(IStorable item) { item.Save(); }", options: ["Cualquier tipo que implemente IStorable", "Solo una clase llamada Item", "Solo strings", "Ningún objeto"], answer: "Cualquier tipo que implemente IStorable", explanation: "El polimorfismo trabaja con cualquier implementación compatible con el contrato." },
      { prompt: "¿Qué describe mejor una misma orden con respuestas distintas?", code: "animal.Speak();", options: ["Polimorfismo", "Una variable global", "Un comentario", "Un constructor privado"], answer: "Polimorfismo", explanation: "La misma llamada puede producir una respuesta distinta según el tipo concreto del objeto." },
      { prompt: "¿Qué principio de diseño favorece agregar nuevas formas sin editar mucho código existente?", code: "List<IExporter> exporters;", options: ["Abierto para extensión", "Todo público", "Una clase gigante", "Duplicación"], answer: "Abierto para extensión", explanation: "Con contratos y polimorfismo puedes agregar implementaciones nuevas con menos cambios en el consumidor." },
      { prompt: "¿Qué diferencia hay entre sobrecarga y polimorfismo?", code: "Print(int x) / Print(string x)", options: ["La sobrecarga cambia parámetros; el polimorfismo cambia implementaciones", "Son exactamente iguales", "Ninguna usa métodos", "Polimorfismo solo sirve para variables"], answer: "La sobrecarga cambia parámetros; el polimorfismo cambia implementaciones", explanation: "La sobrecarga elige entre firmas distintas; el polimorfismo permite variar la conducta detrás de un contrato común." },
      { prompt: "¿Por qué el polimorfismo hace más fácil agregar un nuevo pago?", code: "checkout.Pay(new WalletPayment());", options: ["Checkout usa el contrato, no conoce cada clase", "Checkout necesita otro if", "Hay que borrar CardPayment", "No se puede agregar"], answer: "Checkout usa el contrato, no conoce cada clase", explanation: "El consumidor se mantiene estable y la nueva forma se conecta cumpliendo la misma interfaz." },
    ],
  },
];

const masteryKey = "csharp-quest-poo-mastery-v2";

export function PooGames() {
  const [mastered, setMastered] = useState<PillarId[]>([]);
  const [activeId, setActiveId] = useState<PillarId>("encapsulamiento");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [notice, setNotice] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(masteryKey) || "[]");
      if (Array.isArray(stored)) setMastered(stored.filter((id): id is PillarId => pillars.some(pillar => pillar.id === id)));
    } catch { /* local progress is optional */ }
  }, []);

  const active = useMemo(() => pillars.find(pillar => pillar.id === activeId) || pillars[0], [activeId]);
  const challenge = active.challenges[index];
  const activePosition = pillars.findIndex(pillar => pillar.id === active.id);
  const unlocked = (pillar: Pillar) => pillar.id === "encapsulamiento" || mastered.includes(pillars[Math.max(0, pillars.findIndex(item => item.id === pillar.id) - 1)].id);

  const choosePillar = (pillar: Pillar) => {
    if (!unlocked(pillar)) return;
    setActiveId(pillar.id);
    setIndex(0);
    setCorrect(0);
    setSelected(null);
    setNotice("");
    setFinished(false);
  };

  const answer = (option: string) => {
    if (selected) return;
    setSelected(option);
  };

  const next = () => {
    if (!selected || finished) return;
    const result = selected === challenge.answer ? correct + 1 : correct;
    if (index < active.challenges.length - 1) {
      setIndex(value => value + 1);
      setSelected(null);
      setCorrect(result);
      return;
    }
    setCorrect(result);
    setFinished(true);
    if (result === active.challenges.length) {
      const nextMastery = Array.from(new Set([...mastered, active.id]));
      setMastered(nextMastery);
      localStorage.setItem(masteryKey, JSON.stringify(nextMastery));
      setNotice(`¡${active.name} dominado! El siguiente juego ya está disponible.`);
    } else {
      setNotice("Aún falta una respuesta correcta. Reinicia este juego y vuelve a intentarlo para dominarlo.");
    }
  };

  const reset = () => {
    setIndex(0);
    setCorrect(0);
    setSelected(null);
    setNotice("");
    setFinished(false);
  };

  return <section className="games-section">
    <div className="games-heading">
      <div><p className="eyebrow">LABORATORIO DE POO</p><h2>Aprende jugando, <span>sin saltos.</span></h2><p>Domina los cuatro pilares con misiones cortas. Para avanzar necesitas acertar todos los retos del pilar.</p></div>
      <div className="games-score"><strong>{mastered.length}/4</strong><span>pilares dominados</span></div>
    </div>
    <div className="pillar-track" aria-label="Progreso de los cuatro pilares">
      {pillars.map((pillar, pillarIndex) => <button key={pillar.id} className={`pillar-chip ${active.id === pillar.id ? "active" : ""} ${mastered.includes(pillar.id) ? "done" : ""} ${unlocked(pillar) ? "" : "locked"}`} onClick={() => choosePillar(pillar)} disabled={!unlocked(pillar)}><span className={`pillar-chip-icon ${pillar.color}`}>{mastered.includes(pillar.id) ? "✓" : pillar.icon}</span><span><b>{pillarIndex + 1}. {pillar.name}</b><small>{mastered.includes(pillar.id) ? "Dominado" : unlocked(pillar) ? pillar.short : pillar.unlock}</small></span></button>)}
    </div>
    <div className="concept-card"><div className={`concept-icon ${active.color}`}>{active.icon}</div><div><p className="eyebrow">ENTIENDE ANTES DE JUGAR</p><h3>{active.name}</h3><p><b>Definición técnica:</b> {active.technical.replace("Técnica: ", "")}</p><p><b>Explicado para 14 años:</b> {active.kid.replace("Para un niño: ", "")}</p><div className="concept-example"><b>Ejemplo:</b> {active.example}</div></div></div>
    <div className="game-panel">
      <div className="game-panel-head"><div><p className="eyebrow">MISIÓN {activePosition + 1} · RETO {index + 1} DE {active.challenges.length}</p><h3>{active.name}</h3><p>{active.mission}</p></div><button className="game-reset" onClick={reset}>Reiniciar</button></div>
      <div className="game-progress"><div style={{ width: `${((index + (selected ? 1 : 0)) / active.challenges.length) * 100}%` }} /></div>
      <div className="game-challenge"><p className="game-prompt">{challenge.prompt}</p><pre>{challenge.code}</pre><div className="game-options">{challenge.options.map((option, optionIndex) => <button key={option} className={`game-option ${selected && option === challenge.answer ? "right" : ""} ${selected === option && option !== challenge.answer ? "wrong" : ""}`} onClick={() => answer(option)} disabled={Boolean(selected)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>{selected && <div className={`game-feedback ${selected === challenge.answer ? "good" : "bad"}`}><strong>{selected === challenge.answer ? "¡Correcto!" : "Buen intento, revisemos."}</strong><p>{challenge.explanation}</p></div>}</div>
      {selected && <button className="primary-cta game-next" onClick={next} disabled={finished}>{index < active.challenges.length - 1 ? "Siguiente reto" : "Terminar misión"}<span>→</span></button>}
      {notice && <div className={`game-notice ${mastered.includes(active.id) ? "mastered" : "retry"}`}><strong>{notice}</strong>{mastered.includes(active.id) && activePosition < pillars.length - 1 && <button onClick={() => choosePillar(pillars[activePosition + 1])}>Jugar siguiente pilar →</button>}</div>}
    </div>
    <div className="games-rule"><span>✓</span><p><b>Regla de dominio:</b> una misión solo se marca como completada con 10/10 respuestas correctas. Si fallas, puedes reiniciarla y repetirla hasta que el concepto quede claro.</p></div>
  </section>;
}

export function GamesHub() {
  const [module, setModule] = useState<"poo" | "future">("poo");

  return <section className="games-hub">
    <div className="games-hub-head"><div><p className="eyebrow">ARCADE DE APRENDIZAJE</p><h2>Juega para aprender, <span>aprende para recordar.</span></h2><p>Elige un módulo. Iremos agregando nuevos juegos y habilidades sin mezclar sus progresos.</p></div><div className="games-hub-badge">Módulos activos <b>1</b></div></div>
    <nav className="game-modules" aria-label="Módulos de juegos"><button className={module === "poo" ? "active" : ""} onClick={() => setModule("poo")}><span className="module-game-icon">◈</span><span><b>POO</b><small>4 pilares · 40 preguntas</small></span><strong>→</strong></button><button className={module === "future" ? "active" : ""} onClick={() => setModule("future")}><span className="module-game-icon future">+</span><span><b>Próximamente</b><small>Nuevos juegos y retos</small></span><strong>→</strong></button></nav>
    {module === "poo" ? <PooGames/> : <div className="future-games"><div>✦</div><h3>Más módulos en camino</h3><p>Aquí agregaremos juegos de SOLID, LINQ, async/await y entrevistas .NET.</p><button className="primary-cta" onClick={() => setModule("poo")}>Volver a POO <span>→</span></button></div>}
  </section>;
}
