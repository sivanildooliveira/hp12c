// HP 12C Calculator - Complete Implementation
class HP12C {
    constructor() {
        // RPN Stack (X, Y, Z, T registers)
        this.stack = {
            x: 0,
            y: 0,
            z: 0,
            t: 0
        };
        
        // Memory registers (0-9 and special registers)
        this.memory = Array(20).fill(0);
        
        // Financial registers
        this.financial = {
            n: 0,
            i: 0,
            pv: 0,
            pmt: 0,
            fv: 0
        };
        
        // Calculator state
        this.display = '0';
        this.entering = false;
        this.newNumber = true;
        this.decimalEntered = false;
        this.exponentMode = false;
        this.exponent = '';
        
        // Mode indicators
        this.fMode = false;
        this.gMode = false;
        this.stoMode = false;
        this.rclMode = false;
        
        // Display settings
        this.decimalPlaces = -1; // -1 means floating point
        
        // Last X register for undo
        this.lastX = 0;
        
        this.init();
    }
    
    init() {
        this.updateDisplay();
        this.updateStackDisplay();
        this.setupEventListeners();
        this.setupKeyboard();
    }
    
    setupEventListeners() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleButtonClick(button);
                this.addClickFeedback(button);
            });
        });
    }
    
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            const key = e.key;
            
            // Number keys
            if (key >= '0' && key <= '9') {
                this.pressDigit(key);
            }
            // Operators
            else if (key === '+') this.pressKey('+');
            else if (key === '-') this.pressKey('-');
            else if (key === '*') this.pressKey('×');
            else if (key === '/') this.pressKey('÷');
            else if (key === 'Enter') {
                e.preventDefault();
                this.pressKey('ENTER');
            }
            else if (key === '.') this.pressDigit('.');
            else if (key === 'Backspace') this.pressKey('CLx');
            else if (key === 'Escape') this.pressKey('ON');
        });
    }
    
    addClickFeedback(button) {
        button.style.transform = 'translateY(2px)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }
    
    handleButtonClick(button) {
        const key = button.getAttribute('data-key');
        const fKey = button.getAttribute('data-f');
        const gKey = button.getAttribute('data-g');
        
        // Handle f and g mode buttons
        if (key === 'f') {
            this.fMode = true;
            this.gMode = false;
            this.updateModeIndicator();
            return;
        }
        
        if (key === 'g') {
            this.gMode = true;
            this.fMode = false;
            this.updateModeIndicator();
            return;
        }
        
        // Execute the appropriate function
        if (this.fMode && fKey) {
            this.executeFunction(fKey);
            this.fMode = false;
        } else if (this.gMode && gKey) {
            this.executeFunction(gKey);
            this.gMode = false;
        } else {
            this.pressKey(key);
        }
        
        this.updateModeIndicator();
    }
    
    pressKey(key) {
        // Handle STO/RCL modes
        if (this.stoMode) {
            if (key >= '0' && key <= '9') {
                this.memory[parseInt(key)] = this.stack.x;
                this.stoMode = false;
                this.updateModeIndicator();
            }
            return;
        }
        
        if (this.rclMode) {
            if (key >= '0' && key <= '9') {
                this.enterNumber(this.memory[parseInt(key)].toString());
                this.rclMode = false;
                this.updateModeIndicator();
            }
            return;
        }
        
        switch(key) {
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                this.pressDigit(key);
                break;
            case '.':
                this.pressDigit('.');
                break;
            case 'ENTER':
                this.pressEnter();
                break;
            case '+':
                this.add();
                break;
            case '-':
            case '−':
                this.subtract();
                break;
            case '×':
                this.multiply();
                break;
            case '÷':
                this.divide();
                break;
            case 'CHS':
                this.changeSign();
                break;
            case 'EEX':
                this.enterExponent();
                break;
            case 'CLx':
                this.clearX();
                break;
            case 'ON':
                this.reset();
                break;
            case 'R↓':
                this.rollDown();
                break;
            case 'STO':
                this.stoMode = true;
                this.updateModeIndicator();
                break;
            case 'RCL':
                this.rclMode = true;
                this.updateModeIndicator();
                break;
            case 'n':
                this.financial.n = this.stack.x;
                break;
            case 'i':
                this.financial.i = this.stack.x;
                break;
            case 'PV':
                if (this.canCalculateTVM('pv')) {
                    this.calculatePV();
                } else {
                    this.financial.pv = this.stack.x;
                }
                break;
            case 'PMT':
                if (this.canCalculateTVM('pmt')) {
                    this.calculatePMT();
                } else {
                    this.financial.pmt = this.stack.x;
                }
                break;
            case 'FV':
                if (this.canCalculateTVM('fv')) {
                    this.calculateFV();
                } else {
                    this.financial.fv = this.stack.x;
                }
                break;
            case 'PREFIX':
                this.backspace();
                break;
        }
        
        this.updateDisplay();
        this.updateStackDisplay();
    }
    
    executeFunction(func) {
        switch(func) {
            // f functions (orange)
            case 'y^x':
            case 'yˣ':
                this.power();
                break;
            case '1/x':
                this.reciprocal();
                break;
            case '%':
                this.percent();
                break;
            case '√x':
                this.squareRoot();
                break;
            case 'LN':
                this.naturalLog();
                break;
            case 'e^x':
            case 'eˣ':
                this.exponential();
                break;
            case 'x⇌y':
                this.swapXY();
                break;
            // g functions (blue)
            case 'Δ%':
                this.deltaPercent();
                break;
            case 'x²':
                this.square();
                break;
            case 'CLΣ':
                this.clearStatistics();
                break;
            case 'INT':
                this.integerPart();
                break;
            case 'FRAC':
            case 'Frac':
                this.fractionalPart();
                break;
            case '12×':
                this.multiply12();
                break;
            case '12÷':
                this.divide12();
                break;
            // Decimal places
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                this.setDecimalPlaces(parseInt(func));
                break;
        }
        
        this.updateDisplay();
        this.updateStackDisplay();
    }
    
    pressDigit(digit) {
        if (this.exponentMode) {
            this.exponent += digit;
            this.display = this.display.split('e')[0] + 'e' + this.exponent;
        } else {
            if (this.newNumber) {
                if (digit === '.') {
                    this.display = '0.';
                    this.decimalEntered = true;
                } else {
                    this.display = digit;
                }
                this.newNumber = false;
                this.entering = true;
            } else {
                if (digit === '.') {
                    if (!this.decimalEntered) {
                        this.display += '.';
                        this.decimalEntered = true;
                    }
                } else {
                    this.display += digit;
                }
            }
        }
        
        this.updateDisplay();
    }
    
    pressEnter() {
        this.stack.x = parseFloat(this.display) || 0;
        this.pushStack();
        this.newNumber = true;
        this.entering = false;
        this.decimalEntered = false;
        this.exponentMode = false;
        this.exponent = '';
    }
    
    enterNumber(num) {
        this.pushStack();
        this.stack.x = parseFloat(num) || 0;
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
    }
    
    pushStack() {
        this.stack.t = this.stack.z;
        this.stack.z = this.stack.y;
        this.stack.y = this.stack.x;
    }
    
    dropStack() {
        this.stack.x = this.stack.y;
        this.stack.y = this.stack.z;
        this.stack.z = this.stack.t;
    }
    
    rollDown() {
        const temp = this.stack.x;
        this.stack.x = this.stack.y;
        this.stack.y = this.stack.z;
        this.stack.z = this.stack.t;
        this.stack.t = temp;
    }
    
    swapXY() {
        const temp = this.stack.x;
        this.stack.x = this.stack.y;
        this.stack.y = temp;
        this.display = this.formatNumber(this.stack.x);
    }
    
    // Basic operations
    add() {
        if (this.entering) {
            this.stack.x = parseFloat(this.display) || 0;
            this.entering = false;
        }
        this.lastX = this.stack.x;
        this.stack.x = this.stack.y + this.stack.x;
        this.dropStack();
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
        this.decimalEntered = false;
    }
    
    subtract() {
        if (this.entering) {
            this.stack.x = parseFloat(this.display) || 0;
            this.entering = false;
        }
        this.lastX = this.stack.x;
        this.stack.x = this.stack.y - this.stack.x;
        this.dropStack();
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
        this.decimalEntered = false;
    }
    
    multiply() {
        if (this.entering) {
            this.stack.x = parseFloat(this.display) || 0;
            this.entering = false;
        }
        this.lastX = this.stack.x;
        this.stack.x = this.stack.y * this.stack.x;
        this.dropStack();
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
        this.decimalEntered = false;
    }
    
    divide() {
        if (this.entering) {
            this.stack.x = parseFloat(this.display) || 0;
            this.entering = false;
        }
        this.lastX = this.stack.x;
        if (this.stack.x !== 0) {
            this.stack.x = this.stack.y / this.stack.x;
        } else {
            this.display = 'Error';
            return;
        }
        this.dropStack();
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
        this.decimalEntered = false;
    }
    
    changeSign() {
        if (this.exponentMode) {
            if (this.exponent.startsWith('-')) {
                this.exponent = this.exponent.substring(1);
            } else {
                this.exponent = '-' + this.exponent;
            }
            this.display = this.display.split('e')[0] + 'e' + this.exponent;
        } else {
            const num = parseFloat(this.display) || 0;
            this.display = this.formatNumber(-num);
        }
    }
    
    enterExponent() {
        if (!this.exponentMode) {
            this.exponentMode = true;
            this.exponent = '';
            if (!this.display.includes('e')) {
                this.display += 'e0';
            }
        }
    }
    
    clearX() {
        this.display = '0';
        this.stack.x = 0;
        this.newNumber = true;
        this.entering = false;
        this.decimalEntered = false;
        this.exponentMode = false;
        this.exponent = '';
    }
    
    backspace() {
        if (this.display.length > 1 && !this.newNumber) {
            this.display = this.display.slice(0, -1);
        } else {
            this.display = '0';
            this.newNumber = true;
        }
    }
    
    reset() {
        this.stack = { x: 0, y: 0, z: 0, t: 0 };
        this.display = '0';
        this.newNumber = true;
        this.entering = false;
        this.decimalEntered = false;
        this.exponentMode = false;
        this.exponent = '';
        this.fMode = false;
        this.gMode = false;
        this.stoMode = false;
        this.rclMode = false;
    }
    
    // Mathematical functions
    squareRoot() {
        const num = this.entering ? parseFloat(this.display) : this.stack.x;
        if (num >= 0) {
            this.stack.x = Math.sqrt(num);
            this.display = this.formatNumber(this.stack.x);
        } else {
            this.display = 'Error';
        }
        this.newNumber = true;
        this.entering = false;
    }
    
    square() {
        const num = this.entering ? parseFloat(this.display) : this.stack.x;
        this.stack.x = num * num;
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
        this.entering = false;
    }
    
    power() {
        if (this.entering) {
            this.stack.x = parseFloat(this.display) || 0;
            this.entering = false;
        }
        this.stack.x = Math.pow(this.stack.y, this.stack.x);
        this.dropStack();
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
    }
    
    reciprocal() {
        const num = this.entering ? parseFloat(this.display) : this.stack.x;
        if (num !== 0) {
            this.stack.x = 1 / num;
            this.display = this.formatNumber(this.stack.x);
        } else {
            this.display = 'Error';
        }
        this.newNumber = true;
        this.entering = false;
    }
    
    naturalLog() {
        const num = this.entering ? parseFloat(this.display) : this.stack.x;
        if (num > 0) {
            this.stack.x = Math.log(num);
            this.display = this.formatNumber(this.stack.x);
        } else {
            this.display = 'Error';
        }
        this.newNumber = true;
        this.entering = false;
    }
    
    exponential() {
        const num = this.entering ? parseFloat(this.display) : this.stack.x;
        this.stack.x = Math.exp(num);
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
        this.entering = false;
    }
    
    percent() {
        if (this.entering) {
            this.stack.x = parseFloat(this.display) || 0;
            this.entering = false;
        }
        this.stack.x = (this.stack.y * this.stack.x) / 100;
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
    }
    
    deltaPercent() {
        if (this.entering) {
            this.stack.x = parseFloat(this.display) || 0;
            this.entering = false;
        }
        if (this.stack.y !== 0) {
            this.stack.x = ((this.stack.x - this.stack.y) / this.stack.y) * 100;
            this.dropStack();
            this.display = this.formatNumber(this.stack.x);
        } else {
            this.display = 'Error';
        }
        this.newNumber = true;
    }
    
    integerPart() {
        const num = this.entering ? parseFloat(this.display) : this.stack.x;
        this.stack.x = Math.trunc(num);
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
        this.entering = false;
    }
    
    fractionalPart() {
        const num = this.entering ? parseFloat(this.display) : this.stack.x;
        this.stack.x = num - Math.trunc(num);
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
        this.entering = false;
    }
    
    multiply12() {
        const num = this.entering ? parseFloat(this.display) : this.stack.x;
        this.stack.x = num * 12;
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
        this.entering = false;
    }
    
    divide12() {
        const num = this.entering ? parseFloat(this.display) : this.stack.x;
        this.stack.x = num / 12;
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
        this.entering = false;
    }
    
    clearStatistics() {
        // Clear statistical registers
        for (let i = 0; i < 7; i++) {
            this.memory[i] = 0;
        }
    }
    
    setDecimalPlaces(places) {
        this.decimalPlaces = places;
        this.display = this.formatNumber(this.stack.x);
    }
    
    // Financial functions (TVM)
    canCalculateTVM(skipVar) {
        const vars = ['n', 'i', 'pv', 'pmt', 'fv'];
        let count = 0;
        
        for (let v of vars) {
            if (v !== skipVar && this.financial[v] !== 0) {
                count++;
            }
        }
        
        return count >= 4;
    }
    
    calculatePV() {
        const n = this.financial.n;
        const i = this.financial.i / 100;
        const pmt = this.financial.pmt;
        const fv = this.financial.fv;
        
        if (i === 0) {
            this.financial.pv = -(fv + pmt * n);
        } else {
            const v = Math.pow(1 + i, n);
            this.financial.pv = -(fv / v + pmt * (1 - 1 / v) / i);
        }
        
        this.stack.x = this.financial.pv;
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
    }
    
    calculatePMT() {
        const n = this.financial.n;
        const i = this.financial.i / 100;
        const pv = this.financial.pv;
        const fv = this.financial.fv;
        
        if (i === 0) {
            this.financial.pmt = -(fv + pv) / n;
        } else {
            const v = Math.pow(1 + i, n);
            this.financial.pmt = -(fv + pv * v) * i / (v - 1);
        }
        
        this.stack.x = this.financial.pmt;
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
    }
    
    calculateFV() {
        const n = this.financial.n;
        const i = this.financial.i / 100;
        const pv = this.financial.pv;
        const pmt = this.financial.pmt;
        
        if (i === 0) {
            this.financial.fv = -(pv + pmt * n);
        } else {
            const v = Math.pow(1 + i, n);
            this.financial.fv = -(pv * v + pmt * (v - 1) / i);
        }
        
        this.stack.x = this.financial.fv;
        this.display = this.formatNumber(this.stack.x);
        this.newNumber = true;
    }
    
    // Display functions
    formatNumber(num) {
        if (isNaN(num) || !isFinite(num)) {
            return 'Error';
        }
        
        if (this.decimalPlaces >= 0) {
            return num.toFixed(this.decimalPlaces);
        }
        
        // Auto formatting
        const absNum = Math.abs(num);
        
        if (absNum === 0) {
            return '0';
        }
        
        if (absNum >= 1e10 || absNum < 1e-8) {
            return num.toExponential(6);
        }
        
        // Format with appropriate precision
        let formatted = num.toPrecision(10);
        formatted = parseFloat(formatted).toString();
        
        // Add thousand separators
        if (absNum >= 1000 && !formatted.includes('e')) {
            const parts = formatted.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        }
        
        return formatted;
    }
    
    updateDisplay() {
        document.getElementById('display').textContent = this.display;
    }
    
    updateStackDisplay() {
        document.getElementById('stack-t').textContent = this.formatNumber(this.stack.t);
        document.getElementById('stack-z').textContent = this.formatNumber(this.stack.z);
        document.getElementById('stack-y').textContent = this.formatNumber(this.stack.y);
    }
    
    updateModeIndicator() {
        const indicator = document.getElementById('mode-indicator');
        
        if (this.fMode) {
            indicator.textContent = 'f';
            indicator.style.color = '#ff9500';
        } else if (this.gMode) {
            indicator.textContent = 'g';
            indicator.style.color = '#4a9eff';
        } else if (this.stoMode) {
            indicator.textContent = 'STO';
            indicator.style.color = '#fff';
        } else if (this.rclMode) {
            indicator.textContent = 'RCL';
            indicator.style.color = '#fff';
        } else {
            indicator.textContent = '';
        }
    }
}

// Initialize calculator when page loads
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new HP12C();
});
