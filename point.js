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
        this.characterImage.src = 'character.png';
    }

    update(points) {
        if (!this.stopped) {
            this.getClosestPoint(points);
            this.move();
            this.checkCollision(points);
            this.drawView();
            this.drawInfo();
            this.drawSelf();
        }
    }

    move() {
        const halfSize = this.size / 2;
    
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
    
        this.checkWallCollision(halfSize);
        this.speed += 0.01;
    }
    
    checkWallCollision(halfSize) {
        if (this.x - halfSize < 0) {
            this.handleWallCollision('x', halfSize);
        }
        if (this.x + halfSize > this.canvas.width) {
            this.handleWallCollision('x', this.canvas.width - halfSize);
        }
        if (this.y - halfSize < 0) {
            this.handleWallCollision('y', halfSize);
        }
        if (this.y + halfSize > this.canvas.height) {
            this.handleWallCollision('y', this.canvas.height - halfSize);
        }
    }
    
    handleWallCollision(axis, boundary) {
        this.resetPositionAfterCollision(axis, boundary);
        this.reverseDirectionAfterCollision(axis);
    }
    
    resetPositionAfterCollision(axis, boundary) {
        if (axis === 'x') {
            this.x = boundary;
        } else {
            this.y = boundary;
        }
    }
    
    reverseDirectionAfterCollision(axis) {
        if (axis === 'x') {
            this.dx *= -1;
        } else {
            this.dy *= -1;
        }
        this.speed = 0.1;
        this.angle = Math.atan2(this.dy, this.dx);
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
        const coneAngle = 60 * (Math.PI / 180); // Ângulo do cone em radianos (120 graus convertidos para radianos)
  
        const visiblePoints = points.filter(otherPoint => 
            otherPoint !== this &&
            !otherPoint.stopped &&
            this.team.teamId !== otherPoint.team.teamId &&
            this.getDistance(otherPoint) < this.viewDistance &&
            Math.abs(Math.atan2(otherPoint.y - this.y, otherPoint.x - this.x) - this.angle) < coneAngle
        );
      
        if (visiblePoints.length > 0) {
            let closestDistance = this.getDistance(visiblePoints[0]);
            let closestPoint = visiblePoints[0];

            visiblePoints.forEach(point => {
                const distance = this.getDistance(point);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPoint = point;
                }
            });

            const angle = Math.atan2(closestPoint.y - this.y, closestPoint.x - this.x);
            this.dx = Math.cos(angle);
            this.dy = Math.sin(angle);
            this.angle = Math.atan2(this.dy, this.dx);
        }
    }

    drawView() {
        const halfSize = this.size / 2;
        const viewAngle = 120; // Ângulo de visão do cone em graus
        const viewDistance = this.viewDistance;
    
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle); // Roda o contexto para a direção do ponto
    
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0); // Posição inicial no ponto central
        
        // Define o arco do cone de visão
        this.ctx.arc(0, 0, viewDistance, -viewAngle / 2 * Math.PI / 180, viewAngle / 2 * Math.PI / 180);
        
        this.ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"; // Cor e transparência do cone de visão
        this.ctx.lineTo(0, 0); // Retorna ao ponto inicial para fechar o cone
        this.ctx.stroke();
        
        this.ctx.restore();
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
    }

    drawHealthBar(x, y, width, height, health, maxHealth, color) {
        const barWidth = (width * health) / maxHealth;
    
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, barWidth, height);
    
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(x, y, width, height);
    }
    
    drawSpeedIcon(x, y, speed) {
        this.ctx.font = "bold 14px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(`>> ${speed.toFixed(2)}`, x, y);
    }
    
    drawInfo() {
        const x = this.x - this.size / 2;
        const y = this.y - this.size / 2 - 20; // Posição acima do personagem

        // Exibir barra de HP
        this.drawHealthBar(x, y, this.size, 5, this.hp, 3, "green");

        // Exibir ícone de velocidade
        this.drawSpeedIcon(x, y - 7, this.speed);
    }
}