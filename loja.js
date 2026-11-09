"use strict";

const briefing = document.getElementById("briefing");
const form = document.getElementById("form-contratacao");
const type = document.getElementById("tipo-projeto");
const idea = document.getElementById("cliente-projeto");

if (briefing && form && type && idea) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = [
      "Olá! Gostaria de solicitar um orçamento com a DevIniciante Studio.",
      "Tipo de projeto: " + type.value,
    ];
    const description = idea.value.trim();
    if (description) message.push("Minha ideia: " + description);

    const url = new URL(form.action);
    url.searchParams.set("text", message.join("\n"));
    window.location.assign(url.href);
  });
  briefing.hidden = false;
}
