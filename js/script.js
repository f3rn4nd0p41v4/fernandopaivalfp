console.log("Portfólio Luiz Fernando carregado com sucesso.");

const links = document.querySelectorAll('a[href^="#"]');

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
  });
});