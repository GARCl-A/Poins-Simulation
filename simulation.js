import { Point } from "./point.js";

export class PointSimulation {
    constructor(canvasId, numPoints, speed, viewDistance, size) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.numPoints = numPoints;
        this.teamSize = numPoints/2;
        this.speed = speed;
        this.viewDistance = viewDistance;
        this.size = size;
        this.points = [];
        this.stoppedCount = {
            1: 0,
            2: 0,
        };
        this.state = 'created';

        this.init();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.state = 'simulating';

        for (let i = 0; i < this.numPoints; i++) {
            let team = i % 2 === 0 ? 2 : 1;
            const point = new Point(this.canvas, this, this.speed, this.viewDistance, this.size, team, i+1);
            this.points.push(point);
        }

        this.update()
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawChessboardBackground()

        this.points.forEach(point => {
            point.update(this.points);
        });

        this.displayAliveCounts(); // Mostra a quantidade de cavaleiros vivos de cada time

        this.checkIfTeamWon();
    }

    checkIfTeamWon() {
        const stopThreshold = this.teamSize; // Defina o valor limite para determinar a vitória

        // Verifica se alguma equipe atingiu o limite de parados
        for (let team in this.stoppedCount) {
            if (this.stoppedCount.hasOwnProperty(team)) {
                if (this.stoppedCount[team] >= stopThreshold) {
                    this.state = 'ended';
                    return true
                }
            }
        }

        return false
    }

    drawChessboardBackground() {
        const gridSize = 10

        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"; // Cor e transparência das linhas
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"; // Cor e transparência das linhas
            this.ctx.stroke();
        }
    }

    displayAliveCounts() {
        let aliveCounts = {
            1: this.teamSize - this.stoppedCount[1],
            2: this.teamSize - this.stoppedCount[2],
        };
    
        document.getElementById('team1Count').textContent = aliveCounts[1];
        document.getElementById('team2Count').textContent = aliveCounts[2];
    }
    
    getWinningTeam() {
        let livingTeams = [];

        for (let team in this.stoppedCount) {
            if (this.stoppedCount.hasOwnProperty(team) && this.stoppedCount[team] < this.teamSize) {
                livingTeams.push(team);
            }
        }

        if (livingTeams.length === 1) {
            return livingTeams[0];
        } else {
            return null;
        }
    }

    reset() {
        // Reinicialize aqui todos os parâmetros necessários para começar uma nova simulação
        this.stoppedCount = { 1: 0, 2: 0 };
        this.points = [];
        this.init(); // Reinicia a simulação
    }
}