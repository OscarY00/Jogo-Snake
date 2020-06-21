document.onkeydown = onKD;

//CANVAS
var canvas = document.getElementById("tela");
var context = canvas.getContext("2d");

var btPausa = document.getElementById("btPausa");
var sndcomer1 = document.getElementById("comer1");
var sndcomer2 = document.getElementById("comer2");
var sndgameover = document.getElementById("gameover");
var point = document.getElementById("score");
var life = document.getElementById("vidas");
//Estado do jogo
var rodando = false;
var xfruta;
var yfruta;
var relogio;
var intervalo ; // Velocidade
var rotacao = 0;
var proxDirec = new Array();
proxDirec.length = 0;
var fruta = 10;
var pontos;
var vida;
var record;
var records = [];
const localStorageKey = 'point_list'

//Informações sobre o tabuleiro
var nx = 0;//Número de quadros em x
var ny = 0;//Número de quadros em y
var largura = 20;//Largura dos quadros
var distancia = 0;//Distância dos quadros
var borda_x, borda_y;//Posição das bordas

var gameoverimg = new Image();
gameoverimg.src = "imagens/gameOver.gif";

//Array contendo todos os nodos da Snake
var nodos = new Array();
nodos.length = 0;

//Inicialização
criarTabuleiro();
record = localStorage.getItem("record");
if(record==null){
    record=0;
}
novoJogo();

function loopPrincipal() {
    //atualizar valores 
    moverSnake();
    detectarColisoes();
    desenhar();
    
}

function criarTabuleiro(){
    nx = Math.floor((canvas.width - distancia)/(largura + distancia));
    ny = Math.floor((canvas.height - distancia)/(largura + distancia));
    borda_x = nx * (distancia + largura) + distancia;
    borda_y = ny * (distancia + largura) + distancia;
}
                    

    
function desenhar() {
    var xi, yi;

if (rodando) {
    //Limpar a tela
    context.clearRect(0,0,canvas.width, canvas.height);
   
    //Desenhar bordas
    context.fillStyle = "#fff";
    context.fillRect(borda_x,0, canvas.width -1, canvas.height - 1);
    context.fillRect(0,borda_y, canvas.width -1, canvas.height - 1);
    
    
    
    //Desenhar a Snake
    context.fillStyle = "#fff";
    for (i=0; i< nodos.length; i++) {
        xi = distancia + nodos[i].x * (largura + distancia);
        yi = distancia + nodos[i].y * (largura + distancia);
        context.fillRect(xi, yi, largura, largura);
    }    

    
    //Desenhar a fruta
 context.fillStyle = "#fff";
		xi = distancia + (xfruta * (largura + distancia)) + (largura / 2);
		yi = distancia + (yfruta * (largura + distancia)) + (largura / 2);

		xi = distancia + (xfruta * (largura + distancia));
		yi = distancia + (yfruta * (largura + distancia));
        context.fillRect(xi, yi, largura, largura);
}
}

function pausa() {
    rodando = !rodando;
    if (rodando) {
        btPausa.innerHTML = "PAUSA";
        relogio = setInterval("loopPrincipal()", intervalo);
    } else {
        clearInterval(relogio);
        btPausa.innerHTML = "CONTINUAR";
    }
    proxDirec.length = 0;
}

function moverSnake() {
    
    for (i = nodos.length - 1; i > 0; i--) {
        nodos[i].x = nodos[i-1].x;
        nodos[i].y = nodos[i-1].y;
        nodos[i].direc = nodos[i-1].direc;
    }
     
    if (proxDirec.length > 0 )
        if(nodos[0].direc != proxDirec[0] && vTecla() == false)
            nodos[0].direc = proxDirec[0];
    nodos[0].Mover();

    while (proxDirec.length > 0) {
        if (proxDirec[0] == nodos[0].direc || vTecla() == true)
            proxDirec.shift();
        else 
            break;
    }
}

function continuarJogo() {
    intervalo = 250;
    
    if (rodando)
		pausa();
	xfruta = nx -1;
	yfruta = ny -1;
	
	var xcenter = Math.floor(nx / 2);
	var ycenter = Math.floor(ny / 2);
	nodos.length=0;
	nodos.push(new Nodo(xcenter, ycenter + 1, dbaixo));
	nodos.push(new Nodo(xcenter, ycenter, dbaixo));
	nodos.push(new Nodo(xcenter, ycenter - 1, dbaixo));
	btPausa.innerHTML = "CONTINUAR";
	btPausa.disabled = false;
    rodando = true;
	desenhar();
    rodando = false;
}


function novoJogo(){
    pontos = 0;
    point.innerHTML = score = 0;
    intervalo = 250;
    life.innerHTML = vidas = 3;
    
    
if (rodando)
		pausa();
	xfruta = nx -1;
	yfruta = ny -1;
	
	var xcenter = Math.floor(nx / 2);
	var ycenter = Math.floor(ny / 2);
	nodos.length=0;
	nodos.push(new Nodo(xcenter, ycenter + 1, dbaixo));
	nodos.push(new Nodo(xcenter, ycenter, dbaixo));
	nodos.push(new Nodo(xcenter, ycenter - 1, dbaixo));
	btPausa.innerHTML = "INICIAR";
	btPausa.disabled = false;
    rodando = true;
	desenhar();
    rodando = false;
}



function detectarColisoes() {
    
    if (nodos[0].x < 0) {
        nodos[0].x = nx;   
    } else if (nodos[0].y < 0) {
        nodos[0].y = ny;   
    } else if (nodos[0].x >= nx) {
        nodos[0].x = 0;   
    } else if (nodos[0].y >= ny) {
        nodos[0].y = 0;   
    }
    
    for (i = 1; i < nodos.length; i++) {
        if((nodos[0].x == nodos[i].x) && (nodos[0].y == nodos[i].y)) {
           if(life.innerHTML > 0){
            life.innerHTML -= 1;
            continuarJogo();
           }else {
                executarGameOver();
                
            
           } 
        }
    }

         if ((nodos[0].x == xfruta) && (nodos[0].y == yfruta)) 
         
    
    {

		var ultimo = nodos.length -1;
		nodos.push(new Nodo(nodos[ultimo].x, nodos[ultimo].y, nodos[ultimo].direc));
				var novoultimo = ultimo + 1;
				switch (nodos[ultimo].direc) {
		case dbaixo:
				nodos[novoultimo].y -= 1;
				break;
				case ddireita:
				nodos[novoultimo].x -= 1;
				break;
				case dcima:
				nodos[novoultimo].y += 1;
				break;
				case desquerda:
				nodos[novoultimo].x += 1;
				break;
		}
        pontosNormais();
		novaPosFruta();
        velocidade();
	}

}

function executarGameOver() {
    records = JSON.parse(localStorage.getItem('records') || '[]');
    localStorage.setItem("record",this.score);
    
                record = this.score;
                records.push(record);

                records.sort(function(a, b) {
                    return a - b;
                  });
                records.reverse();
                
                records = records.slice(0, 5);

    localStorage.setItem("records", JSON.stringify(records));

    btPausa.disabled = true;
    if (rodando)
        pausa();
    FimJogo();
}           
      
function populateTable() {
    let tbody = getTbody();

    records.forEach(function(records) {
        let newLine = createNewLine();
        tbody.appendChild(newLine);
        createNewTd(newLine, records);
        
    });
}

function createNewLine() {
    return document.createElement('tr');
}

function createNewTd(row, score) {
    let newElement = document.createElement('td');
    newElement.innerHTML =  score;
    row.appendChild(newElement);
}
function getTbody() {
    let table = document.getElementById('tabela_pontos');
    return table.tBodies[0];
}

function clearTable() {
    let tbody = getTbody();
    tbody.innerHTML = '';
}

function vTecla() {
    if ((nodos[0].direc == ddireita) && (proxDirec[0] == desquerda)) {
        return true;
    }
    if ((nodos[0].direc == desquerda) && (proxDirec[0] == ddireita)) {
        return true;
    }    
    if ((nodos[0].direc == dcima) && (proxDirec[0] == dbaixo)) {
        return true;
    }    
    if ((nodos[0].direc == dbaixo) && (proxDirec[0] == dcima)) {
        return true;
    }    
    return false;    
}

function onKD(evt) {
    switch(evt.keyCode) {
        case 65://esquerda
            //nodos[0].direc = desquerda;
            proxDirec.push(desquerda);
            break;
        case 87://cima
            //nodos[0].direc = dcima;
            proxDirec.push(dcima);
            break;
        case 68://direita
            //nodos[0].direc = ddireita;
            proxDirec.push(ddireita);
            break;
        case 83://baixo
            //nodos[0].direc = dbaixo;
            proxDirec.push(dbaixo);
            break;
        case 80://teclado espaço == pausa
            pausa();
        break;
        case 78: //teclado N == novo
            novoJogo();
        break;
    }
}

function pontosNormais() {
    score += fruta;
}

function velocidade(){
    intervalo = intervalo - 5;
    clearInterval(relogio);
    relogio = setInterval("loopPrincipal()",intervalo);
}


function novaPosFruta() {//Determinar uma nova posição para a fruta
    do {
        xfruta = Math.floor(Math.random() * nx);
        yfruta = Math.floor(Math.random() * ny);
    } while (colisaoFruta() == true);
    point.innerHTML = score;
}

function colisaoFruta() {//Verificar se a posição da fruta colide com o corpo da snake
    for (i = 0; i < nodos.length; i++) {
        if((xfruta == nodos[i].x) && (yfruta == nodos[i].y))
            return true;
    }
    return false;
}

// Fim de jogo
function FimJogo() {
    context.drawImage(gameoverimg, 80, 80);
    clearTable();
    populateTable();
}