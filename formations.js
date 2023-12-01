export class Formations {
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.formationsMap = {
            1: 'none',
            2: 'block',
            3: 'triangle',
        }    
    }

    getFormation(formationId, team) {
        if (formationId === 'none') {
            return;
        } else if (formationId === 'block') {
            this.generateFormation(team, this.generateBlockFormation.bind(this));
        } else if (formationId === 'triangle') {
            this.generateFormation(team, this.generateTriangleFormation.bind(this));
        }
    }

    generateFormation(team, formationFunction) {
        const formationSize = team.getTeamSize();
        const characterSize = team.points[0].size;
        const gridSpacing = characterSize * 1.1; // Espaçamento do grid entre os personagens
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const initialPosition = this.findValidInitialPosition(team);

        formationFunction(team, formationSize, gridSpacing, canvasWidth, canvasHeight, initialPosition);
    }

    generateBlockFormation(team, formationSize, gridSpacing, canvasWidth, canvasHeight, initialPosition) {
        const blockWidth = Math.sqrt(formationSize) * gridSpacing;
        const blockHeight = Math.ceil(formationSize / Math.sqrt(formationSize)) * gridSpacing;

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
            point.dx = Math.cos(angle);
            point.dy = Math.sin(angle);

            col++; // Avança para a próxima coluna
    
            // Verifica se mudou de linha no grid
            if (col >= Math.sqrt(formationSize)) {
                col = 0;
                row++;
            }
        });
    }

    generateTriangleFormation(team, formationSize, gridSpacing, canvasWidth, canvasHeight, initialPosition) {
        const numRows = Math.ceil(Math.sqrt(formationSize * 2));

        if (
            initialPosition.x < 0 ||
            initialPosition.x + gridSpacing * (numRows - 1) > canvasWidth ||
            initialPosition.y < 0 ||
            initialPosition.y + gridSpacing * (numRows - 1) > canvasHeight
        ) {
            console.error("A posição inicial ou a formação estão fora dos limites do canvas.");
            return;
        }
    
        let count = 0;
        let angle = Math.random() * Math.PI * 2;
    
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j <= i; j++) {
                if (count >= formationSize) {
                    return;
                }
    
                const offsetX = j * gridSpacing;
                const offsetY = i * gridSpacing;
    
                const xPos = initialPosition.x + offsetX;
                const yPos = initialPosition.y + offsetY;
    
                if (xPos >= 0 && xPos < canvasWidth && yPos >= 0 && yPos < canvasHeight) {
                    team.points[count].x = xPos;
                    team.points[count].y = yPos;
                    team.points[count].angle = angle;
                    team.points[count].dx = Math.cos(angle);
                    team.points[count].dy = Math.sin(angle);
                    count++;
                }
            }
        }
    }
    
    findValidInitialPosition(team, maxAttempts = 100) {
        const formationSize = team.getTeamSize();
        const characterSize = team.points[0].size;
        const gridSpacing = characterSize * 1.1; // Espaçamento do grid entre os personagens
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        let attempts = 0;

        while (attempts < maxAttempts) {
            const initialPosition = {
                x: Math.random() * (canvasWidth - gridSpacing * Math.sqrt(formationSize)),
                y: Math.random() * (canvasHeight - gridSpacing * Math.ceil(formationSize / Math.sqrt(formationSize)))
            };

            if (
                initialPosition.x >= 0 &&
                initialPosition.x + gridSpacing * Math.sqrt(formationSize) <= canvasWidth &&
                initialPosition.y >= 0 &&
                initialPosition.y + gridSpacing * Math.ceil(formationSize / Math.sqrt(formationSize)) <= canvasHeight
            ) {
                return initialPosition;
            }

            attempts++;
        }

        console.error('Não foi possível encontrar uma posição inicial adequada.');
        return {x: this.canvas.width/2, y: this.canvas.height/2};
    }
}
