export class Formations {
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');    
    }

    getBlockFormation(team, initialPosition) {
        const formationSize = team.getTeamSize();
        const characterSize = team.points[0].size;
        const gridSpacing = characterSize * 1.1; // Espaçamento do grid entre os personagens
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
    
        // Calcula o tamanho do bloco da formação na largura e altura
        const blockWidth = Math.sqrt(formationSize) * gridSpacing;
        const blockHeight = Math.ceil(formationSize / Math.sqrt(formationSize)) * gridSpacing;
    
        // Verifica se a posição inicial e o bloco inteiro cabem dentro dos limites do canvas
        if (initialPosition.x < 0 || initialPosition.x + blockWidth > canvasWidth ||
            initialPosition.y < 0 || initialPosition.y + blockHeight > canvasHeight) {
            console.error('A posição inicial ou a formação estão fora dos limites do canvas.');
            return;
        }
    
        let row = 0;
        let col = 0;
        let angle = Math.random() * Math.PI * 2;
    
        team.points.forEach((point, index) => {
            const offsetX = col * gridSpacing;
            const offsetY = row * gridSpacing;
    
            // Define a posição do ponto com base no grid
            point.x = initialPosition.x + offsetX;
            point.y = initialPosition.y + offsetY;
    
            // Define o ângulo para todos os pontos na formação
            point.angle = angle;
            point.dx = Math.cos(angle) * point.speed;
            point.dy = Math.sin(angle) * point.speed;
    
            col++; // Avança para a próxima coluna
    
            // Verifica se mudou de linha no grid
            if (col >= Math.sqrt(formationSize)) {
                col = 0;
                row++;
            }
        });
    }
}
