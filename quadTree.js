import { Boundary } from "./boundary.js"

export class Quadtree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.children = [];
        this.divided = false;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return; // Se o ponto não está na área da quadtree atual, não faz nada
        }
    
        if (this.points.length < this.capacity) {
            this.points.push(point); // Adiciona o ponto se ainda houver espaço
        } else {
            if (!this.divided) {
                this.subdivide(); // Divide a quadtree se ainda não estiver dividida
            }
    
            // Insere o ponto somente na quadtree filho correspondente à sua área
            for (const child of this.children) {
                child.insert(point);
            }
        }
    }

    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.width / 2;
        const h = this.boundary.height / 2;

        const ne = new Boundary(x + w, y, w, h);
        const nw = new Boundary(x, y, w, h);
        const se = new Boundary(x + w, y + h, w, h);
        const sw = new Boundary(x, y + h, w, h);

        this.children.push(new Quadtree(ne, this.capacity));
        this.children.push(new Quadtree(nw, this.capacity));
        this.children.push(new Quadtree(se, this.capacity));
        this.children.push(new Quadtree(sw, this.capacity));

        this.divided = true;
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return found;
        }

        for (const point of this.points) {
            if (range.contains(point)) {
                found.push(point);
            }
        }

        if (this.divided) {
            this.children.forEach(child => found.concat(child.query(range, found)));
        }

        return found;
    }

    remove(point) {
        if (!this.boundary.contains(point)) {
            return;
        }

        const pointIndex = this.points.findIndex(p => p === point);
        if (pointIndex !== -1) {
            this.points.splice(pointIndex, 1);
            return;
        }

        if (this.divided) {
            for (const child of this.children) {
                child.remove(point);
            }
        }
    }
}

