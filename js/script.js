const links = document.querySelectorAll('a[href^="#"]');
const menuBotao = document.querySelector(".menu-botao");
const linksMenu = document.querySelector(".links-menu");

links.forEach((link) => {
  link.addEventListener("click", function (event) {
    const destino = document.querySelector(this.getAttribute("href"));

    if (destino) {
      event.preventDefault();
      destino.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    if (linksMenu && menuBotao) {
      linksMenu.classList.remove("aberto");
      menuBotao.setAttribute("aria-expanded", "false");
    }
  });
});

if (menuBotao && linksMenu) {
  menuBotao.addEventListener("click", () => {
    const estaAberto = linksMenu.classList.toggle("aberto");
    menuBotao.setAttribute("aria-expanded", String(estaAberto));
  });
}
