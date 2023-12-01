import { ScreenManager } from './screenManager.js';

// Definir a função startSimulation no escopo global
window.startSimulation = function() {
    const teamNumber = parseInt(document.getElementById('teamNumber').value);
    const teamSize = parseInt(document.getElementById('teamSize').value);
    const pointSize = parseInt(document.getElementById('pointSize').value);
    const speed = parseFloat(document.getElementById('speed').value);
    const viewDistance = parseInt(document.getElementById('viewDistance').value);

    // Inicialize a simulação com os valores capturados
    const screenManager = new ScreenManager('myCanvas', teamNumber, teamSize, speed, viewDistance, pointSize);

    // Ocultar a tela de configuração
    const configPanel = document.getElementById('configPanel');
    configPanel.style.display = 'none';

    const simulationContainer = document.getElementById('simulationContainer');
    simulationContainer.style.display = 'flex';
}
