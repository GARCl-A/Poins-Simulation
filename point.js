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
        this.wallsCD = 0;

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
            this.move();
            this.checkCollision(points);
            this.getClosestPoint(points);
            //this.drawView();
            this.drawInfo();
            this.drawSelf();
        }
    }

    move() {
        const halfSize = this.size / 2;
        const coneAngle = 60 * (Math.PI / 180); // Ângulo do cone em radianos (120 graus convertidos para radianos)
    
        const futureX = this.x + this.dx * this.speed;
        const futureY = this.y + this.dy * this.speed;

        const collideView = Math.max(this.viewDistance/2, halfSize)
    
        const collidesWithWall =
            futureX - collideView < 0 ||
            futureX + collideView > this.canvas.width ||
            futureY - collideView < 0 ||
            futureY + collideView > this.canvas.height;

        const collidesWithLeftWall = futureX - collideView < 0;
        const collidesWithRightWall = futureX + collideView > this.canvas.width;
        const collidesWithTopWall = futureY - collideView < 0;
        const collidesWithBottomWall = futureY + collideView > this.canvas.height;

        if (this.wallsCD <= 0 && collidesWithWall && Math.abs(Math.atan2(futureY - this.y, futureX - this.x) - this.angle) < coneAngle) {
            this.wallsCD = 50;
    
            // Se houver colisão iminente, ajusta a direção de acordo com a parede
            if (collidesWithLeftWall) {
                this.dx = Math.abs(this.dx); // Torna a direção X positiva para afastar da parede
                this.angle = Math.atan2(this.dy, this.dx);
            } else if (collidesWithRightWall) {
                this.dx = -Math.abs(this.dx); // Torna a direção X negativa para afastar da parede
                this.angle = Math.atan2(this.dy, this.dx);
            }
    
            if (collidesWithTopWall) {
                this.dy = Math.abs(this.dy); // Torna a direção Y positiva para afastar da parede
                this.angle = Math.atan2(this.dy, this.dx);
            } else if (collidesWithBottomWall) {
                this.dy = -Math.abs(this.dy); // Torna a direção Y negativa para afastar da parede
                this.angle = Math.atan2(this.dy, this.dx);
            }
    
            // Reduz a velocidade e ajusta a direção
            this.speed *= 0.7;
        } else {
            this.wallsCD -= 1;
        }

        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
    
        // Verifica a colisão com as paredes
        this.checkWallCollision(halfSize);
        this.speed += 0.01; // Aumenta a velocidade gradualmente
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
            if (!otherPoint.stopped) {
                const distance = this.getDistance(otherPoint);
                if (distance < this.size) {
                    this.collide(otherPoint);
                }
            }
        });
    }

    getClosestPoint(points) {
        const coneAngle = 60 * (Math.PI / 180);
    
        let closestDistance = Infinity;
        let closestPoint = null;
    
        for (const otherPoint of points) {
            let otherPointDistance = this.getDistance(otherPoint);
            if (!otherPoint.stopped &&
                otherPointDistance < this.viewDistance &&
                Math.abs(Math.atan2(otherPoint.y - this.y, otherPoint.x - this.x) - this.angle) < coneAngle) {
    
                const distance = otherPointDistance;
                if (distance < closestDistance) {
                    closestDistance = otherPointDistance;
                    closestPoint = otherPoint;
                    if(distance < this.size * 1.5){
                        break; //It's probabilly a collision, so we dont need to check other points.
                    }
                }
            }
        }
    
        if (closestPoint) {
            if (this.hp < 1 && closestPoint.speed > this.speed && closestPoint.hp > 1) {
                const angleAway = Math.atan2(this.y - closestPoint.y, this.x - closestPoint.x);
                this.dx = Math.cos(angleAway);
                this.dy = Math.sin(angleAway);
            } else {
                const angle = Math.atan2(closestPoint.y - this.y, closestPoint.x - this.x);
                this.dx = Math.cos(angle);
                this.dy = Math.sin(angle);
            }
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