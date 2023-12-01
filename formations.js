export class Formations {
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');    
    }

    getBlockFormation(team, initialPosition){
        const formationSize = team.getTeamSize();
        const characterSize = team.points[0].size;
        const angle = Math.random() * Math.PI * 2;
        //Simula um grid em que cada quadrado tem tamanho igual a (characterSize * 1.1)
        //Verifica se o grid cabe na tela a partir da posição inicial.
        team.points.forEach(point => {
            //define point.x e point.y a fim de montar um quadrado ao redor da posição inicial
            //define point.angle = angle
        });
    }

    getBlockFormation(team, initialPosition) {
        const formationSize = team.getTeamSize();
        const characterSize = team.points[0].size;
        const gridSpacing = characterSize * 1.1; // Espaçamento do grid entre os personagens
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        let row = 0;
        let col = 0;
        let angle = Math.random() * Math.PI * 2;
    
        team.points.forEach((point, index) => {
            const offsetX = col * gridSpacing;
            const offsetY = row * gridSpacing;
            
            // Define a posição do ponto com base no grid
            point.x = initialPosition.x + offsetX;
            point.y = initialPosition.y + offsetY;
    
            // Verifica se o ponto está fora dos limites do canvas e ajusta se necessário
            while ((point.x < 0 || point.x > canvasWidth || point.y < 0 || point.y > canvasHeight) && 
            !(point.x < 0 && point.x > canvasWidth && point.y < 0 && point.y > canvasHeight)) {
                // Caso o ponto esteja fora dos limites, reinicia a posição
                if (col >= Math.sqrt(formationSize)) {
                    row++;
                } else {
                    col++;
                }
                point.x = col * gridSpacing;
                point.y = row * gridSpacing;
            }
    
            // Define o ângulo para todos os pontos na formação
            point.angle = angle;
    
            col++; // Avança para a próxima coluna
    
            // Verifica se mudou de linha no grid
            if (col >= Math.sqrt(formationSize)) {
                col = 0;
                row++;
            }
        });
    }
    
}
