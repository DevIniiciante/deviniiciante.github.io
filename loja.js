
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ==========================================
    // DEVINICIANTE STUDIO
    // ORÇAMENTOS PERSONALIZADOS
    // ==========================================

    const WHATSAPP = "5561993257747";

    const SERVICOS = {
        personalizado: {
            nome: "Site Personalizado",
            preco: "Sob orçamento"
        }
    };

    // ==========================================
    // ÍCONES
    // ==========================================

    if (window.lucide) {
        window.lucide.createIcons();
    }

    // ==========================================
    // MENU ATIVO AO ROLAR
    // ==========================================

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

    // ==========================================
    // FORMULÁRIO
    // ==========================================

    const modal = document.getElementById(
        "modal-contratacao"
    );

    const formulario = document.getElementById(
        "form-contratacao"
    );

    const campoNome = document.getElementById(
        "cliente-nome"
    );

    const campoEmail = document.getElementById(
        "cliente-email"
    );

    const campoWhatsapp = document.getElementById(
        "cliente-whatsapp"
    );

    const campoProjeto = document.getElementById(
        "cliente-projeto"
    );

    const campoTermos = document.getElementById(
        "aceite-termos"
    );

    const resumoPlano = document.getElementById(
        "resumo-plano"
    );

    const resumoPreco = document.getElementById(
        "resumo-preco"
    );

    const botaoFinalizar = document.getElementById(
        "botao-finalizar"
    );

    const aviso = document.getElementById(
        "aviso-pagamento"
    );

    let servicoSelecionado = null;
    let focoAnterior = null;

    // ==========================================
    // ABRIR MODAL
    // ==========================================

    function abrirModal(idServico) {
        const servico = SERVICOS[idServico];

        if (!servico || !modal || !formulario) {
            console.error(
                "Não foi possível abrir o formulário."
            );
            return;
        }

        servicoSelecionado = idServico;
        focoAnterior = document.activeElement;

        formulario.reset();

        resumoPlano.textContent = servico.nome;
        resumoPreco.textContent = servico.preco;

        if (aviso) {
            aviso.textContent =
                "Esta é apenas uma solicitação de orçamento. " +
                "Nenhum pagamento será realizado agora.";
        }

        if (botaoFinalizar) {
            botaoFinalizar.disabled = false;
        }

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        campoNome?.focus();
    }

    // ==========================================
    // FECHAR MODAL
    // ==========================================

    function fecharModal() {
        if (!modal) return;

        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        if (focoAnterior?.focus) {
            focoAnterior.focus();
        }
    }

    // ==========================================
    // BOTÃO SOLICITAR ORÇAMENTO
    // ==========================================

    document.querySelectorAll(
        ".botao-contratar"
    ).forEach((botao) => {
        botao.addEventListener("click", () => {
            abrirModal(botao.dataset.plano);
        });
    });

    // ==========================================
    // FECHAMENTO DO MODAL
    // ==========================================

    if (modal) {
        modal.querySelectorAll(
            "[data-fechar-modal]"
        ).forEach((botao) => {
            botao.addEventListener(
                "click",
                fecharModal
            );
        });

        modal.addEventListener("click", (evento) => {
            if (evento.target === modal) {
                fecharModal();
            }
        });
    }

    // ==========================================
    // ACESSIBILIDADE
    // ==========================================

    document.addEventListener("keydown", (evento) => {
        if (!modal || modal.hidden) return;

        if (evento.key === "Escape") {
            fecharModal();
            return;
        }

        if (evento.key !== "Tab") return;

        const elementos = [
            ...modal.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
            )
        ].filter((elemento) => {
            return elemento.getClientRects().length > 0;
        });

        if (!elementos.length) return;

        const primeiro = elementos[0];
        const ultimo = elementos[elementos.length - 1];

        if (
            evento.shiftKey &&
            document.activeElement === primeiro
        ) {
            evento.preventDefault();
            ultimo.focus();
        } else if (
            !evento.shiftKey &&
            document.activeElement === ultimo
        ) {
            evento.preventDefault();
            primeiro.focus();
        }
    });

    // ==========================================
    // MÁSCARA DE WHATSAPP
    // ==========================================

    if (campoWhatsapp) {
        campoWhatsapp.addEventListener("input", () => {
            const numeros = campoWhatsapp.value
                .replace(/\D/g, "")
                .slice(0, 11);

            if (numeros.length <= 2) {
                campoWhatsapp.value = numeros;

            } else if (numeros.length <= 7) {
                campoWhatsapp.value =
                    `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;

            } else if (numeros.length <= 10) {
                campoWhatsapp.value =
                    `(${numeros.slice(0, 2)}) ` +
                    `${numeros.slice(2, 6)}-${numeros.slice(6)}`;

            } else {
                campoWhatsapp.value =
                    `(${numeros.slice(0, 2)}) ` +
                    `${numeros.slice(2, 7)}-${numeros.slice(7)}`;
            }
        });
    }

    // ==========================================
    // ENVIAR PEDIDO DE ORÇAMENTO
    // ==========================================

    if (formulario) {
        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault();

            if (!formulario.reportValidity()) {
                return;
            }

            if (!servicoSelecionado) {
                alert("Selecione um serviço.");
                return;
            }

            if (!campoTermos.checked) {
                alert(
                    "Confirme a autorização de envio dos dados."
                );
                campoTermos.focus();
                return;
            }

            const nome = campoNome.value.trim();
            const email = campoEmail.value.trim();
            const whatsappCliente =
                campoWhatsapp.value.trim();
            const projeto = campoProjeto.value.trim();

            const numerosCliente = whatsappCliente.replace(
                /\D/g,
                ""
            );

            if (
                numerosCliente.length < 10 ||
                numerosCliente.length > 11
            ) {
                alert(
                    "Digite um WhatsApp válido com DDD."
                );
                campoWhatsapp.focus();
                return;
            }

            if (projeto.length < 10) {
                alert(
                    "Descreva um pouco mais sobre seu projeto."
                );
                campoProjeto.focus();
                return;
            }

            const servico = SERVICOS[servicoSelecionado];

            const mensagem = [
                "Olá! Gostaria de solicitar um orçamento na *DevIniciante Studio*.",
                "",
                "━━━━━━━━━━━━━━━━",
                "*NOVO PEDIDO DE ORÇAMENTO*",
                "━━━━━━━━━━━━━━━━",
                "",
                `*Serviço:* ${servico.nome}`,
                "*Valor:* A definir após análise",
                "",
                "*DADOS DO CLIENTE*",
                `*Nome:* ${nome}`,
                `*E-mail:* ${email}`,
                `*WhatsApp:* ${whatsappCliente}`,
                "",
                "*DESCRIÇÃO DO PROJETO*",
                projeto,
                "",
                "Gostaria de conversar sobre as possibilidades, valores e prazo de desenvolvimento."
            ].join("\n");

            const url =
                `https://wa.me/${WHATSAPP}?text=` +
                encodeURIComponent(mensagem);

            window.location.href = url;
        });
    }

    console.log(
        "DevIniciante Studio | Sistema de orçamentos iniciado"
    );
});
