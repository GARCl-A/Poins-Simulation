import { Team } from "./team.js"

export class Point {
    constructor(canvas, simulation, speed, viewDistance, size, team, name) {
        this.name = name;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.simulation = simulation;
        this.speed = speed;
        this.viewDistance = viewDistance;
        this.stopped = false;
        this.size = size;
        this.team = team;
        this.hp = 3;

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        const angle = Math.random() * Math.PI * 2;
        this.dx = Math.cos(angle) * this.speed;
        this.dy = Math.sin(angle) * this.speed;

        this.angle = Math.atan2(this.dy, this.dx);
        this.characterImage = new Image();
        this.characterImage.src = 'characterImage.png';
    }

    update(points) {
        if (!this.stopped) {
            this.getClosestPoint(points);
            this.move();
            this.checkCollision(points);
            this.drawView();
            this.drawText();
            this.drawSelf();
        }
    }

    move(){
        const halfSize = this.size / 2;
    
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        
        // Verifica colisões com as paredes
        if (this.x - halfSize < 0) {
            this.x = halfSize;
            this.dx *= -1;
            this.angle = Math.atan2(this.dy, this.dx); // Redefine o ângulo para refletir a nova direção
        }
        if (this.x + halfSize > this.canvas.width) {
            this.x = this.canvas.width - halfSize;
            this.dx *= -1;
            this.angle = Math.atan2(this.dy, this.dx); // Redefine o ângulo para refletir a nova direção
        }
        if (this.y - halfSize < 0) {
            this.y = halfSize;
            this.dy *= -1;
            this.angle = Math.atan2(this.dy, this.dx); // Redefine o ângulo para refletir a nova direção
        }
        if (this.y + halfSize > this.canvas.height) {
            this.y = this.canvas.height - halfSize;
            this.dy *= -1;
            this.angle = Math.atan2(this.dy, this.dx); // Redefine o ângulo para refletir a nova direção
        }

        this.speed += 0.01;
    }
    

    getDistance(point) {
        return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
    }

    checkCollision(points){
        points.forEach(otherPoint => {
            if (otherPoint !== this && !otherPoint.stopped && otherPoint.team.teamId !== this.team.teamId) {
                const distance = this.getDistance(otherPoint);
                if (distance < this.size) {
                    this.collide(otherPoint);
                }
            }
        });
    }

    getClosestPoint(points) {
        const visiblePoints = points.filter(otherPoint => 
            otherPoint !== this &&
            !otherPoint.stopped &&
            this.getDistance(otherPoint) < this.viewDistance &&
            this.team.teamId !== otherPoint.team.teamId
            );
      
        if (visiblePoints.length > 0) {
            let closestDistance = this.getDistance(visiblePoints[0]);
            let closestPoint = visiblePoints[0];

            visiblePoints.forEach(point => {
                const distance = this.getDistance(point);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPoint = point;
                    this.speed += 0.01
                }
            });

            const angle = Math.atan2(closestPoint.y - this.y, closestPoint.x - this.x);
            this.dx = Math.cos(angle);
            this.dy = Math.sin(angle);
            this.angle = Math.atan2(this.dy, this.dx);
        }
    }

    drawView(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.viewDistance, 0, Math.PI * 2);
        this.ctx.strokeStyle = "rgba(0, 0, 255, 0.05)";
        this.ctx.stroke();
    }
    
    drawSelf() {
        const halfSize = this.size / 2;
        
        // Calcula o ângulo da rotação
        const angle = Math.atan2(this.dy, this.dx);
        
        this.ctx.save(); // Salva o estado atual do contexto
        
        // Translada e rotaciona o contexto para desenhar a imagem
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(angle - Math.PI / 2);
        
        // Desenha a imagem original do personagem
        this.ctx.drawImage(this.characterImage, -halfSize, -halfSize, this.size, this.size);
        
        // Aplica uma cor sobre a imagem sem substituir completamente a cor original
        this.ctx.globalCompositeOperation = 'color'; // Define a operação de composição como 'color blending'
        this.ctx.fillStyle = this.team.color; // Cor da máscara
        this.ctx.globalAlpha = 0.2; // Ajusta o valor alpha para controlar a transparência da cor (variando de 0 a 1)
        this.ctx.beginPath();
        this.ctx.arc(0, 0, halfSize, 0, Math.PI * 2); // Desenha um círculo
        this.ctx.closePath();
        this.ctx.fill();

        // Restaura o estado anterior do contexto
        this.ctx.globalCompositeOperation = 'source-over'; // Retorna à operação de composição padrão
        this.ctx.globalAlpha = 1; // Retorna ao valor alpha padrão
        this.ctx.restore();
    }
    
    drawText(){
        const halfSize = this.size / 2;

        const originalLineWidth = this.ctx.lineWidth;
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "white"; // Definindo a cor do texto como branco
        this.ctx.strokeStyle = "black"; // Definindo a cor do contorno como preto
        this.ctx.lineWidth = 3; // Espessura do contorno
        
        // Posicionando o texto no centro do cavaleiro
        this.ctx.strokeText(`${this.name}`, this.x, this.y - this.size/2);
        this.ctx.fillText(`${this.name}`, this.x, this.y - this.size/2);
        this.ctx.lineWidth = originalLineWidth;

        // Exibe a velocidade na parte de trás do cavaleiro
        this.ctx.font = "14px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(`${this.speed.toFixed(2)}`, this.x - 20, this.y + 20);

        // Exibe o hp na parte de trás do cavaleiro
        this.ctx.font = "14px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(`${this.hp.toFixed(2)}`, this.x - 20, this.y + 40);
    }

    collide(otherPoint){
        this.strike(otherPoint);
        this.speed = 0.1;
        otherPoint.speed = 0.1;
    }  
    
    strike(otherPoint){
        otherPoint.hp -= this.speed;
        if(otherPoint.hp <= 0){
            otherPoint.stopped = true;
        }
        this.hp -= otherPoint.speed * 0.5;
        if(this.hp <= 0){
            this.stopped = true;
        }
        console.log(`HP: ${this.hp} DAMAGE: ${otherPoint.speed}`)
    }
}