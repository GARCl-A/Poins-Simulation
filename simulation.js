import { Point } from "./point.js";
import { Team} from "./team.js"
import { Formations } from "./formations.js"

export class PointSimulation {
    constructor(canvasId, teamNumber, teamSize, speed, viewDistance, size) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.speed = speed;
        this.viewDistance = viewDistance;
        this.size = size;
        this.teamNumber = teamNumber;
        this.teamSize = teamSize;
        this.teams = [];
        this.points = [];
        this.state = 'created';

        this.formations = new Formations(canvasId);

        this.init();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.reset();
        this.state = 'simulating';
    
        for (let j = 0; j < this.teamNumber; j++) { // Corrigindo o laço for
            const team = new Team(j);
            this.teams.push(team);
    
            // Criar elementos HTML para exibir os contadores de equipes
            const teamCountElement = document.createElement('div');
            teamCountElement.classList.add('team');
            teamCountElement.id = `team${j + 1}`; // Usar j em vez de i
            teamCountElement.innerHTML = `<span id="team${j + 1}Count"></span>`;
            teamCountElement.style.backgroundColor = team.color;
            teamCountElement.style.color = 'white';
            
            document.getElementById('aliveCounts').appendChild(teamCountElement);
    
            for (let i = 0; i < this.teamSize; i++) {
                let pointName = `${j}-${i}`
                const point = new Point(this.canvas, this, this.speed, this.viewDistance, this.size, team, pointName);
                team.addPoint(point);
                this.points.push(point);
            }
            const position ={
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
            }

            const formationKey = Math.ceil(Object.keys(this.formations.formationsMap).length * Math.random());
            const formationId = this.formations.formationsMap[formationKey];
            this.formations.getFormation(formationId, team);
        }
        this.update()
    }
    

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawChessboardBackground()

        this.teams.forEach(team => {
            team.update(this.points);
        });

        this.displayAliveCounts(); // Mostra a quantidade de cavaleiros vivos de cada time

        this.checkIfTeamWon();
    }

    checkIfTeamWon() {
        // Verifica se apenas uma equipe está viva
        let aliveTeamsCount = 0;
        let lastAliveTeam = null;
    
        for (let i = 0; i < this.teams.length; i++) {
            const team = this.teams[i];
            if (team.stoppedCount < team.getTeamSize()) {
                aliveTeamsCount++;
                lastAliveTeam = team;
            }
        }
    
        if (aliveTeamsCount <= 1) {
            this.state = 'ended';
            return true;
        }
    
        return false;
    }

    drawChessboardBackground() {
        const gridSize = 10;
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
        this.teams.forEach((team, index) => {
            const aliveCount = team.getTeamSize() - team.stoppedCount;
            const teamCountElement = document.getElementById(`team${index + 1}Count`);
            if (teamCountElement) {
                teamCountElement.textContent = aliveCount;
            }
        });
    }
    
    getWinningTeam() {
        const livingTeams = this.teams.filter(team => team.alive === true);
    
        if (livingTeams.length === 1) {
            return livingTeams[0];
        } else if(livingTeams.length === 0){
            return new Team('Draw');
        }
    }

    reset() {
        // Reinicialize aqui todos os parâmetros necessários para começar uma nova simulação
        this.teams = [];
        this.points = [];
        const aliveCountsElement = document.getElementById('aliveCounts');
        aliveCountsElement.innerHTML = ''; // Remove todos os elementos filhos
    }

}