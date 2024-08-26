document.addEventListener('DOMContentLoaded', function () {
    function formatarCPF(cpf) {

        cpf = cpf.replace(/\D/g, '');

        if (cpf.length <= 11) {
            return cpf.replace(/^(\d{3})(\d{3})?(\d{3})?(\d{2})?$/, function (match, p1, p2, p3, p4) {
                var resultado = p1;
                if (p2) resultado += '.' + p2;
                if (p3) resultado += '.' + p3;
                if (p4) resultado += '-' + p4;
                return resultado;
            });
        }
        return cpf;
    }

    function aplicarMascaraCPF() {
        var camposCPF = document.querySelectorAll('#beneficiarioCPF, #CPF, #cpfBeneficiario');

        camposCPF.forEach(function (campo) {
            campo.addEventListener('input', function () {
                this.value = formatarCPF(this.value);
            });
        });
    }

    aplicarMascaraCPF();
});


function validaCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length != 11) return false;
    var soma = 0;
    var resto;
    if (cpf == "00000000000") return false;
    for (var i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(cpf.substring(10, 11))) return false;
    return true;
}
