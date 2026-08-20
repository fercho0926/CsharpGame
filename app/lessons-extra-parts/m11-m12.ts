import type { AdvancedQuestion, AdvancedStep } from "../advanced-lessons";

// sqr rota las opciones según `shift` para que la respuesta correcta no quede
// siempre en el mismo índice (evita el patrón "la correcta siempre es A").
// Mismo patrón que app/lessons-extra-parts/m01.ts.
const sqr = (prompt: string, correct: string, wrong: [string, string, string], shift: number, why: string, code = ""): AdvancedQuestion => {
  const all = [correct, ...wrong];
  const options = all.map((_, k) => all[(k + shift) % 4]);
  const answer = (4 - shift) % 4;
  return { prompt, options, answer, why, code };
};

export const stepsM11M12: AdvancedStep[] = [
 {
  id: "m11-virtual-override",
  title: "Virtual y override",
  summary: "virtual en la clase base habilita el despacho dinámico; override en la clase derivada reemplaza esa implementación y participa en el polimorfismo. Si en la derivada usas `new` en lugar de `override`, solo ocultas el miembro: una referencia tipada como la base seguirá llamando a la versión base.",
  code: `class Animal
{
    public virtual string Sound() => "...";
}
class Dog : Animal
{
    public override string Sound() => "Guau";
}
Animal a = new Dog();
Console.WriteLine(a.Sound());`,
  questions: [
   sqr("¿Qué imprime este código?", "Guau", ["...", "Error de compilación", "Sound"], 0,
    "a es de tipo Animal, pero Sound es virtual y Dog lo sobrescribe con override; el despacho dinámico usa el tipo real del objeto (Dog) en tiempo de ejecución.",
    `class Animal
{
    public virtual string Sound() => "...";
}
class Dog : Animal
{
    public override string Sound() => "Guau";
}
Animal a = new Dog();
Console.WriteLine(a.Sound());`),
   sqr("¿Qué imprime este código si Dog oculta Sound con `new` en lugar de `override`?", "...", ["Guau", "Error de compilación", "Excepción en tiempo de ejecución"], 1,
    "`new` oculta el miembro pero no participa en el polimorfismo; una referencia de tipo Animal invoca la implementación de Animal, no la de Dog.",
    `class Dog : Animal
{
    public new string Sound() => "Guau";
}
Animal a = new Dog();
Console.WriteLine(a.Sound());`),
   sqr("¿Qué palabra clave se requiere en la clase base para permitir que un método se sobrescriba en una derivada?", "virtual (o abstract)", ["override", "sealed", "static"], 2,
    "Un método debe declararse virtual (o abstract) en la base para que una clase derivada pueda usar override sobre él."),
   sqr("¿Qué ocurre si declaras `override` en un método derivado sin que el método base sea virtual, abstract u override?", "Error de compilación", ["Compila con advertencia", "Se convierte automáticamente en virtual", "Se ignora silenciosamente"], 3,
    "override exige que exista un miembro virtual/abstract/override compatible en la cadena de herencia; si no existe, el compilador falla."),
   sqr("¿Qué hace `sealed override` en una clase derivada?", "Impide que clases que hereden de esta vuelvan a sobrescribir el método", ["Convierte el método en estático", "Elimina el método de la clase base", "Hace el método privado"], 0,
    "sealed sobre un override cierra esa rama de la jerarquía: las clases que hereden de esta ya no podrán volver a sobrescribir ese miembro."),
   sqr("¿Qué permite `base.Sound()` dentro de un override?", "Invocar explícitamente la implementación de la clase base", ["Llamar a Sound() de forma recursiva infinita siempre", "Acceder a un miembro privado de Animal", "Convertir Cat en Animal de forma permanente"], 1,
    "base.Miembro() invoca directamente la implementación heredada, sin pasar por el despacho dinámico, típicamente para extender el comportamiento base.",
    `class Cat : Animal
{
    public override string Sound() => "Miau (" + base.Sound() + ")";
}`),
   sqr("¿Qué ocurre si un método derivado repite nombre y firma de uno virtual de la base, sin escribir `override` ni `new`?", "Compila con advertencia (CS0114) y oculta al de la base, igual que con `new`", ["Error de compilación obligatorio", "Se sobrescribe automáticamente como si tuviera override", "El programa falla en tiempo de ejecución"], 2,
    "El compilador asume ocultamiento implícito (comportamiento equivalente a `new`) y emite la advertencia CS0114 recomendando ser explícito."),
   sqr("¿Qué tipo determina qué implementación se ejecuta con virtual/override?", "El tipo real (en tiempo de ejecución) del objeto", ["El tipo de la variable usada para invocarlo", "El tipo declarado en el constructor", "El primer tipo de la jerarquía de herencia"], 3,
    "El despacho polimórfico consulta el tipo concreto del objeto en memoria, no el tipo estático de la referencia que lo señala."),
   sqr("¿Puede un método `virtual` tener cuerpo propio en la clase base?", "Sí, virtual exige una implementación (a diferencia de abstract)", ["No, virtual siempre está vacío como abstract", "Solo si la clase base es abstracta", "Solo si se marca también como partial"], 0,
    "A diferencia de abstract, un miembro virtual debe tener cuerpo; las clases derivadas pueden usarlo tal cual o sobrescribirlo."),
   sqr("¿Qué distingue conceptualmente a `override` de `new` al redefinir un miembro?", "override participa en el despacho polimórfico; new solo oculta el miembro para el tipo derivado", ["Son exactamente sinónimos en IL", "new es más rápido en tiempo de ejecución", "override no permite llamar a la versión base"], 1,
    "override reemplaza la implementación consultada dinámicamente; new crea un miembro distinto que solo se ve al usar una referencia del tipo derivado."),
  ],
 },
 {
  id: "m11-polymorphism",
  title: "Polimorfismo",
  summary: "El polimorfismo en tiempo de ejecución permite tratar objetos de distintos tipos derivados a través de una referencia común (la clase base o una interfaz) e invocar el comportamiento específico de cada uno. Se distingue del polimorfismo en tiempo de compilación (sobrecarga de métodos), resuelto por el compilador según la firma.",
  code: `abstract class Shape
{
    public abstract double Area();
}
class Circle : Shape
{
    public double Radius;
    public override double Area() => Math.PI * Radius * Radius;
}
class Square : Shape
{
    public double Side;
    public override double Area() => Side * Side;
}
Shape[] shapes = { new Circle { Radius = 2 }, new Square { Side = 3 } };
foreach (var s in shapes)
    Console.WriteLine(s.Area());`,
  questions: [
   sqr("¿Qué áreas imprime el foreach y en qué orden (valores aproximados)?", "Primero ≈12.57 (círculo de radio 2) y luego 9 (cuadrado de lado 3)", ["Primero 9 (cuadrado) y luego ≈12.57 (círculo)", "Ambas imprimen 0 porque Shape es abstracta", "Solo imprime 9, porque Circle no sobrescribe Area()"], 1,
    "El array respeta el orden de inicialización (Circle primero, Square después) y cada Area() usa la implementación override correspondiente."),
   sqr("¿Por qué es válido crear un array `Shape[]` con instancias de Circle y Square?", "Porque Circle y Square heredan de Shape (relación Is-A) y pueden tratarse polimórficamente como Shape", ["Porque Shape es una interfaz implícita", "Porque el array usa dynamic internamente", "Porque C# convierte automáticamente cualquier tipo a Shape"], 2,
    "Una referencia de tipo base puede apuntar a cualquier instancia de una clase derivada; esa es la esencia de la sustitución polimórfica."),
   sqr("¿Qué permite que `s.Area()` ejecute la implementación correcta (Circle o Square) dentro del foreach?", "El despacho dinámico basado en el tipo real de cada objeto en tiempo de ejecución", ["El orden en que se declararon las clases", "El tipo declarado del array (Shape)", "Que Area se llame igual en ambas clases, sin relación con el tipo"], 3,
    "Area es abstract/override, por lo que la llamada se resuelve consultando el tipo concreto de cada objeto al ejecutarse, no el tipo de la variable del array."),
   sqr("¿Qué es el polimorfismo en tiempo de compilación, distinto al de esta jerarquía?", "La sobrecarga de métodos (mismo nombre, distinta firma, resuelta por el compilador)", ["El uso de virtual y override", "La conversión entre Shape y Circle con cast explícito", "El uso exclusivo de interfaces"], 0,
    "La sobrecarga se resuelve estáticamente según los tipos de los argumentos en tiempo de compilación, sin necesidad de despacho dinámico."),
   sqr("¿Qué pasaría si Circle no sobrescribiera Area(), siendo Shape abstracta con Area abstracto?", "Circle no compilaría, porque una clase no abstracta debe implementar todos los miembros abstractos heredados", ["Circle heredaría un Area() con cuerpo vacío por defecto", "Circle se convertiría automáticamente en abstracta", "El programa compilaría y Area() devolvería 0"], 1,
    "Un miembro abstract no tiene cuerpo; cualquier clase concreta derivada debe proporcionarlo o, si no, declararse ella misma abstract."),
   sqr("¿Qué significa que `shapes` sea de tipo `Shape[]` en vez de `object[]`?", "Que el compilador garantiza al menos la API de Shape para cada elemento, permitiendo llamar Area() sin cast", ["Que solo puede contener instancias de la clase Shape exacta", "Que todos los elementos deben tener el mismo tamaño en memoria", "Que el array no admite polimorfismo"], 2,
    "Tipar el array como Shape expresa el contrato común (Area()) sin exponer los miembros específicos de Circle o Square."),
   sqr("¿Qué ocurre si intentas hacer `Circle c = shapes[1];` sabiendo que shapes[1] es un Square?", "Error en tiempo de ejecución: InvalidCastException, porque Square no es un Circle", ["Compila y ejecuta sin problemas", "Error de compilación siempre, sin importar el índice", "Se convierte automáticamente creando un nuevo Circle"], 3,
    "Un cast explícito entre tipos hermanos de una jerarquía falla en runtime si el objeto real no es (ni deriva de) el tipo destino."),
   sqr("¿Cómo se llama a la técnica de usar pattern matching para tratar cada Shape según su tipo concreto dentro del foreach?", "Downcasting con verificación de tipo (type pattern matching)", ["Upcasting implícito", "Boxing", "Sobrecarga de operadores"], 0,
    "`s is Circle c` comprueba en runtime si el objeto es del tipo derivado y, de serlo, lo expone tipado como ese tipo.",
    `foreach (var s in shapes)
{
    if (s is Circle c)
        Console.WriteLine($"Círculo de radio {c.Radius}");
}`),
   sqr("¿Qué hace `s is Circle c` en el bucle anterior?", "Comprueba si s es realmente un Circle en tiempo de ejecución y, si es así, lo asigna a la variable c", ["Convierte cualquier Shape en Circle sin validar", "Compara referencias con ==", "Lanza una excepción si no es Circle"], 1,
    "Es un patrón de tipo (type pattern): evalúa el tipo real del objeto y, cuando coincide, declara la variable tipada sin necesidad de cast manual."),
   sqr("¿Cuál es la ventaja principal del polimorfismo en este ejemplo frente a un switch sobre un enum de tipos?", "Se puede agregar un nuevo tipo de Shape sin modificar el código que ya recorre e imprime áreas", ["Es siempre más rápido en tiempo de ejecución", "Elimina la necesidad de clases base", "Evita cualquier uso de memoria dinámica"], 2,
    "El foreach solo depende del contrato Shape.Area(); agregar Triangle, por ejemplo, no requiere tocar ese bucle."),
  ],
 },
 {
  id: "m11-abstract",
  title: "Abstract classes",
  summary: "Una clase abstract no puede instanciarse directamente y puede mezclar miembros abstractos (sin cuerpo, obligatorios para las derivadas concretas) con miembros concretos, campos y constructores. Las derivadas invocan su constructor con base(...); solo se permite una clase base directa, a diferencia de las interfaces.",
  code: `abstract class PaymentMethod
{
    protected PaymentMethod(string owner) => Owner = owner;
    public string Owner { get; }
    public abstract bool Charge(decimal amount);
    public void Log(decimal amount) => Console.WriteLine($"{Owner}: {amount}");
}
class CreditCard : PaymentMethod
{
    public CreditCard(string owner) : base(owner) { }
    public override bool Charge(decimal amount) => amount <= 5000;
}`,
  questions: [
   sqr("¿Se puede escribir `new PaymentMethod(\"Ada\")` directamente?", "No, una clase abstracta no puede instanciarse directamente", ["Sí, siempre que tenga constructor público", "Sí, pero solo dentro del mismo ensamblado", "Solo si no tiene miembros abstractos"], 2,
    "abstract prohíbe crear instancias del tipo, sin importar la accesibilidad de su constructor; solo sirve como base para otras clases."),
   sqr("¿Qué debe hacer CreditCard para poder instanciarse, dado que PaymentMethod es abstract?", "Implementar (override) todos los miembros abstractos heredados, como Charge", ["Nada especial, cualquier clase derivada es instanciable automáticamente", "Marcar la clase también como abstract", "Ocultar Charge con new"], 3,
    "Una clase concreta debe completar todo el contrato heredado; si dejara a Charge sin implementar, tendría que declararse abstract también."),
   sqr("¿Para qué sirve el constructor `protected PaymentMethod(string owner)` si la clase no puede instanciarse?", "Para que las clases derivadas lo invoquen con base(...) y así inicialicen el estado heredado", ["No tiene ningún uso, es código muerto", "Para instanciar PaymentMethod desde otro ensamblado", "Para convertirla en estática"], 0,
    "Las clases abstractas sí pueden (y suelen) tener constructores; se ejecutan como parte de la construcción de cualquier instancia derivada."),
   sqr("¿Qué demuestra que Log() se pueda llamar sin problema en una instancia de CreditCard, aunque PaymentMethod sea abstracta?", "Que los miembros concretos de una clase abstracta se heredan y ejecutan normalmente en las derivadas", ["Que Log también debe sobrescribirse obligatoriamente", "Que PaymentMethod deja de ser abstracta al usarse", "Que Log solo funciona si Charge devuelve true"], 1,
    "Una clase abstracta puede contener miembros totalmente implementados; solo los miembros marcados abstract exigen override en las derivadas."),
   sqr("¿Cuántas clases base directas puede tener CreditCard en C#?", "Una sola (herencia simple de clases)", ["Varias, si todas son abstractas", "Ilimitadas mientras sean abstract", "Ninguna, debe heredar solo de interfaces"], 2,
    "C# permite herencia simple entre clases (una sola clase base directa), aunque sí múltiples interfaces."),
   sqr("¿Qué diferencia clave tiene una clase abstracta frente a una interfaz respecto a los campos?", "Una clase abstracta puede declarar campos de instancia con estado; una interfaz no puede declarar campos de instancia", ["Ambas pueden declarar campos de instancia igual", "Solo las interfaces pueden tener campos", "Ninguna puede tener campos, solo propiedades"], 3,
    "Las interfaces solo pueden definir el contrato (miembros, con o sin implementación por defecto); no admiten campos de instancia."),
   sqr("¿Qué pasa si CreditCard no implementa Charge?", "Error de compilación: CreditCard debe ser abstract o implementar Charge", ["Charge se hereda con un cuerpo vacío que devuelve false", "El compilador la implementa automáticamente", "Compila pero lanza NotImplementedException en runtime"], 0,
    "El compilador exige que toda clase no abstracta complete los miembros abstractos que hereda; de lo contrario, no compila."),
   sqr("¿Puede una clase abstracta tener miembros con cuerpo (no abstractos), como Log en el ejemplo?", "Sí, puede mezclar miembros abstractos y miembros concretos con implementación", ["No, todos los miembros deben ser abstractos", "Solo si la clase también es sealed", "Solo los métodos static pueden tener cuerpo"], 1,
    "abstract class no significa 'todo sin implementar'; es habitual combinar comportamiento compartido concreto con puntos de extensión abstractos."),
   sqr("¿Qué modificador de acceso tiene sentido para un miembro que solo deben usar las clases derivadas, no código externo?", "protected", ["public", "private", "static"], 2,
    "protected expone el miembro a la propia clase y a sus derivadas, pero lo oculta de consumidores externos, a diferencia de public."),
   sqr("¿Qué trampa de entrevista es común sobre las clases abstractas?", "Que sí pueden tener constructores, campos y métodos con implementación, no solo miembros abstractos", ["Que una clase abstracta nunca puede tener constructores", "Que una clase abstracta es lo mismo que una interfaz", "Que una clase abstracta no puede heredarse más de una vez en el árbol de tipos"], 3,
    "Un error común es asumir que abstract implica que todo el tipo carece de implementación; en realidad solo los miembros marcados abstract la carecen."),
  ],
 },
 {
  id: "m11-interfaces",
  title: "Interfaces",
  summary: "Una interfaz define un contrato: por defecto sus miembros son públicos y sin campos de instancia. Desde C# 8, una interfaz puede incluir miembros con implementación por defecto (default interface members) y miembros estáticos; si la clase implementadora provee su propia implementación, esta tiene prioridad sobre la de la interfaz.",
  code: `interface INotifier
{
    void Send(string message);
    bool IsEnabled => true; // miembro con implementación por defecto (C# 8+)
}
class EmailNotifier : INotifier
{
    public void Send(string message) => Console.WriteLine($"Email: {message}");
}`,
  questions: [
   sqr("¿Qué imprime `new EmailNotifier().Send(\"Hola\")`?", "Email: Hola", ["Hola", "Error de compilación porque falta implementar IsEnabled", "Excepción NotImplementedException"], 3,
    "EmailNotifier implementa Send tal cual, y no está obligado a implementar IsEnabled porque este tiene una implementación por defecto en la interfaz."),
   sqr("¿Es obligatorio que EmailNotifier implemente IsEnabled?", "No, porque IsEnabled tiene una implementación por defecto en la interfaz (C# 8+)", ["Sí, todo miembro de una interfaz debe implementarse siempre", "No, porque IsEnabled es privado", "Solo si EmailNotifier es sealed"], 0,
    "Los default interface members son opcionales para la clase implementadora: si no los sobrescribe, usa la implementación de la interfaz."),
   sqr("¿Qué nivel de acceso tienen los miembros de una interfaz por defecto (sin modificador explícito)?", "public", ["private", "internal", "protected"], 1,
    "A diferencia de una clase, los miembros de una interfaz son públicos por defecto salvo que se especifique otro modificador (permitido desde C# 8)."),
   sqr("¿Puede una interfaz declarar campos de instancia (fields) con estado, como `private string _name;`?", "No, una interfaz no puede declarar campos de instancia", ["Sí, siempre que sean readonly", "Sí, cualquier campo es válido desde C# 8", "Solo si la interfaz también define un constructor"], 2,
    "Las interfaces definen contrato y, desde C# 8, comportamiento por defecto, pero nunca pueden almacenar estado de instancia en campos."),
   sqr("¿Cuántas interfaces puede implementar una misma clase en C#?", "Varias, no hay límite de una sola", ["Solo una, igual que con clases base", "Ninguna si ya hereda de una clase abstracta", "Máximo dos por diseño del lenguaje"], 3,
    "A diferencia de la herencia de clases, C# permite implementar cualquier cantidad de interfaces en la misma clase."),
   sqr("¿Qué ocurre si EmailNotifier declara `public bool IsEnabled => false;`?", "La implementación de la clase reemplaza (tiene prioridad sobre) la implementación por defecto de la interfaz", ["Error de compilación por redefinir un miembro de interfaz", "Se ignora y sigue devolviendo true", "Ambas implementaciones se ejecutan y el resultado es ambiguo"], 0,
    "Una implementación explícita en la clase siempre gana frente al default interface member; este último es solo un valor de respaldo."),
   sqr("¿Qué distingue declarar `void Send(string message);` en una interfaz de declararlo como `public abstract void Send(string message);` en una clase abstracta?", "Son similares como contrato, pero la interfaz no exige el modificador explícito y la clase puede implementar múltiples interfaces", ["Son exactamente idénticos en todo sentido", "La interfaz permite estado y la clase abstracta no", "Solo la clase abstracta puede definir un contrato"], 1,
    "Ambas expresan un contrato sin implementación, pero la interfaz habilita múltiple implementación simultánea, algo que la herencia de clases no permite."),
   sqr("¿Desde qué versión de C# las interfaces pueden tener miembros con implementación por defecto?", "C# 8.0", ["C# 4.0", "C# 6.0", "Todas las versiones desde C# 1.0"], 2,
    "Los default interface members se introdujeron en C# 8.0, junto con miembros estáticos y privados en interfaces."),
   sqr("¿Puede una interfaz definir miembros estáticos (static)?", "Sí, desde C# 8 las interfaces pueden tener miembros estáticos, incluidos métodos y constantes", ["No, nunca", "Solo campos estáticos, no métodos", "Solo si la interfaz es sealed"], 3,
    "C# 8 amplió las interfaces para admitir miembros static (métodos, propiedades y campos), además de miembros privados de apoyo."),
   sqr("¿Qué error de concepto es común al comparar interfaces con clases abstractas respecto a la instanciación directa?", "Ninguna de las dos puede instanciarse directamente con new", ["Las interfaces sí pueden instanciarse con new, las clases abstractas no", "Las clases abstractas no pueden implementarse por clases, solo heredarse", "Una interfaz puede tener un constructor público para instanciarse indirectamente"], 0,
    "Tanto las interfaces como las clases abstractas son tipos que no se instancian por sí mismos; ambas requieren una clase concreta que los implemente o herede."),
  ],
 },
 {
  id: "m11-multi-interface",
  title: "Implementar varios contratos",
  summary: "Una clase puede implementar varias interfaces a la vez, satisfaciendo distintos contratos con la misma instancia. Cuando dos interfaces declaran un miembro con igual firma, la implementación explícita de interfaz (Interfaz.Miembro) permite dar un comportamiento distinto por contrato, accesible solo a través de una referencia de ese tipo de interfaz.",
  code: `interface IReadable { string Read(); }
interface IWritable { void Write(string data); }
class FileResource : IReadable, IWritable
{
    private string _content = "";
    public string Read() => _content;
    public void Write(string data) => _content = data;
}`,
  questions: [
   sqr("¿Qué interfaces implementa FileResource?", "IReadable e IWritable, ambas a la vez", ["Solo IReadable", "Solo IWritable", "Ninguna, hereda de una clase base"], 1,
    "La declaración `class FileResource : IReadable, IWritable` implementa ambos contratos simultáneamente."),
   sqr("¿Qué permite tratar un mismo objeto FileResource como IReadable en un contexto y como IWritable en otro?", "Que una clase puede implementar varias interfaces y así satisfacer varios contratos simultáneamente", ["Que FileResource hereda de dos clases base", "Que C# realiza boxing automático entre interfaces", "Que las interfaces se combinan en una sola en tiempo de compilación"], 2,
    "Una misma instancia puede convertirse implícitamente a cualquiera de las interfaces que su clase implementa, según lo que necesite cada consumidor."),
   sqr("¿Qué produce `((IPrinter)new MultiFunction()).Print()`?", "Imprimiendo...", ["Enviando fax...", "Ambos mensajes", "Error de compilación por ambigüedad"], 3,
    "El cast a IPrinter selecciona la implementación explícita de esa interfaz; IFax.Print() no se invoca en este caso.",
    `interface IPrinter { void Print(); }
interface IFax { void Print(); }
class MultiFunction : IPrinter, IFax
{
    void IPrinter.Print() => Console.WriteLine("Imprimiendo...");
    void IFax.Print() => Console.WriteLine("Enviando fax...");
}`),
   sqr("¿Por qué es necesaria la implementación explícita (`void IPrinter.Print()`) en MultiFunction?", "Porque IPrinter e IFax declaran un miembro con la misma firma (Print) y hay que distinguir cuál implementación corresponde a cada contrato", ["Porque Print es un método reservado del lenguaje", "Porque las interfaces no permiten métodos void", "Porque MultiFunction es una clase sealed"], 0,
    "La implementación explícita resuelve el choque de nombres entre interfaces distintas que comparten firma, dando un cuerpo distinto a cada una."),
   sqr("¿Se puede llamar `new MultiFunction().Print()` directamente, sin cast, si Print se implementó de forma explícita en ambas interfaces?", "No, un miembro implementado explícitamente solo es accesible a través de una referencia del tipo de la interfaz correspondiente", ["Sí, siempre es accesible desde la instancia concreta", "Sí, pero solo devuelve el resultado de IPrinter", "No, nunca es accesible ni siquiera con cast"], 1,
    "La implementación explícita no forma parte de la superficie pública de la clase; solo se expone al convertir la instancia al tipo de interfaz."),
   sqr("¿Qué principio SOLID se relaciona con dividir un contrato grande en varias interfaces pequeñas como IReadable e IWritable?", "El principio de segregación de interfaces (ISP)", ["El principio de responsabilidad única (SRP) exclusivamente", "El principio abierto/cerrado (OCP)", "El principio de sustitución de Liskov (LSP)"], 2,
    "ISP promueve interfaces pequeñas y específicas en vez de una única interfaz grande que obligue a implementar miembros innecesarios."),
   sqr("¿Qué ventaja tiene declarar un parámetro como `IReadable source` en lugar de `FileResource source`?", "El método acepta cualquier tipo que implemente IReadable, no solo FileResource, reduciendo el acoplamiento", ["Es exactamente igual de restrictivo que usar FileResource", "Obliga a que el objeto también implemente IWritable", "Hace que el parámetro sea opcional automáticamente"], 3,
    "Programar contra la interfaz en vez de la clase concreta permite reutilizar el método con cualquier implementación futura de IReadable."),
   sqr("¿Qué ocurre si FileResource implementa IReadable pero olvida implementar Read()?", "Error de compilación: la clase no satisface el contrato de IReadable", ["Read() se genera automáticamente devolviendo null", "Compila y falla solo si se llama Read() en runtime", "FileResource se convierte en abstracta automáticamente"], 0,
    "El compilador exige que toda clase que declare implementar una interfaz provea todos sus miembros no opcionales."),
   sqr("¿Puede una interfaz extender (heredar de) otra interfaz, por ejemplo `interface IReadWrite : IReadable, IWritable { }`?", "Sí, una interfaz puede extender una o varias interfaces", ["No, las interfaces no pueden relacionarse entre sí", "Solo si ambas interfaces están en el mismo archivo", "Solo puede extender una interfaz, nunca varias"], 1,
    "Una interfaz puede declarar una o más interfaces base, combinando sus contratos en uno más amplio."),
   sqr("¿Qué trampa de entrevista existe sobre implementar dos interfaces con miembros de igual nombre y firma SIN usar implementación explícita?", "Una sola implementación pública en la clase puede satisfacer ambas interfaces si la firma coincide; la explícita solo es obligatoria si necesitas comportamientos distintos por interfaz", ["Es imposible compilar una clase así bajo cualquier circunstancia", "C# elige aleatoriamente cuál interfaz se satisface", "Siempre se requiere implementación explícita en ese caso"], 2,
    "Muchos asumen que dos interfaces con miembros iguales siempre chocan; en realidad basta una implementación pública compartida salvo que se quiera diferenciar el comportamiento."),
  ],
 },
 {
  id: "m11-dip",
  title: "Dependency Inversion",
  summary: "El principio de inversión de dependencias (DIP, la 'D' de SOLID) establece que los módulos de alto nivel no deben depender de módulos de bajo nivel, sino que ambos deben depender de abstracciones. Es un principio de diseño, distinto de la inyección de dependencias (DI), que es la técnica (por ejemplo, por constructor) usada para proveer esas abstracciones concretas en tiempo de ejecución.",
  code: `interface IEmailSender { void Send(string to, string body); }
class SmtpEmailSender : IEmailSender
{
    public void Send(string to, string body) => Console.WriteLine($"SMTP -> {to}: {body}");
}
class OrderService
{
    private readonly IEmailSender _sender;
    public OrderService(IEmailSender sender) => _sender = sender;
    public void Confirm(string email) => _sender.Send(email, "Pedido confirmado");
}`,
  questions: [
   sqr("¿De qué depende directamente OrderService, según su constructor?", "De la abstracción IEmailSender, no de una implementación concreta", ["De SmtpEmailSender directamente", "De ninguna dependencia externa", "De Console.WriteLine directamente"], 1,
    "El constructor recibe un IEmailSender; OrderService nunca menciona SmtpEmailSender en su código."),
   sqr("¿Qué principio se aplica al hacer que OrderService dependa de IEmailSender en lugar de instanciar `new SmtpEmailSender()` internamente?", "El principio de inversión de dependencias (DIP)", ["El principio de sustitución de Liskov (LSP)", "El principio abierto/cerrado (OCP) exclusivamente", "El patrón Singleton"], 2,
    "Depender de una abstracción en vez de una clase concreta es exactamente la idea central de DIP."),
   sqr("¿Qué significa 'los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones'?", "Que tanto OrderService (alto nivel) como SmtpEmailSender (bajo nivel) dependen de la interfaz IEmailSender, no uno del otro directamente", ["Que OrderService debe reimplementar el envío de correos internamente", "Que SmtpEmailSender debe depender de OrderService", "Que las abstracciones deben depender de los detalles concretos"], 3,
    "La abstracción (IEmailSender) queda en el centro; tanto el consumidor de alto nivel como la implementación de bajo nivel dependen de ella, no entre sí."),
   sqr("¿Cuál es la diferencia entre Dependency Inversion Principle (DIP) y Dependency Injection (DI)?", "DIP es un principio de diseño (depender de abstracciones); DI es una técnica para proveer esas dependencias desde afuera, por ejemplo por constructor", ["Son exactamente sinónimos intercambiables", "DI es el principio y DIP es la técnica, al revés de lo habitual", "DIP solo aplica a interfaces y DI solo a clases abstractas"], 0,
    "DIP describe qué debe depender de qué (abstracciones); DI es una forma concreta de suministrar esas dependencias en tiempo de ejecución."),
   sqr("¿Cómo se llama la técnica usada en `public OrderService(IEmailSender sender)` para proveer la dependencia?", "Inyección de dependencias por constructor (constructor injection)", ["Inyección por reflexión obligatoria", "Localización de servicio (Service Locator) exclusivamente", "Herencia de dependencias"], 1,
    "Recibir la dependencia como parámetro del constructor es la forma más común de inyección de dependencias."),
   sqr("¿Qué permite agregar una nueva implementación, por ejemplo SendGridEmailSender, sin modificar OrderService?", "Que OrderService depende de la interfaz IEmailSender y no de una clase concreta", ["Que OrderService usa reflection para descubrir clases automáticamente", "Que C# permite herencia múltiple de clases", "Que SmtpEmailSender es sealed"], 2,
    "Al depender solo del contrato IEmailSender, cualquier nueva implementación puede inyectarse sin tocar el código de OrderService."),
   sqr("¿Qué problema tendría OrderService si en vez de recibir IEmailSender por constructor hiciera `new SmtpEmailSender()` dentro de Confirm?", "Quedaría fuertemente acoplado a una implementación concreta, dificultando pruebas unitarias y cambiar el proveedor de correo", ["No tendría ningún problema, sería equivalente", "Dejaría de compilar", "Se volvería automáticamente thread-safe"], 3,
    "Instanciar la dependencia concreta dentro de la clase viola DIP y hace imposible sustituirla por un mock en pruebas sin recompilar."),
   sqr("¿Qué facilita DIP para escribir pruebas unitarias de OrderService?", "Permite pasar una implementación falsa (mock/stub) de IEmailSender en lugar de enviar correos reales", ["Elimina la necesidad de pruebas unitarias", "Obliga a usar una base de datos real en las pruebas", "Hace que Confirm sea un método estático"], 0,
    "Al depender de la abstracción, un test puede inyectar un IEmailSender de prueba que solo registra llamadas, sin infraestructura real."),
   sqr("¿Qué NO es correcto decir sobre DIP?", "Que exige usar un contenedor de inyección de dependencias (IoC container) obligatoriamente", ["Que promueve depender de abstracciones en vez de implementaciones concretas", "Que ayuda a desacoplar módulos de alto y bajo nivel", "Que puede aplicarse sin ningún framework, solo con interfaces y constructores"], 1,
    "DIP es un principio de diseño independiente de herramientas; puede aplicarse solo con interfaces y constructor injection manual, sin ningún contenedor."),
   sqr("¿Qué relación tiene DIP con las otras cuatro letras de SOLID?", "Es la 'D' de SOLID (Dependency Inversion Principle), complementando SRP, OCP, LSP e ISP", ["No forma parte de SOLID, es un principio aparte", "Es un sinónimo exacto de OCP", "Reemplaza a las otras cuatro letras en versiones modernas de C#"], 2,
    "SOLID agrupa cinco principios: SRP, OCP, LSP, ISP y DIP; este último es el que trata sobre depender de abstracciones."),
  ],
 },
 {
  id: "m11-solid",
  title: "SOLID aplicado",
  summary: "SOLID agrupa cinco principios de diseño orientado a objetos: responsabilidad única (SRP), abierto/cerrado (OCP), sustitución de Liskov (LSP), segregación de interfaces (ISP) e inversión de dependencias (DIP). Aplicarlos en conjunto sobre un diseño concreto ayuda a detectar acoplamiento innecesario y contratos mal diseñados antes de que se conviertan en bugs.",
  code: `interface IDiscountStrategy { decimal Apply(decimal total); }
class NoDiscount : IDiscountStrategy { public decimal Apply(decimal total) => total; }
class TenPercentDiscount : IDiscountStrategy { public decimal Apply(decimal total) => total * 0.9m; }
class Checkout
{
    private readonly IDiscountStrategy _discount;
    public Checkout(IDiscountStrategy discount) => _discount = discount;
    public decimal Total(decimal subtotal) => _discount.Apply(subtotal);
}`,
  questions: [
   sqr("¿Qué principio SOLID se refuerza al usar IDiscountStrategy en vez de un `switch(tipoDescuento)` dentro de Checkout?", "El principio abierto/cerrado (OCP): se puede agregar un nuevo descuento sin modificar Checkout", ["El principio de responsabilidad única exclusivamente", "El principio de sustitución de Liskov", "El patrón Singleton"], 2,
    "OCP busca que el código esté abierto a extensión (nuevas estrategias) pero cerrado a modificación (Checkout no cambia)."),
   sqr("¿Qué imprime `new Checkout(new TenPercentDiscount()).Total(200)`?", "180", ["200", "20", "Error de compilación"], 3,
    "TenPercentDiscount.Apply multiplica por 0.9m: 200 * 0.9 = 180."),
   sqr("¿Qué principio se viola si Square, al fijar Width, también cambia Height (rompiendo la expectativa de que Rectangle permite ancho y alto independientes)?", "El principio de sustitución de Liskov (LSP): Square no puede sustituir a Rectangle sin cambiar el comportamiento esperado", ["El principio de responsabilidad única (SRP)", "El principio de segregación de interfaces (ISP)", "El principio de inversión de dependencias (DIP)"], 0,
    "LSP exige que una subclase pueda usarse donde se espera la clase base sin alterar el comportamiento correcto del programa; Square rompe esa expectativa.",
    `class Rectangle
{
    public virtual int Width { get; set; }
    public virtual int Height { get; set; }
    public int Area() => Width * Height;
}
class Square : Rectangle
{
    public override int Width { set { base.Width = value; base.Height = value; } get => base.Width; }
    public override int Height { set { base.Width = value; base.Height = value; } get => base.Height; }
}`),
   sqr("¿Qué principio se viola si una clase ReportGenerator genera el reporte, lo formatea en PDF y además lo envía por correo, todo en la misma clase?", "El principio de responsabilidad única (SRP): la clase tiene más de una razón para cambiar", ["El principio abierto/cerrado (OCP)", "El principio de sustitución de Liskov (LSP)", "El principio de segregación de interfaces (ISP)"], 1,
    "SRP indica que una clase debería tener una sola responsabilidad (y por tanto una sola razón para cambiar); mezclar generación, formato y envío viola esto."),
   sqr("¿Qué principio se viola si una interfaz IWorker obliga a implementar Eat() y Work(), pero RobotWorker no puede comer de forma significativa y debe lanzar NotImplementedException en Eat()?", "El principio de segregación de interfaces (ISP): la interfaz es demasiado amplia para todos sus implementadores", ["El principio de inversión de dependencias (DIP)", "El principio de responsabilidad única (SRP)", "El principio abierto/cerrado (OCP)"], 2,
    "ISP recomienda dividir interfaces grandes en contratos más pequeños y específicos, para que ningún implementador se vea obligado a soportar miembros que no le aplican."),
   sqr("¿Qué principio describe mejor 'depender de IDiscountStrategy en lugar de clases concretas como TenPercentDiscount dentro de Checkout'?", "El principio de inversión de dependencias (DIP)", ["El principio de sustitución de Liskov (LSP)", "El principio de responsabilidad única (SRP)", "El principio de segregación de interfaces (ISP)"], 3,
    "Depender de la abstracción IDiscountStrategy en vez de una implementación concreta es la aplicación directa de DIP."),
   sqr("¿Qué letra de SOLID corresponde al principio abierto/cerrado?", "O (Open/Closed Principle)", ["S", "L", "I"], 0,
    "SOLID: S=SRP, O=OCP, L=LSP, I=ISP, D=DIP; la 'O' corresponde al principio abierto/cerrado."),
   sqr("¿Qué significa que una clase esté 'abierta a extensión pero cerrada a modificación' (OCP)?", "Se puede agregar nuevo comportamiento (por ejemplo una nueva IDiscountStrategy) sin editar el código ya probado de Checkout", ["Que la clase debe marcarse como sealed siempre", "Que la clase no puede tener subclases", "Que no se pueden agregar nuevos métodos jamás"], 1,
    "OCP no prohíbe extender el sistema; prohíbe tener que modificar código existente y ya probado para agregar comportamiento nuevo."),
   sqr("¿Qué requiere modificar en Checkout agregar una nueva clase BlackFridayDiscount : IDiscountStrategy?", "Nada: Checkout sigue funcionando sin cambios porque depende de la abstracción IDiscountStrategy", ["Modificar el switch interno de Checkout", "Agregar un nuevo constructor a Checkout para cada estrategia", "Recompilar Checkout con una nueva versión del método Total"], 2,
    "Como Checkout solo conoce la interfaz IDiscountStrategy, cualquier nueva implementación se puede inyectar sin tocar su código."),
   sqr("¿Qué combinación de principios se aplica al diseño completo del ejemplo de Checkout con IDiscountStrategy?", "OCP (extensible sin modificar) y DIP (Checkout depende de la abstracción, no de una clase concreta)", ["Solo SRP, ningún otro principio aplica", "Solo LSP, porque hay herencia de interfaces", "Ninguno, es simplemente composición sin relación con SOLID"], 3,
    "El diseño combina al menos dos principios: se puede extender sin modificar (OCP) y la dependencia apunta a una abstracción, no a un detalle concreto (DIP)."),
  ],
 },
 {
  id: "m11-challenge",
  title: "Reto de diseño OO",
  summary: "Reto del módulo 11: combina clase abstracta (contrato común con estado compartido), interfaz (colaborador intercambiable) e inversión de dependencias en un solo diseño, e identifica qué principio protege cada decisión de diseño frente a errores comunes de acoplamiento.",
  code: `interface INotificationChannel { void Notify(string message); }
abstract class Employee
{
    public string Name { get; }
    protected Employee(string name) => Name = name;
    public abstract decimal MonthlySalary();
}
class Manager : Employee
{
    private readonly decimal _base;
    private readonly decimal _bonus;
    public Manager(string name, decimal @base, decimal bonus) : base(name) { _base = @base; _bonus = bonus; }
    public override decimal MonthlySalary() => _base + _bonus;
}
class PayrollService
{
    private readonly INotificationChannel _channel;
    public PayrollService(INotificationChannel channel) => _channel = channel;
    public void Pay(Employee e) => _channel.Notify($"{e.Name}: {e.MonthlySalary()}");
}`,
  questions: [
   sqr("¿Por qué Employee es abstract en lugar de una clase concreta?", "Porque no tiene sentido crear un Employee genérico sin un tipo concreto que defina cómo calcular su salario (MonthlySalary es abstracto)", ["Porque todas las clases base deben ser abstractas por convención", "Porque Employee no tiene propiedades", "Porque C# no permite instanciar clases con constructores protegidos"], 0,
    "MonthlySalary() no tiene una implementación con sentido general; cada tipo concreto de empleado debe definir cómo calcularlo."),
   sqr("¿Por qué PayrollService depende de INotificationChannel en vez de una clase concreta como EmailChannel?", "Para aplicar el principio de inversión de dependencias (DIP) y poder cambiar el canal de notificación sin modificar PayrollService", ["Porque una clase concreta no puede inyectarse por constructor", "Porque INotificationChannel es más rápida en tiempo de ejecución", "Porque PayrollService no necesita notificar realmente"], 1,
    "Depender de la interfaz permite sustituir el canal (email, SMS, etc.) sin tocar el código de PayrollService."),
   sqr("¿Qué debe hacer una nueva clase Intern : Employee para poder instanciarse?", "Implementar (override) MonthlySalary(), el único miembro abstracto de Employee", ["Implementar INotificationChannel también", "Nada, hereda todo automáticamente de Manager", "Marcarse como sealed"], 2,
    "Employee solo declara MonthlySalary() como abstracto; cualquier derivada concreta debe proveerlo para poder instanciarse."),
   sqr("¿Qué calcula MonthlySalary() para `new Manager(\"Ada\", 3000, 500)`?", "3000 + 500 = 3500", ["Solo 3000, ignorando el bono", "Solo 500, el bono únicamente", "Lanza una excepción porque Manager es abstracta"], 3,
    "El override de Manager suma _base + _bonus, es decir 3000 + 500 = 3500; Manager no es abstracta, implementa el contrato completo."),
   sqr("¿Qué principio se estaría violando si PayrollService, en lugar de recibir INotificationChannel, hiciera `new EmailChannel()` dentro de Pay?", "El principio de inversión de dependencias (DIP), al acoplarse directamente a una implementación concreta", ["El principio de sustitución de Liskov (LSP)", "El principio de responsabilidad única (SRP) únicamente", "Ningún principio, es una práctica igual de válida"], 0,
    "Instanciar la dependencia concreta dentro del método rompe la inversión de dependencias y acopla PayrollService a un canal específico."),
   sqr("¿Qué permite que `Pay(Employee e)` acepte tanto un Manager como un futuro Intern sin cambiar su firma?", "El polimorfismo: Employee es la abstracción común y Pay solo depende de su contrato (MonthlySalary, Name)", ["Que Employee tiene un constructor público", "Que Manager e Intern implementan la misma interfaz de notificación", "Que Pay usa reflection para inspeccionar el tipo real"], 1,
    "Pay solo necesita lo que Employee garantiza (Name y MonthlySalary()); cualquier subtipo concreto satisface ese contrato."),
   sqr("¿Qué pasaría si Manager NO llamara a `base(name)` en su constructor?", "Error de compilación, porque Employee no tiene un constructor sin parámetros y Manager debe invocar explícitamente uno de sus constructores base", ["Name quedaría null silenciosamente", "El programa compilaría usando un constructor implícito de Employee", "Manager se convertiría automáticamente en abstracta"], 2,
    "Como el único constructor de Employee exige un string, cualquier derivada debe invocarlo explícitamente con base(...); si no, no compila."),
   sqr("¿Qué ventaja de diseño ofrece separar INotificationChannel de la lógica de cálculo de salario en Employee?", "Cada clase tiene una responsabilidad clara (SRP): Employee calcula el salario, el canal decide cómo notificar", ["Ninguna, es exactamente el mismo código con más archivos", "Hace que el salario se calcule más rápido", "Evita que Employee tenga propiedades públicas"], 3,
    "Separar 'qué calcular' de 'cómo notificar' evita mezclar dos razones de cambio distintas en una sola clase (SRP)."),
   sqr("¿Qué modificador debería tener el constructor de Employee para que solo las clases derivadas puedan invocarlo, no código externo?", "protected", ["public", "private", "internal"], 0,
    "protected permite que Employee y sus derivadas usen el constructor, sin exponerlo a código externo que intente instanciar Employee de forma indirecta."),
   sqr("¿Qué combinación de conceptos del módulo integra mejor este diseño completo?", "Clase abstracta para el contrato común (Employee), interfaz para un colaborador intercambiable (INotificationChannel) y DIP para desacoplar PayrollService de una implementación concreta", ["Solo herencia múltiple de clases, sin interfaces", "Solo el uso de miembros static en todas las clases", "Un único enum que reemplaza toda la jerarquía de tipos"], 1,
    "El diseño combina jerarquía con clase abstracta, contrato intercambiable con interfaz, e inversión de dependencias entre el servicio y el canal de notificación."),
  ],
 },
 {
  id: "m12-delegates",
  title: "Delegates y Action/Func",
  summary: "Un delegate es una referencia tipada a uno o más métodos con una firma compatible. Action<T...> representa métodos que no devuelven valor; Func<T...,TResult> representa métodos que devuelven un valor, siendo el último parámetro de tipo siempre el resultado. Un delegate puede combinar varios métodos con `+=` (multicast): todos se ejecutan en orden, pero si hay valor de retorno, solo se obtiene el del último invocado.",
  code: `Action<string> greet = name => Console.WriteLine($"Hola, {name}");
Func<int, int, int> add = (a, b) => a + b;
greet("Ada");
Console.WriteLine(add(2, 3));`,
  questions: [
   sqr("¿Qué imprime este código?", "Hola, Ada (primera línea) y 5 (segunda línea)", ["Hola, Ada y 2 (segunda línea)", "5 solamente, sin el saludo", "Error de compilación porque Action no puede recibir string"], 0,
    "greet(\"Ada\") ejecuta la lambda de Action<string> e imprime el saludo; add(2,3) devuelve 5 mediante Func<int,int,int>, que Console.WriteLine imprime después."),
   sqr("¿Cuántos parámetros de tipo acepta `Func<T1,T2,TResult>` y cuál representa el valor de retorno?", "Tres parámetros de tipo; el último (TResult) es siempre el tipo de retorno", ["Dos parámetros de tipo; el primero es el retorno", "Tres parámetros; ninguno es el retorno, Func nunca devuelve valor", "Uno solo, los demás son opcionales"], 1,
    "En todas las variantes de Func<...>, el último parámetro de tipo genérico es siempre TResult, el tipo devuelto por el delegate."),
   sqr("¿Qué tipo de delegate usarías para un método que no devuelve ningún valor y recibe un int?", "Action<int>", ["Func<int>", "Func<int, void>", "Predicate<int>"], 2,
    "Action<T> representa métodos void; Func<int> en cambio representaría un método sin parámetros que devuelve int, y `Func<int, void>` no es válido en C#."),
   sqr("¿Qué imprime `combo(2)` en este código?", "4", ["6", "10", "Error de compilación por combinar dos Func"], 3,
    "Al invocar un delegate multicast con valor de retorno, se ejecutan todos los métodos en orden pero solo se devuelve el resultado del último: square(2) = 4.",
    `Func<int, int> triple = x => x * 3;
Func<int, int> square = x => x * x;
Func<int, int> combo = triple;
combo += square;
Console.WriteLine(combo(2));`),
   sqr("¿Qué ocurre con TODOS los métodos combinados en un delegate multicast (`+=`) cuando se invoca, aunque solo se observe un valor de retorno?", "Se ejecutan todos en el orden en que se agregaron, pero el valor devuelto por la invocación es solo el del último", ["Solo se ejecuta el último método agregado", "Se ejecutan todos y el resultado es la suma de sus retornos", "Se ejecuta solo el primero, los demás se ignoran"], 0,
    "Un delegate multicast invoca su lista de destinatarios en orden; cada uno se ejecuta, pero la llamada solo expone el valor de retorno del último."),
   sqr("¿Qué delegate genérico predefinido de .NET representa un método que recibe un valor y devuelve bool, típico para filtrar?", "Predicate<T> (o también Func<T, bool>)", ["Action<T>", "Comparison<T>", "Func<T>"], 1,
    "Predicate<T> está pensado exactamente para esa firma; Func<T,bool> es equivalente y de hecho es lo que usan internamente métodos como Where."),
   sqr("¿Cuál es el máximo número de parámetros de entrada que admite `Func<...>` en .NET?", "16 parámetros de entrada más el tipo de retorno (Func<T1..T16, TResult>)", ["No tiene límite, es infinito", "4 parámetros como máximo", "Solo 1 parámetro de entrada"], 2,
    "El framework define sobrecargas de Func hasta 16 parámetros de entrada, además del tipo de retorno."),
   sqr("¿Qué firma tiene un delegate compatible con `void Log(string message)`?", "Action<string>", ["Func<string>", "Action<string, void>", "Func<string, void>"], 3,
    "Log no devuelve valor y recibe un string, por lo que su firma coincide exactamente con Action<string>."),
   sqr("¿Qué imprime este código tras combinar dos lambdas con `+=` sobre un Action?", "AB", ["BA", "A", "Error porque saySomething inicia en null"], 0,
    "Cada `+=` agrega un destinatario al multicast delegate; al invocarse, se ejecutan en el orden en que se agregaron: primero A, luego B.",
    `Action saySomething = null;
saySomething += () => Console.Write("A");
saySomething += () => Console.Write("B");
saySomething();`),
   sqr("¿Por qué se puede inicializar `Action saySomething = null;` y luego usar `+=` sin excepción?", "Porque `+=` sobre un delegate null equivale a asignar un delegate nuevo que contiene solo ese método (no lanza excepción)", ["Porque Action nunca puede ser null en C#", "Porque el compilador ignora el null automáticamente sin ningún efecto", "Porque se necesita usar `??=` en vez de `+=` para que funcione"], 1,
    "Delegate.Combine trata null como 'ningún destinatario'; combinarlo con un método produce un delegate válido con ese único destinatario."),
  ],
 },
 {
  id: "m12-lambdas",
  title: "Lambdas",
  summary: "Una expresión lambda define una función anónima con `=>`, con cuerpo de expresión o de bloque. Una lambda captura variables externas por referencia a la variable (closure), no por su valor en el momento de la creación: si la variable cambia antes de invocar la lambda, esta ve el valor actualizado. El `for` clásico usa una única variable de control compartida entre iteraciones; el `foreach` (desde C# 5) crea una variable nueva por iteración.",
  code: `int factor = 2;
Func<int, int> multiply = x => x * factor;
factor = 10;
Console.WriteLine(multiply(5));`,
  questions: [
   sqr("¿Qué imprime este código?", "50", ["10", "2", "Error de compilación porque factor cambió"], 1,
    "La lambda captura la variable factor, no su valor en el momento de la creación; cuando se invoca multiply(5), factor ya vale 10, así que 5 * 10 = 50."),
   sqr("¿Qué significa que una lambda 'capture' una variable externa como `factor`?", "Que la lambda mantiene una referencia a esa variable, no una copia de su valor al momento de crearse", ["Que la variable se copia por valor en el instante en que se define la lambda", "Que la variable se vuelve readonly automáticamente", "Que la lambda no puede modificar ni leer factor"], 0,
    "Los closures en C# capturan la variable en sí (su almacenamiento), por lo que reflejan cualquier cambio posterior hasta el momento en que la lambda se ejecuta."),
   sqr("¿Qué imprime este código, dado que `local` se declara dentro del cuerpo del for en cada iteración?", "012", ["222", "000", "Error de compilación"], 2,
    "int local = i; crea una variable nueva en cada iteración del for, así que cada lambda captura su propia copia con el valor de esa vuelta (0, 1 y 2).",
    `var actions = new List<Action>();
for (int i = 0; i < 3; i++)
{
    int local = i;
    actions.Add(() => Console.Write(local));
}
foreach (var a in actions) a();`),
   sqr("¿Qué imprime este código, donde las lambdas capturan directamente la variable `i` del encabezado del for?", "333", ["012", "222", "021"], 3,
    "A diferencia de foreach, la variable `i` de un for clásico es una sola, compartida por todas las iteraciones; cuando el loop termina, i vale 3, y las tres lambdas ven ese mismo valor final.",
    `var actions = new List<Action>();
for (int i = 0; i < 3; i++)
{
    actions.Add(() => Console.Write(i));
}
foreach (var a in actions) a();`),
   sqr("¿Qué evita el problema de captura compartida en el ejemplo con `int local = i;` dentro del cuerpo del for?", "Declarar una variable nueva en cada iteración, capturada de forma independiente por cada lambda", ["Que local es readonly", "Que el compilador optimiza automáticamente los for-loops", "Que Console.Write es thread-safe"], 0,
    "Al declarar local dentro del cuerpo, cada vuelta del ciclo crea una variable distinta; cada lambda cierra sobre 'su' variable en vez de compartir una sola."),
   sqr("¿Qué diferencia de scope existe entre la variable de un `foreach` y la de un `for` clásico respecto a closures, desde C# 5 en adelante?", "foreach declara una variable nueva por cada iteración; la variable del for (declarada en su encabezado) es una sola compartida por todas las iteraciones", ["Ambas se comportan exactamente igual desde C# 5", "for declara una variable nueva por iteración y foreach comparte una sola", "Ninguna de las dos permite closures"], 1,
    "Desde C# 5, foreach corrigió su comportamiento para dar una variable fresca por iteración; el for clásico nunca cambió y sigue compartiendo una única variable de control."),
   sqr("¿Cuál es la forma de escribir una lambda con cuerpo de bloque (varias instrucciones) en vez de una sola expresión?", "x => { instrucción1; return resultado; }", ["x -> { return resultado; }", "lambda x { return resultado; }", "function(x) { return resultado; }"], 2,
    "El cuerpo de bloque usa llaves y, si el delegate devuelve valor, requiere un return explícito dentro de ese bloque."),
   sqr("¿Qué tipo puede inferir el compilador para `x` en `Func<int,int> f = x => x + 1;` sin anotarlo explícitamente?", "int, porque el compilador lo infiere del tipo del delegate Func<int,int>", ["object siempre, sin importar el delegate", "dynamic siempre", "El compilador nunca puede inferirlo, hay que escribir (int x)"], 3,
    "El tipo del delegate destino determina los tipos de los parámetros de la lambda, permitiendo omitir anotaciones explícitas."),
   sqr("¿Qué convierte una lambda en un `Expression<Func<T,TResult>>` en lugar de un delegate compilado normal?", "Que se asigna a una variable o parámetro de tipo Expression<...>, lo que hace que el compilador genere un árbol de expresión en vez de código ejecutable directo", ["Que la lambda use la palabra clave expression", "Que la lambda tenga más de un parámetro", "Que la lambda use cuerpo de bloque en vez de expresión"], 0,
    "El tipo de destino decide la representación: Expression<...> produce un árbol de expresión analizable (usado por ejemplo por Entity Framework); Func<...> produce IL ejecutable directamente."),
   sqr("¿Qué trampa de entrevista clásica se relaciona con capturar la variable de un `for` sin copiarla a una variable local dentro del cuerpo?", "Todas las lambdas terminan compartiendo la misma variable capturada y ven su valor final tras terminar el loop, no el valor de 'su' iteración", ["Cada lambda automáticamente copia el valor en el momento de su creación", "El programa no compila si se captura una variable del for", "Solo la primera lambda ve el valor correcto"], 1,
    "Es un error común asumir que cada lambda captura el valor de esa iteración; en un for clásico todas comparten la misma variable, por lo que ven el valor final del loop."),
  ],
 },
 {
  id: "m12-where-select",
  title: "Where y Select",
  summary: "Where filtra una secuencia según un predicado (Func<T,bool>); Select proyecta o transforma cada elemento (Func<T,TResult>), pudiendo cambiar el tipo resultante. Ambos operadores son de ejecución diferida y streaming: no se ejecutan hasta enumerarse, y procesan un elemento a la vez sin necesitar leer toda la secuencia de antemano.",
  code: `var numbers = new List<int> { 1, 2, 3, 4, 5, 6 };
var result = numbers.Where(n => n % 2 == 0).Select(n => n * n);
foreach (var r in result) Console.Write(r + " ");`,
  questions: [
   sqr("¿Qué imprime este código?", "4 16 36", ["1 4 9 16 25 36", "2 4 6", "0 4 16"], 1,
    "Where deja solo los pares (2, 4, 6) y Select los eleva al cuadrado: 4, 16, 36."),
   sqr("¿Qué tipo de delegate recibe Where como argumento?", "Func<T, bool> (un predicado)", ["Action<T>", "Func<T, T>", "Predicate<T> únicamente, no acepta Func"], 0,
    "Where evalúa una condición por cada elemento y decide si lo incluye; esa firma corresponde a Func<T,bool>."),
   sqr("¿Qué hace Select respecto al tipo de los elementos?", "Puede transformar cada elemento a un tipo distinto (proyección), no solo filtrar", ["Solo puede devolver el mismo tipo de entrada", "Elimina elementos que no cumplen una condición", "Ordena los elementos según una clave"], 0,
    "Select proyecta cada elemento de entrada a un resultado, que puede ser de un tipo completamente distinto (por ejemplo, int a string)."),
   sqr("¿En qué momento se ejecutan realmente el filtrado y la proyección de `numbers.Where(...).Select(...)`?", "Al enumerarse en el foreach (ejecución diferida/streaming), no en la línea donde se declara la consulta", ["Inmediatamente al llamar a Where", "Inmediatamente al llamar a Select", "Al compilar el programa"], 1,
    "Where y Select son operadores de ejecución diferida: la consulta solo se define al declararla y se ejecuta elemento por elemento cuando algo la enumera."),
   sqr("¿Qué ocurre si `numbers` cambia (se agrega un elemento) DESPUÉS de declarar `result` pero ANTES del foreach?", "El foreach reflejará el cambio, porque la consulta se evalúa en el momento de enumerarse, no cuando se declaró", ["No hay ningún efecto, result ya se calculó con los valores originales", "Se produce una excepción InvalidOperationException siempre", "result se congela automáticamente al declararse"], 2,
    "Por ser diferida, la consulta lee el estado actual de numbers en el momento del foreach, incluyendo cualquier elemento agregado antes de esa enumeración."),
   sqr("¿Qué sobrecarga de Select permite acceder también al índice de cada elemento?", "Select((elemento, indice) => ...)", ["Select solo acepta un parámetro, nunca el índice", "SelectIndexed(...)", "Select(indice => ...)"], 3,
    "Existe una sobrecarga de Select cuyo delegate recibe el elemento y su índice de posición dentro de la secuencia."),
   sqr("¿Qué imprime `numbers.Where(n => n > 10).Select(n => n * n).Count()`?", "0", ["6", "Error de compilación", "Excepción porque no hay elementos"], 0,
    "Ningún elemento de numbers es mayor a 10, así que Where produce una secuencia vacía, y Count() sobre una secuencia vacía es 0, sin lanzar excepción."),
   sqr("¿Cómo se llama la forma de escribir `numbers.Where(n => n % 2 == 0)` frente a `from n in numbers where n % 2 == 0 select n`?", "Sintaxis de método (fluent/lambda), equivalente a la sintaxis de consulta del segundo ejemplo", ["Solo existe la sintaxis de método, la de consulta no soporta Where", "Son dos operadores distintos sin relación", "La sintaxis de consulta es más rápida en tiempo de ejecución"], 1,
    "Ambas sintaxis compilan al mismo conjunto de llamadas a métodos de extensión; son intercambiables para expresar la misma consulta."),
   sqr("¿Qué ocurre si Where se llama sobre una lista vacía?", "Devuelve una secuencia vacía, sin lanzar excepción", ["Lanza InvalidOperationException", "Devuelve null", "Lanza ArgumentOutOfRangeException"], 2,
    "Where simplemente no produce elementos si no hay nada que filtrar ni nada que cumpla la condición; nunca lanza excepción por eso."),
   sqr("¿Qué expresión produce el doble de los números mayores a 3, filtrando primero y transformando después?", "numbers.Where(n => n > 3).Select(n => n * 2)", ["numbers.Select(n => n * 2).Where(n => n > 3)", "numbers.Where(n => n * 2 > 3)", "numbers.Select(n => n > 3 ? n * 2 : n)"], 3,
    "Filtrar antes de transformar da {4,5,6} dobladas a {8,10,12}; invertir el orden (Select y luego Where) da un resultado distinto: {4,6,8,10,12}, porque el filtro se aplica sobre los valores ya duplicados."),
  ],
 },
 {
  id: "m12-orderby",
  title: "OrderBy y ThenBy",
  summary: "OrderBy ordena una secuencia de forma ascendente según una clave; OrderByDescending lo hace en forma descendente. ThenBy/ThenByDescending agregan un criterio de desempate y solo están disponibles sobre el IOrderedEnumerable<T> que devuelve un OrderBy previo. El ordenamiento de LINQ es estable (los empates conservan su orden relativo original) y de ejecución diferida no-streaming: debe leer toda la secuencia antes de producir el primer resultado.",
  code: `var people = new[] {
    new { Name = "Ada", Age = 30 },
    new { Name = "Bob", Age = 25 },
    new { Name = "Cy", Age = 30 },
};
var sorted = people.OrderBy(p => p.Age).ThenBy(p => p.Name);
foreach (var p in sorted) Console.Write(p.Name + " ");`,
  questions: [
   sqr("¿Qué imprime este código?", "Bob Ada Cy", ["Ada Bob Cy", "Cy Ada Bob", "Bob Cy Ada"], 2,
    "Bob tiene la menor edad (25) y va primero; Ada y Cy empatan en 30, y ThenBy los desempata alfabéticamente por nombre: Ada antes que Cy."),
   sqr("¿Por qué Ada aparece antes que Cy si ambos tienen Age=30?", "Porque ThenBy(p => p.Name) desempata por nombre en orden ascendente, y 'Ada' es alfabéticamente anterior a 'Cy'", ["Porque OrderBy es aleatorio para valores empatados", "Porque Ada aparece primero en el array original y OrderBy no reordena empates", "Porque ThenBy ordena de forma descendente por defecto"], 0,
    "ThenBy aplica un criterio de orden secundario ascendente sobre los elementos que empataron en la clave principal (Age)."),
   sqr("¿Qué método se debe usar DESPUÉS de OrderByDescending para agregar un criterio de desempate ascendente?", "ThenBy", ["OrderBy de nuevo", "ThenByDescending únicamente", "Where"], 1,
    "ThenBy encadena un criterio de orden secundario ascendente sin perder el orden principal ya establecido por OrderBy/OrderByDescending."),
   sqr("¿Se puede escribir `people.ThenBy(p => p.Name)` directamente sobre `people` (un array), sin OrderBy previo?", "No, ThenBy solo está definido sobre IOrderedEnumerable<T>, que es lo que devuelve OrderBy/OrderByDescending", ["Sí, ThenBy funciona igual que OrderBy sobre cualquier IEnumerable", "Sí, pero ordena de forma descendente por defecto", "No, ThenBy no existe como método de LINQ"], 1,
    "ThenBy es un método de extensión sobre IOrderedEnumerable<T>, no sobre IEnumerable<T>; requiere haber llamado antes a OrderBy u OrderByDescending."),
   sqr("¿OrderBy es una operación de ejecución diferida streaming o no-streaming?", "Diferida no-streaming: debe leer toda la secuencia de origen antes de poder producir el primer elemento ordenado", ["Diferida streaming: produce resultados a medida que lee el origen", "Inmediata: se ejecuta en el momento en que se llama a OrderBy", "No es diferida en absoluto"], 3,
    "Para ordenar, LINQ necesita conocer todos los elementos antes de decidir cuál va primero; por eso OrderBy es no-streaming, aunque sigue siendo diferido."),
   sqr("¿Qué característica tiene el algoritmo de ordenamiento de OrderBy respecto a elementos con la misma clave (estabilidad)?", "Es estable: los elementos con clave igual conservan su orden relativo original", ["No es estable: el orden entre empates es indefinido", "Siempre invierte el orden de los empates", "Solo es estable si se usa ThenBy"], 2,
    "LINQ to Objects garantiza un ordenamiento estable; sin ThenBy, Ada y Cy conservarían el orden en que aparecen en el array original si tuvieran igual clave de OrderBy."),
   sqr("¿Qué produce `people.OrderByDescending(p => p.Age)` como primer elemento?", "Ada o Cy (los de mayor edad, 30), en el orden relativo original entre ellos porque el sort es estable", ["Bob, porque siempre empieza por el primer elemento del array", "Un error, porque hay edades repetidas", "Cy siempre, sin importar el orden original"], 1,
    "Ada y Cy tienen la mayor edad (30); al ser un sort estable, el que aparecía primero en el array original (Ada) queda primero entre los empatados."),
   sqr("¿Qué tipo de retorno tiene OrderBy, distinto del de Where o Select?", "IOrderedEnumerable<TSource>, que permite encadenar ThenBy/ThenByDescending", ["IEnumerable<TSource>, igual que Where", "List<TSource>", "IQueryable<TSource> únicamente"], 3,
    "OrderBy devuelve IOrderedEnumerable<TSource>, una interfaz especial que habilita los métodos ThenBy/ThenByDescending."),
   sqr("¿Qué le pasa a una consulta con OrderBy si el origen (`people`) cambia después de declarar `sorted` pero antes de enumerarla?", "El resultado enumerado reflejará el estado actualizado del origen, porque OrderBy también es de ejecución diferida", ["sorted queda fijo con los valores del momento en que se declaró", "Lanza una excepción por modificar la colección", "Solo refleja el cambio si se llama ToList() antes"], 0,
    "Aunque OrderBy es no-streaming (debe leer todo antes de producir resultados), sigue siendo diferido: no ejecuta nada hasta que se enumera."),
   sqr("¿Qué combinación ordena a las personas primero por edad descendente y luego por nombre ascendente?", "people.OrderByDescending(p => p.Age).ThenBy(p => p.Name)", ["people.OrderBy(p => p.Age).ThenByDescending(p => p.Name)", "people.OrderByDescending(p => p.Age).OrderBy(p => p.Name)", "people.ThenByDescending(p => p.Age).OrderBy(p => p.Name)"], 2,
    "Encadenar OrderByDescending(Age).ThenBy(Name) da edad descendente como criterio principal y nombre ascendente como desempate; llamar a OrderBy de nuevo (en vez de ThenBy) descartaría el orden por edad y reordenaría todo solo por nombre."),
  ],
 },
 {
  id: "m12-first-single-any",
  title: "First, Single y Any",
  summary: "First devuelve el primer elemento que cumple una condición (o el primero de la secuencia) y lanza InvalidOperationException si no hay ninguno; FirstOrDefault devuelve default(T) en ese caso. Single exige exactamente un elemento coincidente y lanza excepción tanto si no hay ninguno como si hay más de uno; SingleOrDefault permite cero (devuelve default) pero sigue lanzando si hay más de uno. Any comprueba existencia, se detiene en la primera coincidencia y nunca lanza excepción por una secuencia vacía.",
  code: `var numbers = new List<int> { 4, 8, 15, 16 };
var big = numbers.First(n => n > 10);
Console.WriteLine(big);`,
  questions: [
   sqr("¿Qué imprime este código?", "15", ["16", "8", "Excepción porque hay más de un número mayor a 10"], 0,
    "First devuelve el PRIMER elemento que cumple la condición recorriendo en orden; 15 aparece antes que 16 en la lista."),
   sqr("¿Qué ocurre si se cambia a `numbers.First(n => n > 100)`?", "Lanza InvalidOperationException porque ningún elemento cumple la condición", ["Devuelve 0", "Devuelve null", "Devuelve el último elemento de la lista"], 1,
    "First (sin OrDefault) exige que exista al menos un elemento coincidente; si no lo hay, lanza InvalidOperationException."),
   sqr("¿Qué ocurre si se usa `FirstOrDefault(n => n > 100)` en vez de First?", "Devuelve 0 (el valor por defecto de int), sin lanzar excepción", ["Lanza la misma excepción que First", "Devuelve -1", "Devuelve null, porque FirstOrDefault siempre es nullable"], 2,
    "FirstOrDefault devuelve default(T) cuando no hay coincidencias; para int, ese valor por defecto es 0."),
   sqr("¿Qué ocurre al llamar `numbers.Single(n => n > 10)`, dado que 15 y 16 son ambos mayores a 10?", "Lanza InvalidOperationException porque hay más de un elemento que cumple la condición", ["Devuelve 15, el primero que cumple", "Devuelve 16, el último que cumple", "Devuelve una lista con ambos valores"], 3,
    "Single exige que exactamente un elemento cumpla la condición; si hay más de uno, lanza excepción en vez de elegir arbitrariamente."),
   sqr("¿Cuándo Single NO lanza excepción?", "Solo cuando exactamente un elemento cumple la condición (o la secuencia tiene exactamente un elemento, sin predicado)", ["Cuando hay cero o más de un elemento", "Siempre, Single nunca lanza excepciones", "Solo si la secuencia está vacía"], 1,
    "Single está pensado para expresar 'debe haber exactamente uno'; cero o más de uno son ambos casos de error."),
   sqr("¿Qué diferencia hay entre `SingleOrDefault` y `Single` respecto a una secuencia vacía?", "SingleOrDefault devuelve el valor por defecto sin lanzar excepción; Single lanza InvalidOperationException", ["Ambos lanzan la misma excepción con secuencia vacía", "Ambos devuelven el valor por defecto sin lanzar excepción", "SingleOrDefault lanza excepción y Single no"], 2,
    "SingleOrDefault tolera cero coincidencias (devuelve default), pero sigue lanzando excepción si hay más de una, igual que Single."),
   sqr("¿Qué imprime `numbers.Any(n => n > 10)`?", "True", ["False", "2 (la cantidad de elementos que cumplen)", "15 (el primer valor que cumple)"], 3,
    "Any devuelve un bool indicando si existe al menos un elemento que cumple la condición; 15 y 16 cumplen, así que es True."),
   sqr("¿Qué ventaja de rendimiento tiene Any(predicado) frente a `numbers.Count(predicado) > 0` en una secuencia grande?", "Any se detiene apenas encuentra el primer elemento que cumple, mientras que Count recorre toda la secuencia", ["No hay ninguna diferencia de rendimiento", "Count es siempre más rápido porque no evalúa un predicado", "Any siempre materializa la secuencia completa en una lista"], 1,
    "Any hace cortocircuito: en cuanto encuentra una coincidencia, retorna true sin seguir iterando; Count debe recorrer todo para contar con precisión."),
   sqr("¿Qué imprime `new List<int>().Any()` (lista vacía, sin predicado)?", "False, y no lanza ninguna excepción", ["Lanza InvalidOperationException", "True, porque Any siempre es true sin predicado", "Lanza ArgumentNullException"], 2,
    "Any() sin predicado solo comprueba si la secuencia tiene al menos un elemento; sobre una lista vacía, es False sin lanzar excepción."),
   sqr("¿Qué método elegirías para obtener 'el único usuario con ese Id, o lanzar una excepción clara si hay datos duplicados inesperados'?", "Single(u => u.Id == id), porque expresa la expectativa de unicidad y falla explícitamente si se viola", ["First(u => u.Id == id), porque siempre es más seguro", "Any(u => u.Id == id), porque devuelve el usuario directamente", "Count(u => u.Id == id), porque cuenta cuántos hay"], 3,
    "Single comunica en el código la invariante 'debe haber exactamente uno' y falla ruidosamente si esa invariante se rompe, a diferencia de First que ocultaría el problema."),
  ],
 },
 {
  id: "m12-groupby-join",
  title: "GroupBy y Join",
  summary: "GroupBy agrupa elementos por una clave en secuencias IGrouping<TKey,TElement>; es de ejecución diferida pero no-streaming, ya que internamente construye una tabla de búsqueda que exige leer toda la fuente antes de entregar el primer grupo. Join realiza una combinación tipo inner join entre dos secuencias según claves coincidentes, descartando los elementos sin pareja en ambos lados.",
  code: `var orders = new[] {
    new { Customer = "Ada", Amount = 100 },
    new { Customer = "Bob", Amount = 50 },
    new { Customer = "Ada", Amount = 30 },
};
var byCustomer = orders.GroupBy(o => o.Customer);
foreach (var g in byCustomer)
    Console.WriteLine($"{g.Key}: {g.Sum(o => o.Amount)}");`,
  questions: [
   sqr("¿Qué imprime este código?", "Ada: 130 y Bob: 50 (en ese orden)", ["Ada: 100, Bob: 50, Ada: 30", "Bob: 50 y Ada: 130", "Ada: 130 solamente"], 0,
    "GroupBy agrupa por Customer conservando el orden de primera aparición (Ada, luego Bob); Ada suma 100+30=130 y Bob suma 50."),
   sqr("¿Qué representa `g.Key` dentro del foreach?", "El valor de la clave de agrupación (el nombre del cliente) para ese grupo", ["El índice numérico del grupo", "La cantidad de elementos del grupo", "El primer Amount del grupo"], 1,
    "Cada IGrouping<TKey,TElement> expone Key con el valor de la clave usada para formar ese grupo, además de los elementos agrupados."),
   sqr("¿GroupBy es una operación de ejecución diferida streaming o no-streaming?", "Diferida no-streaming: debe leer toda la secuencia de origen antes de poder producir el primer grupo", ["Diferida streaming: puede producir grupos a medida que lee elementos", "Inmediata: se ejecuta al llamar a GroupBy", "No es diferida, siempre se materializa en una lista"], 2,
    "GroupBy construye una tabla de búsqueda interna que necesita recorrer todo el origen antes de poder entregar el primer grupo completo."),
   sqr("¿Qué imprime este código con Join?", "Ada: 100 (solo esa línea)", ["Ada: 100 y Bob: (sin datos)", "Ada: 100, Bob: 0", "Ninguna línea, porque no todos los CustomerId coinciden"], 3,
    "Solo el customer Id=1 (Ada) tiene una orden con CustomerId=1 coincidente; Bob (Id=2) y la orden con CustomerId=3 no encuentran pareja y se descartan.",
    `var customers = new[] { new { Id = 1, Name = "Ada" }, new { Id = 2, Name = "Bob" } };
var orders2 = new[] { new { CustomerId = 1, Total = 100 }, new { CustomerId = 3, Total = 20 } };
var joined = customers.Join(orders2, c => c.Id, o => o.CustomerId, (c, o) => $"{c.Name}: {o.Total}");
foreach (var j in joined) Console.WriteLine(j);`),
   sqr("¿Por qué el pedido con CustomerId=3 no aparece en el resultado del Join?", "Porque Join realiza un inner join: solo produce resultados cuando ambas claves coinciden", ["Porque Join ordena por Id y descarta el tercero", "Porque orders2 solo permite dos elementos", "Porque Join siempre ignora el último elemento de la segunda secuencia"], 1,
    "Join se comporta como un INNER JOIN de SQL: cualquier elemento de cualquiera de las dos secuencias sin coincidencia de clave queda fuera del resultado."),
   sqr("¿Qué parámetros recibe Join en el orden mostrado en el ejemplo?", "La secuencia interna, el selector de clave externa, el selector de clave interna, y una función para combinar cada par coincidente", ["Solo dos selectores de clave, sin función de combinación", "La secuencia interna y un comparador de igualdad únicamente", "Una función de filtro y una de proyección"], 2,
    "La firma es Join(inner, outerKeySelector, innerKeySelector, resultSelector): la secuencia con la que se combina, cómo obtener la clave de cada lado, y cómo construir el resultado combinado."),
   sqr("¿Qué operador usarías si necesitas conservar TODOS los customers en el resultado, incluso los que no tienen ningún order asociado (similar a un LEFT JOIN)?", "GroupJoin combinado con SelectMany y DefaultIfEmpty", ["Join normal, porque ya incluye todos los elementos", "Where seguido de Join", "OrderBy antes de Join"], 3,
    "GroupJoin agrupa las coincidencias por cada elemento externo; combinado con DefaultIfEmpty simula un left outer join, preservando los elementos externos sin pareja."),
   sqr("¿Qué tipo de resultado produce cada elemento de `orders.GroupBy(o => o.Customer)`?", "Un IGrouping<TKey, TElement>, que es en sí mismo una secuencia de los elementos de ese grupo más su Key", ["Un Dictionary<TKey, List<TElement>>", "Un array plano de TElement sin agrupar", "Un solo valor escalar por grupo"], 1,
    "IGrouping<TKey,TElement> hereda de IEnumerable<TElement> y además expone la propiedad Key con el valor de agrupación."),
   sqr("¿Qué distingue a GroupBy de ToLookup si ambos agrupan por clave?", "GroupBy es de ejecución diferida (parte de una consulta), mientras que ToLookup ejecuta inmediatamente y devuelve una estructura ya materializada", ["Son exactamente lo mismo, solo cambia el nombre", "ToLookup es diferido y GroupBy es inmediato", "GroupBy no permite iterar los grupos, ToLookup sí"], 2,
    "ToLookup fuerza la ejecución inmediata y cachea el resultado en un ILookup<TKey,TElement>; GroupBy, en cambio, sigue las reglas de ejecución diferida como el resto de LINQ."),
   sqr("¿Qué trampa de entrevista existe sobre GroupBy respecto a su clasificación como 'diferido'?", "Aunque es diferido (no se ejecuta al declararse), al enumerarlo por primera vez debe recorrer y materializar TODA la secuencia de origen antes de entregar el primer grupo, a diferencia de Where o Select", ["GroupBy nunca es diferido, siempre se ejecuta de inmediato como Count()", "GroupBy entrega resultados elemento por elemento igual que Where, sin leer todo el origen", "GroupBy no puede usarse dentro de una expresión LINQ diferida"], 0,
    "Es un error común asumir que 'diferido' implica siempre 'streaming'; GroupBy es diferido pero no-streaming, por lo que su primer resultado exige haber leído toda la fuente."),
  ],
 },
 {
  id: "m12-deferred",
  title: "Deferred execution",
  summary: "La ejecución diferida significa que una consulta LINQ no se ejecuta al declararse, sino cada vez que se enumera (foreach, ToList, etc.); si la fuente cambia entre la declaración y la enumeración, el resultado refleja el estado más reciente. Métodos como ToList, ToArray, Count() o First() fuerzan ejecución inmediata y producen una instantánea fija de los datos en ese momento.",
  code: `var list = new List<int> { 1, 2, 3 };
var query = list.Where(n => n > 1);
list.Add(4);
foreach (var n in query) Console.Write(n + " ");`,
  questions: [
   sqr("¿Qué imprime este código?", "2 3 4", ["2 3", "1 2 3 4", "Error de compilación"], 0,
    "Where es de ejecución diferida: no filtra nada hasta el foreach, momento en el que list ya contiene el 4 recién agregado."),
   sqr("¿Por qué el 4 aparece en el resultado si se agregó DESPUÉS de declarar `query`?", "Porque Where usa ejecución diferida: la consulta no se evalúa hasta el foreach, momento en que list ya contiene el 4", ["Porque Where siempre revisa el estado más reciente sin importar cuándo se llama", "Porque list.Add(4) fuerza una reevaluación inmediata de query", "Es un error; en realidad el 4 nunca debería aparecer"], 1,
    "La consulta query solo describe la operación; se ejecuta contra el estado actual de list en el momento de la enumeración, no en el momento en que fue declarada."),
   sqr("¿Qué imprime este código con ToList aplicado?", "2 3", ["2 3 4", "1 2 3 4", "Error porque snapshot es de solo lectura"], 2,
    "ToList() fuerza ejecución inmediata en ese momento, antes de que se agregue el 4; snapshot queda fijo con {2, 3} y no cambia después.",
    `var list2 = new List<int> { 1, 2, 3 };
var snapshot = list2.Where(n => n > 1).ToList();
list2.Add(4);
foreach (var n in snapshot) Console.Write(n + " ");`),
   sqr("¿Qué diferencia produce llamar `.ToList()` al final de la consulta respecto al ejemplo con ejecución diferida?", "Fuerza ejecución inmediata: snapshot queda fijo con los datos del momento en que se llamó ToList, sin reflejar cambios posteriores en list2", ["No hay ninguna diferencia, ambos casos reflejan cambios posteriores", "ToList hace que la consulta se vuelva más lenta pero el resultado es igual", "ToList impide que list2 pueda modificarse después"], 3,
    "A diferencia de una consulta diferida, ToList calcula y almacena el resultado una sola vez, en el instante en que se invoca."),
   sqr("¿Qué ocurre si se modifica la ESTRUCTURA de una List<T> (Add/Remove) mientras se está enumerando una consulta diferida sobre ella en el mismo ciclo?", "Se lanza InvalidOperationException por modificación de la colección durante la enumeración", ["Se ignora silenciosamente el cambio", "El foreach reinicia automáticamente desde el principio", "Solo falla si se modifica el último elemento"], 1,
    "List<T> detecta cambios estructurales durante la enumeración (a través de su enumerador) y lanza InvalidOperationException para evitar resultados inconsistentes."),
   sqr("¿Qué métodos fuerzan ejecución inmediata de una consulta LINQ diferida?", "ToList, ToArray, Count(), First(), entre otros que devuelven un valor escalar o materializan la colección", ["Where y Select únicamente", "Solamente el operador foreach", "Ningún método fuerza ejecución inmediata; todo LINQ es siempre diferido"], 2,
    "Los métodos que devuelven un valor escalar o una colección ya materializada (List, array) deben recorrer la fuente en el momento en que se llaman."),
   sqr("¿Qué significa 'la consulta se re-evalúa cada vez que se enumera' para una variable con Where sin materializar?", "Si se recorre la misma variable de consulta dos veces (por ejemplo con dos foreach), el filtro se ejecuta de nuevo cada vez contra el estado actual del origen", ["La consulta solo puede recorrerse una vez en toda la vida del programa", "El resultado se almacena en caché después del primer foreach automáticamente", "Cada enumeración adicional lanza una excepción"], 0,
    "Una consulta diferida no cachea nada por sí sola; cada enumeración vuelve a ejecutar la lógica de filtrado/proyección desde cero."),
   sqr("¿Qué ventaja de rendimiento puede perderse si NO se llama ToList() y se enumera la misma consulta diferida varias veces?", "Se repite el trabajo de filtrar/transformar cada vez que se enumera, en vez de reutilizar un resultado ya calculado", ["Ninguna, el rendimiento es siempre idéntico con o sin ToList", "Se pierde memoria porque ToList jamás libera recursos", "La consulta diferida es siempre más rápida que un ToList cacheado"], 1,
    "Sin materializar, cada foreach adicional vuelve a ejecutar toda la cadena de operadores; ToList evita ese trabajo repetido a cambio de una copia en memoria."),
   sqr("¿Qué tipo de retorno tiene una consulta con Where antes de materializarla, indicando que aún no se ejecutó?", "IEnumerable<T> (una definición de consulta, no un resultado calculado)", ["List<T>, ya materializada", "T[], ya materializada", "void, porque no produce nada hasta el foreach"], 2,
    "Where devuelve IEnumerable<T>; ese tipo describe cómo producir los elementos, pero no los produce hasta que algo lo enumera."),
   sqr("¿Qué trampa de entrevista es común sobre la ejecución diferida y variables capturadas en el predicado, por ejemplo `list.Where(n => n > umbral)`?", "Si `umbral` cambia después de declarar la consulta pero antes de enumerarla, el filtro usará el valor de `umbral` en el momento de la enumeración, no el que tenía al declararse", ["El valor de umbral siempre se fija en el momento de declarar la consulta", "Cambiar umbral después de declarar la consulta produce una excepción", "La consulta ignora cualquier variable capturada externamente"], 0,
    "El predicado es una lambda que captura umbral como closure; combinado con la ejecución diferida, el filtro real se evalúa con el valor vigente al momento del foreach."),
  ],
 },
 {
  id: "m12-challenge",
  title: "Reto LINQ",
  summary: "Reto del módulo 12: combina GroupBy, Select y OrderByDescending para construir un reporte agregado, y decide entre First, Single y Any según las garantías de cardinalidad que necesitas, reconociendo cuándo cada operador puede lanzar una excepción.",
  code: `var products = new[] {
    new { Name = "Mouse", Category = "Accesorios", Price = 20m },
    new { Name = "Teclado", Category = "Accesorios", Price = 45m },
    new { Name = "Monitor", Category = "Pantallas", Price = 300m },
};
var report = products
    .GroupBy(p => p.Category)
    .Select(g => new { Category = g.Key, Total = g.Sum(p => p.Price) })
    .OrderByDescending(r => r.Total);
foreach (var r in report) Console.WriteLine($"{r.Category}: {r.Total}");`,
  questions: [
   sqr("¿Qué imprime este código (orden y valores)?", "Pantallas: 300 y luego Accesorios: 65", ["Accesorios: 65 y luego Pantallas: 300", "Accesorios: 20, Accesorios: 45, Pantallas: 300", "Pantallas: 300 solamente"], 0,
    "Accesorios suma 20+45=65 y Pantallas suma 300; OrderByDescending por Total coloca primero al grupo con mayor total, es decir Pantallas."),
   sqr("¿Qué hace `g.Sum(p => p.Price)` dentro del Select?", "Suma los precios de todos los productos que pertenecen a ese grupo (esa categoría)", ["Suma los precios de todos los productos sin importar el grupo", "Cuenta cuántos productos hay en el grupo", "Calcula el precio promedio del grupo"], 0,
    "g es un IGrouping con solo los elementos de esa categoría; Sum sobre g solo suma los precios de esos elementos agrupados."),
   sqr("¿En qué orden se ejecutan conceptualmente las operaciones de esta consulta al enumerarse?", "Primero se agrupan los productos por categoría, luego se calcula el total por grupo, y finalmente se ordena por total descendente", ["Primero se ordena, luego se agrupa y por último se suma", "Se ejecutan todas simultáneamente sin orden definido", "Primero se suma todo el catálogo y luego se agrupa el resultado"], 0,
    "La cadena fluida refleja el orden lógico: GroupBy agrupa, Select calcula el total por grupo, y OrderByDescending ordena esos totales ya calculados."),
   sqr("¿Qué tipo de ejecución tiene esta consulta completa (`report`) antes del foreach?", "Diferida: la cadena de GroupBy/Select/OrderByDescending no hace ningún trabajo hasta que se enumera con foreach", ["Inmediata: se calcula por completo en la línea donde se declara report", "Parcialmente inmediata: solo GroupBy se ejecuta de inmediato", "No aplica el concepto de ejecución diferida a consultas con Select"], 0,
    "Todos los operadores usados (GroupBy, Select, OrderByDescending) son de ejecución diferida; la consulta completa solo se ejecuta al enumerarse."),
   sqr("¿Qué método usarías para obtener SOLO la categoría con mayor total, sin recorrer manualmente el resultado con un foreach?", "report.First()", ["report.Single()", "report.Any()", "report.Where(r => true)"], 0,
    "Como report ya está ordenado descendentemente, First() devuelve directamente el elemento con mayor Total; Single() fallaría porque hay más de un elemento en report."),
   sqr("¿Qué ocurriría si llamas `report.Single()` en este caso, con dos categorías en total?", "Lanza InvalidOperationException, porque report tiene más de un elemento y Single exige exactamente uno", ["Devuelve el primer elemento, igual que First", "Devuelve el último elemento", "Devuelve null porque no hay predicado"], 0,
    "Single (sin predicado) exige que la secuencia completa tenga exactamente un elemento; con dos grupos, lanza excepción en vez de elegir uno."),
   sqr("¿Qué expresión obtiene solo los productos de la categoría 'Accesorios' ordenados por precio ascendente, sin agrupar?", "products.Where(p => p.Category == \"Accesorios\").OrderBy(p => p.Price)", ["products.OrderBy(p => p.Price).GroupBy(p => p.Category)", "products.GroupBy(p => p.Category).OrderBy(p => p.Price)", "products.Select(p => p.Category == \"Accesorios\")"], 0,
    "Where filtra directamente por categoría y OrderBy ordena por precio; las otras opciones agrupan (cambiando la forma del resultado) o proyectan a un bool en vez de filtrar."),
   sqr("¿Qué comprobación harías ANTES de llamar `.First()` sobre una consulta que podría estar vacía, para evitar una excepción?", "Usar report.Any() para verificar si hay al menos un elemento, o usar FirstOrDefault() en su lugar", ["No es necesario comprobar nada, First() nunca lanza excepciones", "Llamar Count() y asumir que siempre es mayor a 0", "Usar Single() en vez de First(), porque Single es más seguro"], 0,
    "Any() o FirstOrDefault() permiten manejar el caso de secuencia vacía sin que First() lance InvalidOperationException."),
   sqr("¿Qué principio de LINQ explica por qué se puede encadenar GroupBy, Select y OrderByDescending en una sola expresión fluida?", "Cada operador LINQ devuelve una secuencia (IEnumerable<T> o similar) que expone los mismos métodos de extensión, permitiendo encadenarlos", ["Porque GroupBy convierte automáticamente el resultado en List<T>", "Porque Select solo puede usarse después de GroupBy", "Porque OrderByDescending modifica products directamente"], 0,
    "Los métodos de extensión de LINQ están definidos sobre IEnumerable<T> (o interfaces relacionadas), así que el resultado de cada uno puede encadenarse con el siguiente."),
   sqr("¿Qué cambiaría si products fuera un IQueryable<T> proveniente de Entity Framework en lugar de un array en memoria?", "La consulta se traduciría a SQL y se ejecutaría en la base de datos al enumerarse, en vez de ejecutarse con LINQ to Objects en memoria", ["El comportamiento sería exactamente idéntico, sin ninguna diferencia relevante", "GroupBy dejaría de funcionar completamente con IQueryable", "La ejecución dejaría de ser diferida y se volvería inmediata siempre"], 0,
    "Con IQueryable<T>, un proveedor LINQ (como Entity Framework) traduce la expresión completa a otro lenguaje (SQL) y la ejecuta en el origen de datos, manteniendo el mismo principio de ejecución diferida hasta la enumeración."),
  ],
 },
];
