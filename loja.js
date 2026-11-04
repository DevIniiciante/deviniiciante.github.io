
/* ==========================================
   DEVINICIANTE — LOJA
   NAVEGAÇÃO + CONTRATAÇÃO
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // CONFIGURAÇÃO DOS PLANOS
    // ======================================

    const PLANOS = {
        "empresarial-basico": {
            nome: "Site Empresarial Básico",
            preco: 70
        },

        "empresarial-avancado": {
            nome: "Site Empresarial Avançado",
            preco: 90
        },

        "pessoal-basico": {
            nome: "Site Pessoal Básico",
            preco: 80
        },

        "pessoal-avancado": {
            nome: "Site Pessoal Avançado",
            preco: 120
        },

        "romantico": {
            nome: "Site Romântico Personalizado",
            preco: 110
        }
    };

    const formatarPreco = (valor) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor);
    };

    // ======================================
    // ÍCONES LUCIDE
    // ======================================

    if (window.lucide) {
        window.lucide.createIcons();
    }

    // ======================================
    // MENU ATIVO AO ROLAR
    // ======================================

    const links = document.querySelectorAll(
        '.menu a[href^="#"]'
    );

    const secoes = document.querySelectorAll(
        "main section[id]"
    );

    if ("IntersectionObserver" in window) {

        const observador = new IntersectionObserver(
            (entradas) => {

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

            },
            {
                rootMargin: "-25% 0px -55% 0px"
            }
        );

        secoes.forEach((secao) => {
            observador.observe(secao);
        });
    }

    // ======================================
    // ELEMENTOS DO FORMULÁRIO
    // ======================================

    const modal = document.getElementById(
        "modal-contratacao"
    );

    const fecharModalBotao = document.getElementById(
        "fechar-modal"
    );

    const resumoPlano = document.getElementById(
        "resumo-plano"
    );

    const resumoPreco = document.getElementById(
        "resumo-preco"
    );

    const formulario = document.getElementById(
        "form-contratacao"
    );

    const botaoFinalizar = document.getElementById(
        "botao-finalizar"
    );

    const avisoPagamento = document.getElementById(
        "aviso-pagamento"
    );

    const botoesContratar = document.querySelectorAll(
        ".botao-contratar"
    );

    let planoSelecionado = null;
    let elementoAnterior = null;

    // ======================================
    // ABRIR MODAL
    // ======================================

    function abrirModal(codigoPlano) {

        const plano = PLANOS[codigoPlano];

        if (!plano || !modal) {
            console.error("Plano não encontrado:", codigoPlano);
            return;
        }

        planoSelecionado = codigoPlano;

        elementoAnterior = document.activeElement;

        if (resumoPlano) {
            resumoPlano.textContent = plano.nome;
        }

        if (resumoPreco) {
            resumoPreco.textContent = formatarPreco(
                plano.preco
            );
        }

        // Reinicia o formulário a cada contratação.
        if (formulario) {
            formulario.reset();
        }

        modal.hidden = false;

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-aberto"
        );

        // O pagamento permanece bloqueado
        // até a integração com o backend.
        if (botaoFinalizar) {
            botaoFinalizar.disabled = true;
        }

        if (avisoPagamento) {
            avisoPagamento.textContent =
                "O checkout ainda está em configuração. " +
                "Nenhum pagamento será realizado nesta versão.";
        }

        // Leva o foco para o botão de fechar.
        fecharModalBotao?.focus();
    }

    // ======================================
    // FECHAR MODAL
    // ======================================

    function fecharModal() {

        if (!modal || modal.hidden) {
            return;
        }

        modal.hidden = true;

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-aberto"
        );

        planoSelecionado = null;

        // Retorna o foco ao botão utilizado.
        if (elementoAnterior instanceof HTMLElement) {
            elementoAnterior.focus();
        }
    }

    // ======================================
    // BOTÕES CONTRATAR AGORA
    // ======================================

    botoesContratar.forEach((botao) => {

        botao.addEventListener("click", () => {

            const codigoPlano = botao.dataset.plano;

            abrirModal(codigoPlano);

        });

    });

    // ======================================
    // FECHAR PELO BOTÃO X
    // ======================================

    fecharModalBotao?.addEventListener(
        "click",
        fecharModal
    );

    // ======================================
    // FECHAR CLICANDO FORA
    // ======================================

    modal?.addEventListener("click", (evento) => {

        if (evento.target === modal) {
            fecharModal();
        }

    });

    // ======================================
    // FECHAR COM ESC
    // ======================================

    document.addEventListener("keydown", (evento) => {

        if (!modal || modal.hidden) {
            return;
        }

        if (evento.key === "Escape") {
            fecharModal();
            return;
        }

        // Mantém a navegação por Tab dentro
        // da janela de contratação.
        if (evento.key === "Tab") {

            const elementos = Array.from(
                modal.querySelectorAll(
                    'button:not([disabled]), ' +
                    'input:not([disabled]), ' +
                    'textarea:not([disabled]), ' +
                    'select:not([disabled]), ' +
                    'a[href]'
                )
            ).filter((elemento) => {
                return elemento.getClientRects().length > 0;
            });

            if (!elementos.length) return;

            const primeiro = elementos[0];

            const ultimo = elementos[
                elementos.length - 1
            ];

            if (
                evento.shiftKey &&
                document.activeElement === primeiro
            ) {
                evento.preventDefault();
                ultimo.focus();
            }

            else if (
                !evento.shiftKey &&
                document.activeElement === ultimo
            ) {
                evento.preventDefault();
                primeiro.focus();
            }
        }
    });

    // ======================================
    // FORMULÁRIO DE CONTRATAÇÃO
    // ======================================

    formulario?.addEventListener(
        "submit",
        (evento) => {

            evento.preventDefault();

            // Proteção: não permite finalizar
            // enquanto o pagamento não estiver
            // configurado no servidor.
            if (!planoSelecionado) {
                return;
            }

            if (avisoPagamento) {
                avisoPagamento.textContent =
                    "O sistema de pagamento ainda não " +
                    "está disponível. Tente novamente " +
                    "quando o checkout estiver ativo.";
            }

        }
    );

    // ======================================
    // STATUS DA INTEGRAÇÃO
    // ======================================

    console.info(
        "[DevIniciante] Loja carregada com sucesso."
    );

    console.info(
        "[DevIniciante] Planos disponíveis:",
        Object.keys(PLANOS).length
    );

    console.info(
        "[DevIniciante] Checkout Mercado Pago pendente."
    );

});
