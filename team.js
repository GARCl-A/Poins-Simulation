export class Team {
    constructor(teamId) {
        this.teamId = teamId;
        this.points = [];
        this.stoppedCount = 0;
        const r = Math.random() * 255;
        const g = Math.random() * 255;
        const b = Math.random() * 255;
        this.color = `rgba(${r}, ${g}, ${b}, 1)`;
    }

    addPoint(point) {
        this.points.push(point);
    }

    getTeamSize(){
        return this.points.length
    }

    update(pointsList){
        this.points.forEach(point => {
            point.update(pointsList);
        });
        this.getStoppedCount();
    }

    getStoppedCount(){
        let stoppeds = 0;
        this.points.forEach(point => {
            if(point.stopped === true){
                stoppeds += 1
            }
        }); 
        this.stoppedCount = stoppeds;
    }
}