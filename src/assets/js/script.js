document.querySelectorAll('[data-recarrega-pagina]').forEach(botao => {
  botao.addEventListener('click', () => {
    window.location.reload();
  })
})

const display = document.querySelector('#display');
const buttons = document.querySelector('button');
const themeToggleBtn = document.querySelector('.theme-toggler');
const calculator = document.querySelector('.dark');
const toggleIcon = document.querySelector('.toggler-icon');
const btnHistory = document.querySelector('#history');

let isDark = true;
let indexCurrent;
let calcCurrent;
let restCurrent;

function calc(id){
  if(id == 'clear'){
    display.value = '';
  }else if(id == 'backspace'){
    formatResult('disabled');
    let string = display.value
    display.value = string.substring(0, string.length - 1);
  }else if(display.value !== '' && display.value != 'Vazio!' && id == 'equal'){
    formatResult('active');
    calcular();    
  }else if(display.textContent == 'Vazio!' || display.value == '' && id == 'equal'){
    formatResult('disabled');
    display.value = 'Vazio!';
    setTimeout(() => display.value = '', 2000);
  }else{
    formatResult('disabled');
    display.value += id;
  }
}

const formatResult = (status) => {
  if(status == 'active'){
    display.classList.add('result');
    display.style.fontSize = '26pt';
  }else{
    display.classList.remove('result');
    display.style.fontSize = '20pt';
  }
}

function calcular(){
  let resultado = null;
  try{
    resultado = eval(display.value);
    
    if(resultado !== undefined){
      armazenarCalculo(display.value, resultado);
    }else{
      resultado = '';
    }
    
    display.value = resultado;
    
  }catch(error){
    try{
      resultado = eval(display.value.substring(0, (display.value.length - 1)));
      
      if(resultado !== undefined){
        armazenarCalculo(display.value, resultado);
      }else{
        resultado = '';
      }
      
      display.value = resultado;
    }catch(error){
      
    }
  }
}

function armazenarCalculo(calculo, resultado){
  try{
    const armazenado = JSON.parse(localStorage.getItem('calculos'));
    let registro = {calculo: calculo, resultado: resultado};
    let armazenar = new Array();
    
    if(armazenado !== null && Array.isArray(armazenado)){
      if(armazenado.find(e => e.calculo == registro.calculo && e.resultado == registro.resultado) == undefined){
        armazenar.push(registro);
      }
      
      if(armazenado.length < 10){
        armazenado.forEach(registro => { 
          armazenar.push(registro)
        });
      }else{
        localStorage.setItem('calculos', JSON.stringify(armazenar));
      }
    }else{
      armazenar.push(registro)
    }
    
    localStorage.setItem('calculos', JSON.stringify(armazenar));
  }catch(error){
    limparArmazenados();
  }
}

function limparArmazenados(){
  localStorage.clear();
}

btnHistory.addEventListener('click', () => {
  let printHistory = 'Você precisa fazer um cálculo primeiro';
  const history = JSON.parse(localStorage.getItem('calculos'));
  
  try{
    if(history !== null){
      printHistory = '';
      if(Array.isArray(history)){
        history.forEach(element => {
          printHistory += `${element.calculo} = ${element.resultado} <br>`
        })
      }else{
        printHistory = `${history.calculo} = ${history.resultado}`;
      }
    }
  }catch(error){
    limparArmazenados();
  }
  
  Swal.fire(
    "<h5> Últimos Cálculos </h5><span class='alert-format'><br>" + printHistory +'<div><br><button id="limpar-armazenados" style="width:max-content; padding: 0 1rem;"><i class="fa-solid fa-trash-can"></i></button></div></span>'
    )
    
    document.querySelector('#limpar-armazenados').addEventListener('click', () => {
      window.location.reload();
      limparArmazenados();
    })
  })
  
  document.addEventListener('keyup', (evento) => {
    evento.preventDefault();
    display.focus();
    
    if(evento.keyCode == 13){
      formatResult('active');
      calcular();
      return '';
    }else{
      formatResult('disabled');
    }
    
    const codesValidos = [
      {
        nome: 'virgula',
        caracter: '.',
        codigo: 188
      },
      
      {
        nome: 'ponto',
        caracter: '.',
        codigo: 190
      },
      
      {
        nome: 'ponto',
        caracter: '.',
        codigo: 110
      },
      
      {
        nome: 'apagar',
        caracter: 'c',
        codigo: 67
      },
      
      {
        nome: 'divisao',
        caracter: '/',
        codigo: 191
      },
      
      {
        nome: 'divisao',
        caracter: '/',
        codigo: 111
      },
      
      {
        nome: 'subtracao',
        caracter: '-',
        codigo: 109
      },
      
      {
        nome: 'subtracao',
        caracter: '-',
        codigo: 189
      },
      
      {
        nome: 'adicao',
        caracter: '+',
        codigo: 107
      },
      
      {
        nome: 'multiplicacao',
        caracter: '*',
        codigo: 16
      },
      
      {
        nome: 'multiplicacao',
        caracter: '*',
        codigo: 106
      },
      
      {
        nome: 'igual',
        caracter: '=',
        codigo: 187
      }
    ]
    
    const caracteresEspeciais = [
      '!', '@', '#', '$', ' %', '^', '&', '`', '"', '~'
    ]
    
    const cod = codesValidos.findIndex(e => e.codigo == evento.keyCode);
    const numero = 
    evento.keyCode >= 48 && evento.keyCode <= 57 || 
    evento.keyCode >= 96 && evento.keyCode <= 105 && 
    new RegExp('^[0-9]+$').test(evento.keyCode);
    
    if(cod == -1 && !numero || caracteresEspeciais.includes(display.value[display.value.length - 1])){
      display.value = display.value.substring(0, (display.value.length - 1));
    }
  })
  
  themeToggleBtn.onclick = () => {
    alternarTema();
  }
  
  function alternarTema(){
    btnHistory.classList.toggle('dark');
    calculator.classList.toggle('dark');
    document.querySelector('body').classList.toggle('body-dark');
    themeToggleBtn.classList.toggle('active');
    isDark = !isDark;
  }