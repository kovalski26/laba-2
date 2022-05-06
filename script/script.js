function validate(depositType, conditions, depositAmount) {
    if (depositType === '' || depositType == null)
        throw new Error('Ошибка: Выберите вид вклада.');
    else if (conditions === '' || conditions === null)
        throw new Error('Ошибка: Выберите условия вклада.');
    else if (parseFloat(depositAmount) === NaN)
        throw new Error('Ошибка: Введите корректную сумму вклада в виде числа.');
    else if (parseFloat(depositAmount) <= 0)
        throw new Error('Ошибка: Введите сумму вклада больше 0.');
}

function calculate(depositType, conditions, depositAmount) {
    const data = {
        'refillable': {
            6: 20,
            12: 22,
            18: 15,
            24: 10
        },
        'term': {
            3: 20,
            6: 22,
            9: 23,
            12: 24,
            18: 18,
            24: 15
        }
    };
    return depositAmount + depositAmount * (data[depositType][conditions] / 100) * (conditions / 12);
}

$(document).on('ready', function() {
    $('#term').hide();
    $('#depositType').on('change', function() {
        $('#typeAnswer > div').hide();
        $('#typeAnswer').find('#' + $(this).val()).show();
    });

    $('#button').on('click', function() {
        try {
            const depositType = $('select[name="depositType"]').val();
            let conditions = null;
            if (depositType === 'refillable')
                conditions = $('select[name="refillableConditions"]').val();
            else if (depositType === 'term')
                conditions = $('select[name="termConditions"]').val();
            let depositAmount = $('input[name="depositAmount"]').val();
            validate(depositType, conditions, depositAmount);
            conditions = parseInt(conditions);
            depositAmount = parseFloat(depositAmount);

            let result = calculate(depositType, conditions, depositAmount);
            
            let outputConditions = 'Вклад "';
            if (depositType === 'refillable')
                outputConditions += 'Пополняемый';
            else if (depositType === 'term')
                outputConditions += 'Срочный';
            outputConditions += '" на срок "';
            if (conditions < 12) {
                outputConditions += conditions + ' месяц'
                if (conditions % 10 <= 4) outputConditions += 'а';
                else outputConditions += 'ев';
            }
            else {
                outputConditions += (conditions / 12) + ' год';
                if (conditions > 12) outputConditions += 'а';
            }
            outputConditions += '" на сумму ' + depositAmount + ' руб.';
            let outputResult = 'В конце срока вы получите ' + result + ' руб.';

            $('#outputConditions').text(outputConditions);
            $('#result').text(outputResult);
        }
        catch (err) {
            alert(err.message);
        }
    });
});