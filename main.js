let operators = ['/', 'x', '+', '-', '%']
let numbersAll = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '00'];
let number = '';
let equation = [];
let output = document.querySelector(".inputText h3");

function clearAll() {
    output.textContent = '0';
    equation = [];
    number = '';
}

function deleteLast() {
    //удаление последнего символа из последнего введенного числа
    if (number !== '') {
        let y = number.split('');
        y.pop();
        number = y.join('');
        //удаление последнего символа из массива уравнения
    } else if (number === '' && equation.length >= 1) {
        let newEquation = equation.pop();
        if (!operators.includes(newEquation)) {
            newEquation = newEquation.split('');
            if (newEquation !== '') {
                newEquation.pop();
                number = newEquation.join('');
            }
        }
    }
    let z = output.textContent.split('')
    z.pop();
    output.textContent = z.join('');
}

function makingOperation(a, sign, b) {
    a = Number(a);
    b = Number(b);
    switch (sign) {
        case '+':
            return (a + b);
        case '-':
            return (a - b);
        case 'x':
            return (a * b);
        case '/':
            return (a / b);
        case '%':
            return (a / 100);
    }
}

function calculate() {
    //проверка правильности написания
    if (!isNaN(Number(number))) equation.push(number);
    if (isNaN(Number(equation[equation.length - 1]))) equation.pop();
    if (isNaN(Number(equation[0]))) equation.splice(0, 1);
    number = '';

    function calculateRecursion() {
        // вычисление процента
        if (equation.includes('%')) {
            for (let element of equation) {
                if (element === '%') {
                    let p = equation.indexOf(element);
                    let result = String(makingOperation(equation[p - 1], element, null));
                    equation.splice(p - 1, 2, result);
                }
            }
            // вычисление умножения/деления
        } else if (equation.includes('x') || equation.includes('/')) {
            for (let element of equation) {
                if (['x', '/'].includes(element)) {
                    let p = equation.indexOf(element);
                    let result = String(makingOperation(equation[p - 1], element, equation[p + 1]));
                    equation.splice(p - 1, 3, result);
                }
            }
            //вычисление минус/плюс
        } else if (equation.includes('-') || equation.includes('+')) {
            for (let element of equation) {
                if (['+', '-'].includes(element)) {
                    let p = equation.indexOf(element)
                    let result = String(makingOperation(equation[p - 1], element, equation[p + 1]));
                    equation.splice(p - 1, 3, result);
                }
            }
        }
        //проверка решения
        if (equation.length === 1) {
            if (equation[0] === Infinity || equation[0] === -Infinity) {
                output.textContent = 'На ноль делить нельзя';
            } else {
                output.textContent = equation[0];
            }
            return;
        }
        calculateRecursion();
    }

    calculateRecursion();
}

// слушатель событий
document.querySelector('.equals').onclick = calculate; //кнопка Равно
document.querySelector('.del').onclick = deleteLast; //конпка удаления последнего элемента
document.querySelector('.delAll').onclick = clearAll; //кнопка Стереть Всё
document.querySelector(".button").onclick = (event) => {
    // обработка исключений
    if (!event.target.classList.contains('btn')) return;
    if (event.target.classList.contains('delAll')) return;
    if (event.target.classList.contains('del')) return;
    if (event.target.classList.contains('equals')) return;
    if (output.textContent === 'На ноль делить нельзя') {
        clearAll();
    }
    if (output.textContent === '0') {
        output.textContent = '';
    }

    const key = event.target.textContent;

    // обработка действий кнопок
    // цифры
    if (numbersAll.includes(key)) {
        if (equation.length >= 1) {
            let e = equation[equation.length - 1];
            if (!isNaN(Number(e[e.length - 1]))) {
                number = equation.pop();
            }
        }
        number += key;
        output.textContent += key;
    // операторы
    } else if (operators.includes(key)) {
        if ((output.textContent === '' ||
                (['x', '/'].includes(equation[equation.length - 1]) && number[number.length - 1] !== '-'))
            && key === '-') {
            if (!isNaN(Number(number[number.length - 1]))) {
                equation.push(number);
                number = '';
                equation.push(key);
                output.textContent += key;
                return;
            }
            number += key;
            output.textContent += key;
        }
        if (operators.includes(key) && equation[equation.length - 1] === '%' && key !== '%') {
            equation.push(key);
            output.textContent += key;
            return;
        }
        if (number !== '' && number[number.length - 1] !== '-') {
            equation.push(number);
            equation.push(key);
            number = '';
            output.textContent += key;
        } else if (number === '' && !operators.includes(equation[equation.length - 1])) {
            equation.push(key);
            output.textContent += key;
        } else if (number === '' && operators.includes(equation[equation.length - 1])) {
            equation[equation.length - 1] = key;
            let z = output.textContent.split('')
            z.pop();
            output.textContent = z.join('');
            output.textContent += key;
        }

    }
}
