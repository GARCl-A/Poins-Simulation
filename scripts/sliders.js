const teamNumberInput = document.getElementById('teamNumber');
const teamSizeInput = document.getElementById('teamSize');

document.getElementById('pointSize').addEventListener('input', function() {
    document.getElementById('pointSizeValue').textContent = this.value;
});

document.getElementById('speed').addEventListener('input', function() {
    document.getElementById('speedValue').textContent = this.value;
});

document.getElementById('viewDistance').addEventListener('input', function() {
    document.getElementById('viewDistanceValue').textContent = this.value;
});

teamNumberInput.addEventListener('input', function() {
    const maxValue = parseInt(this.getAttribute('max'), 10); // Obtém o valor máximo definido no atributo 'max'
    if (this.value > maxValue) {
        this.value = maxValue;
        this.textContent = maxValue;  // Se o valor digitado for maior que o valor máximo permitido, define o valor como o máximo
    }
});

teamSizeInput.addEventListener('input', function() {
    const maxValue = parseInt(this.getAttribute('max'), 10); // Obtém o valor máximo definido no atributo 'max'
    if (this.value > 600/teamNumberInput.value) {
        this.value = 600/teamNumberInput.value;
        this.textContent = 600/teamNumberInput.value;  // Se o valor digitado for maior que o valor máximo permitido, define o valor como o máximo
    }
});