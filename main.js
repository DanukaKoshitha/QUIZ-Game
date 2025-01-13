let sec = 0;
let qNumber = 1;
let interval = undefined;

$('#Q-number').val('1/5');
$('#timer').val('00:00');

const displayQize = () => {
    
  interval = setInterval(() => {
    if(sec<10){
        $('#timer').val("00:0"+sec);
    }else{
        $('#timer').val("00:"+sec);
    }
    sec++;

    if(sec==5){
        veryfiyNumber('skipped');
        $('#btnStart').prop('disabled',false);
        sec=0;
        displayQize();
    }
  }, 1000);
};

const veryfiyNumber=(state)=>{
    qNumber++;
    $('#Q-number').val(qNumber+'/5');
    clearInterval(interval);
}

const start=()=>{
    $('#btnStart').prop('disabled',true);
    displayQize();
}
