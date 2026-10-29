const equipes = [
	{ nome: "Nordeste Camp", jogos: 0, vitorias: 0, empates: 0, derrotas: 0, pontos: 0 },
	{ nome: "Sertão Fighters", jogos: 0, vitorias: 0, empates: 0, derrotas: 0, pontos: 0 },
	{ nome: "Bahia Titans", jogos: 0, vitorias: 0, empates: 0, derrotas: 0, pontos: 0 },
	{ nome: "Agreste Force", jogos: 0, vitorias: 0, empates: 0, derrotas: 0, pontos: 0 },
];

const partidas = [
	document.getElementById("match-1"),
	document.getElementById("match-2"),
	document.getElementById("match-3"),
	document.getElementById("match-4"),
	document.getElementById("match-5"),
	document.getElementById("match-6"),
];

function buscarEquipe(nomeEquipe) {
	for (const equipe of equipes) {
		if (equipe.nome === nomeEquipe) {
			return equipe;
		}
	}
	return null;
}

function calcularMedia(pontos, jogos) {
	if (jogos === 0) {
		return 0;
	}
	return pontos / jogos;
}

function definirClassificacao(vitorias) {
	if (vitorias >= 4) {
		return "Campeã";
	} else if (vitorias >= 2) {
		return "Competitiva";
	} else {
		return "Em treinamento";
	}
}

function calcularResultado(placarEquipe, placarAdversario) {
	if (placarEquipe > placarAdversario) {
		return "vitoria";
	} else if (placarEquipe < placarAdversario) {
		return "derrota";
	} else {
		return "empate";
	}
}

function atualizarClassificacao() {
	const equipeNordeste = buscarEquipe("Nordeste Camp");
	let placaresInformados = 0;

	for (let indice = 0; indice < partidas.length; indice += 1) {
		const partida = partidas[indice];

		if (partida === null) {
			continue;
		}

		const placarEquipe = Number(partida.dataset.teamScore);
		const placarAdversario = Number(partida.dataset.opponentScore);
		const adversario = buscarEquipe(partida.dataset.opponentTeam);
		const resultado = calcularResultado(placarEquipe, placarAdversario);
		const textoResultado = document.getElementById(`match-${indice + 1}-result`);

		placaresInformados += 1;
		equipeNordeste.jogos += 1;
		adversario.jogos += 1;

		if (resultado === "vitoria") {
			equipeNordeste.vitorias += 1;
			equipeNordeste.pontos += 3;
			adversario.derrotas += 1;
			textoResultado.textContent = "Vitória: 3 pontos";
			textoResultado.classList.add("bg-emerald-950/70", "text-emerald-100");
		} else if (resultado === "derrota") {
			equipeNordeste.derrotas += 1;
			adversario.vitorias += 1;
			adversario.pontos += 3;
			textoResultado.textContent = "Derrota: 0 pontos";
			textoResultado.classList.add("bg-rose-950/70", "text-rose-100");
		} else {
			equipeNordeste.empates += 1;
			equipeNordeste.pontos += 1;
			adversario.empates += 1;
			adversario.pontos += 1;
			textoResultado.textContent = "Empate: 1 ponto";
			textoResultado.classList.add("bg-amber-950/70", "text-amber-100");
		}
	}

	const corpoTabela = document.getElementById("team-standings");
	for (let indice = 0; indice < equipes.length; indice += 1) {
		const equipe = equipes[indice];
		const linha = corpoTabela.rows[indice];
		linha.cells[1].textContent = equipe.jogos;
		linha.cells[2].textContent = equipe.vitorias;
		linha.cells[3].textContent = equipe.empates;
		linha.cells[4].textContent = equipe.derrotas;
		linha.cells[5].textContent = equipe.pontos;
		linha.cells[0].getElementsByTagName("span")[0].textContent =
			`${equipe.jogos}J · ${equipe.vitorias}V · ${equipe.empates}E · ${equipe.derrotas}D`;
	}

	const resultadoIndividual = document.getElementById("solo-result");
	document.getElementById("reported-fixtures").textContent = placaresInformados;
	document.getElementById("team-points").textContent = equipeNordeste.pontos;
	document.getElementById("team-wins").textContent = equipeNordeste.vitorias;
	document.getElementById("team-matches").textContent = equipeNordeste.jogos;
	document.getElementById("team-average").textContent = calcularMedia(equipeNordeste.pontos, equipeNordeste.jogos).toFixed(1);
	document.getElementById("team-classification").textContent = definirClassificacao(equipeNordeste.vitorias);
	document.getElementById("solo-points").textContent = resultadoIndividual.dataset.points;
	document.getElementById("solo-wins").textContent = resultadoIndividual.dataset.wins;
	document.getElementById("solo-matches").textContent = resultadoIndividual.dataset.matches;

	console.log("Partidas consideradas:", placaresInformados);
	console.log("Pontos do Nordeste Camp:", equipeNordeste.pontos);
	console.log("Classificação do Nordeste Camp:", definirClassificacao(equipeNordeste.vitorias));
}

function filtrarCompeticoes() {
	const campoBusca = document.getElementById("competition-search");
	const filtroModalidade = document.getElementById("competition-mode");
	const filtroJogo = document.getElementById("competition-game");
	const filtroSituacao = document.getElementById("competition-status");
	const listaCompeticoes = document.getElementById("competition-list");
	const termoBusca = campoBusca.value.trim().toLowerCase();
	let quantidadeVisivel = 0;

	for (let indice = 0; indice < listaCompeticoes.children.length; indice += 1) {
		const competicao = listaCompeticoes.children[indice];
		const combinaBusca = competicao.dataset.search.toLowerCase().includes(termoBusca);
		const combinaModalidade = filtroModalidade.value === "all" || competicao.dataset.mode === filtroModalidade.value;
		const combinaJogo = filtroJogo.value === "all" || competicao.dataset.game === filtroJogo.value;
		const combinaSituacao = filtroSituacao.value === "all" || competicao.dataset.status === filtroSituacao.value;
		const mostrarCompeticao = combinaBusca && combinaModalidade && combinaJogo && combinaSituacao;

		competicao.hidden = !mostrarCompeticao;
		if (mostrarCompeticao) {
			quantidadeVisivel += 1;
		}
	}

	document.getElementById("competition-count").textContent = quantidadeVisivel;
	document.getElementById("competition-empty").classList.toggle("hidden", quantidadeVisivel !== 0);
	console.log("Competições encontradas:", quantidadeVisivel);
}

if (document.getElementById("team-standings")) {
	atualizarClassificacao();
}

const formularioFiltros = document.getElementById("competition-filters");
if (formularioFiltros) {
	formularioFiltros.addEventListener("submit", function (evento) {
		evento.preventDefault();
	});
	formularioFiltros.addEventListener("input", filtrarCompeticoes);
	formularioFiltros.addEventListener("change", filtrarCompeticoes);
	filtrarCompeticoes();
}