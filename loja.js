
document.addEventListener("DOMContentLoaded", () => {

    // Transforma os elementos data-lucide em ícones SVG.
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Seleciona os links internos do menu.
    const links = document.querySelectorAll(
        '.menu a[href^="#"]'
    );

    // Seleciona as seções principais da loja.
    const secoes = document.querySelectorAll(
        "main section[id]"
    );

    // Observa qual seção está aparecendo na tela.
    if ("IntersectionObserver" in window) {

        const observador = new IntersectionObserver((entradas) => {

            entradas.forEach((entrada) => {

                if (!entrada.isIntersecting) return;

                const id = entrada.target.id;

                links.forEach((link) => {
                    link.classList.toggle(
                        "ativo",
                        link.getAttribute("href") === `#${id}`
                    );
                });

            });

        }, {
            rootMargin: "-25% 0px -55% 0px"
        });

        secoes.forEach((secao) => {
            observador.observe(secao);
        });
    }

});
