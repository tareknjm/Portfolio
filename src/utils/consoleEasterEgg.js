export function initConsoleEasterEgg() {
  const styles = {
    title: "color: #a855f7; font-size: 20px; font-weight: bold;",
    subtitle: "color: #22d3ee; font-size: 13px;",
    text: "color: #e5e7eb; font-size: 12px; line-height: 1.6;",
    link: "color: #a855f7; font-size: 12px; text-decoration: underline;",
  };

  console.log(
    "%c" +
      `
 ████████╗███╗   ██╗
 ╚══██╔══╝████╗  ██║
    ██║   ██╔██╗ ██║
    ██║   ██║╚██╗██║
    ██║   ██║ ╚████║
    ╚═╝   ╚═╝  ╚═══╝
  `,
    styles.title
  );
  console.log("%cTarek Najem — Développeur Full Stack", styles.subtitle);
  console.log(
    "%c\nCurieux de voir comment c'est fait ? Bien joué 👀\nCe portfolio est open source, va jeter un œil au code :",
    styles.text
  );
  console.log("%chttps://github.com/tareknjm/Portfolio", styles.link);
  console.log(
    "%c\nSi tu recrutes (ou si tu codes bien et que tu veux discuter) → contacte-moi via le formulaire du site 🚀\n",
    styles.text
  );
}