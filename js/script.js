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
const estudos = document.querySelectorAll(".estudo-caso[data-case]");
const indiceTopicos = document.querySelectorAll(".docs-indice a[data-topic]");
const linksEstudos = document.querySelectorAll(".docs-case-nav a[data-case-link]");
const artigoEstudos = document.querySelector(".docs-artigo");

const mostrarEstudo = (caseId, options = {}) => {
  if (!caseId || !estudos.length) return;

  const estudoAtivo = document.querySelector(`.estudo-caso[data-case="${caseId}"]`);
  if (!estudoAtivo) return;

  estudos.forEach((estudo) => {
    estudo.hidden = estudo.dataset.case !== caseId;
  });

  indiceTopicos.forEach((link) => {
    const topic = link.dataset.topic;
    link.href = `#${caseId}-${topic}`;
    link.classList.remove("ativo");
  });

  linksEstudos.forEach((link) => {
    link.classList.toggle("ativo", link.dataset.caseLink === caseId);
  });

  artigoEstudos?.classList.add("pagina-interna");

  if (options.scroll !== false) {
    estudoAtivo.scrollIntoView({ behavior: options.behavior || "smooth", block: "start" });
  }
};

const mostrarEstudoPeloHash = () => {
  if (!location.hash) return false;

  const alvo = document.querySelector(location.hash);
  const estudo = alvo?.closest(".estudo-caso[data-case]");

  if (estudo) {
    mostrarEstudo(estudo.dataset.case, { scroll: false });
    return true;
  }

  return false;
};

if (estudos.length && indiceTopicos.length) {
  linksEstudos.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const caseId = link.dataset.caseLink;
      history.pushState(null, "", link.getAttribute("href"));
      mostrarEstudo(caseId);
    });
  });

  indiceTopicos.forEach((link) => {
    link.addEventListener("click", () => {
      indiceTopicos.forEach((item) => item.classList.remove("ativo"));
      link.classList.add("ativo");
    });
  });

  window.addEventListener("hashchange", mostrarEstudoPeloHash);

  if (!mostrarEstudoPeloHash()) {
    mostrarEstudo(estudos[0].dataset.case, { scroll: false });
  }
}

const destacarSql = (codigo) => {
  let html = codigo
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/('[^']*')/g, '<span class="sql-string">$1</span>');
  html = html.replace(/\b(SUM|COUNT|AVG|MIN|MAX|COALESCE|ROUND)\b/g, '<span class="sql-function">$1</span>');
  html = html.replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|LEFT JOIN|INNER JOIN|ON|AS|AND|OR|BETWEEN|DESC|ASC|CREATE VIEW)\b/g, '<span class="sql-keyword">$1</span>');
  html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="sql-number">$1</span>');

  return html;
};

const criarPainelSql = () => {
  document.querySelectorAll("pre.sql-bloco").forEach((pre) => {
    if (pre.closest(".sql-demo")) return;

    const code = pre.querySelector("code");
    const codigo = pre.textContent.trim();
    const painel = document.createElement("div");
    painel.className = "sql-demo";

    const topo = document.createElement("div");
    topo.className = "sql-demo-topo";

    const titulo = document.createElement("span");
    titulo.textContent = "SQL";

    const acoes = document.createElement("div");
    acoes.className = "sql-demo-acoes";

    const copiar = document.createElement("button");
    copiar.className = "sql-copy";
    copiar.type = "button";
    copiar.textContent = "Copy";
    copiar.addEventListener("click", async () => {
      await navigator.clipboard.writeText(codigo);
      copiar.textContent = "Copied";
      setTimeout(() => {
        copiar.textContent = "Copy";
      }, 1600);
    });

    acoes.appendChild(copiar);
    topo.append(titulo, acoes);
    if (code) code.innerHTML = destacarSql(codigo);
    pre.parentNode.insertBefore(painel, pre);
    painel.append(topo, pre);
  });
};

criarPainelSql();
