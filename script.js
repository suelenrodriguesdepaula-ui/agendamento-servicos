const SHEETDB_URL = "https://sheetdb.io/api/v1/aiayxuskwqel9";
let numeroWhatsApp = "5532999537062";

const $ = (id) => document.getElementById(id);

// Carrega dados do JSON
async function carregarDados() {
  try {
    const response = await fetch("data.json");

    if (!response.ok) {
      throw new Error(`Erro de rede: ${response.status}`);
    }

    const data = await response.json();

    // Dados da empresa
    $("titulo-empresa").innerText = data.nome;
    $("descricao-empresa").innerText = data.descricao;

    if (data.whatsapp) {
      numeroWhatsApp = data.whatsapp;
    }

    // Foto de perfil
    if (data.foto_perfil) {
      const foto = $("foto-perfil");
      if (foto) {
        foto.src = data.foto_perfil;
      }
    }

    // Serviços
    const select = $("servicos-select");

    data.servicos.forEach((servico) => {
      const option = document.createElement("option");

      option.value = `${servico.nome} (${servico.preco})`;
      option.innerText = `${servico.nome} - ${servico.preco}`;

      select.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar os dados:", erro);
  }
}

// WhatsApp
function abrirWhatsApp(mensagem) {
  const texto = encodeURIComponent(mensagem);

  const mobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const url = mobile
    ? `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${texto}`
    : `https://web.whatsapp.com/send?phone=${numeroWhatsApp}&text=${texto}`;

  window.open(url, "_blank");
}

// Formulário de agendamento
$("agendamento-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = $("cliente-nome").value;
  const servico = $("servicos-select").value;
  const data = $("agendamento-data").value;
  const hora = $("agendamento-hora").value;

  try {
    await fetch(SHEETDB_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [{ nome, servico, data, hora }],
      }),
    });

    console.log("Agendamento registrado com sucesso!");
  } catch (erro) {
    console.error("Erro ao enviar dados para a planilha:", erro);
  }

  const mensagem =
    `Olá, Professor(a)! Gostaria de agendar uma aula.\n\n` +
    `🎓 *Aluno(a):* ${nome}\n` +
    `📚 *Disciplina/Aulas:* ${servico}\n` +
    `📅 *Data Pretendida:* ${data}\n` +
    `⏰ *Horário Pretendido:* ${hora}`;

  abrirWhatsApp(mensagem);
});

// Botão Fale Conosco
$("btn-whatsapp").addEventListener("click", () => {
  abrirWhatsApp(
    "Olá! Gostaria de tirar algumas dúvidas sobre as aulas particulares."
  );
});

carregarDados();