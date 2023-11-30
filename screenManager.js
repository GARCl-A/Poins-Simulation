import { PointSimulation } from './simulation.js';
import {TeamColors} from "./team.js"

export class ScreenManager {
    constructor(canvasId, numPoints, speed, viewDistance, pointSize) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.simulation = new PointSimulation(canvasId, numPoints, speed, viewDistance, pointSize);

        this.backToConfigButton = document.getElementById('backToConfigButton');
        this.restartButton = document.getElementById('restartButton');
        this.overlay = document.getElementById('overlay');
        this.resultText = document.getElementById('resultText');

        this.resizeCanvas(); // Chama a função de redimensionamento do canvas quando a página é carregada

        // Event listener para o redimensionamento da janela
        window.addEventListener('resize', () => {
            this.resizeCanvas(); // Chama a função de redimensionamento do canvas
        });

        // Event listener para o botão de reinício
        restartButton.addEventListener('click', () => {
            this.simulation.reset(); // Método de reset na simulação
            this.overlay.style.display = 'none'; // Oculta o overlay novamente
        });

        // Event listener para o botão de reinício
        backToConfigButton.addEventListener('click', () => {
            this.goToConfig(); // Método de reset na simulação
        });

        this.init()
    }

    init(){
        this.update();
    }

    update() {
        this.simulation.update();
        if(this.simulation.state == 'ended') {
            this.displayRestartButton();
        };
        if(this.simulation.state == 'simulating') {
            this.hideRestartButton();
        };
        requestAnimationFrame(() => this.update());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth; // Define a largura do canvas como a largura da janela
        this.canvas.height = window.innerHeight; // Define a altura do canvas como a altura da janela
    }

    getContext() {
        return this.ctx;
    }

    // Quando a simulação acabar, exiba o botão de reinício
    displayRestartButton() {
        const winnerTeam = this.simulation.getWinningTeam();
        // Exibe o texto da vitória
        this.resultText.textContent = `Team ${winnerTeam} won!`;
        this.resultText.style.color = '#fff';
        // Exibe a sobreposição (overlay)
        this.overlay.style.display = 'block';
        this.overlay.style.backgroundColor = TeamColors[winnerTeam]['color'];
    }

    hideRestartButton(){
        this.overlay.style.display = 'none';
    }

    goToConfig() {
        document.getElementById('simulationContainer').style.display = 'none';
        document.getElementById('configPanel').style.display = 'block';
    }
}
