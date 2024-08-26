
$(document).ready(function () {

    $('#formCadastro').submit(function (e) {
        CPF = $(this).find("#CPF").val();

        if (!validaCPF(CPF)) {
            alert('CPF inválido!');
            return;
        }

        var beneficiarios = [];
        var table = document.getElementById("gridBeneficiarios").getElementsByTagName('tbody')[0];

        for (var i = 0; i < table.rows.length; i++) {
            var row = table.rows[i];
            var cpf = row.cells[0].textContent;
            var nome = row.cells[1].textContent;

            beneficiarios.push({ CPFBeneficiario: cpf, NomeBeneFiciario: nome });
        }

        console.log(beneficiarios);
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "CPF": $(this).find("#CPF").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Beneficiarios": beneficiarios
                
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialogErro("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialogErro("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialogSucess("Sucesso!", r, function () {
                    window.location.href = urlRetorno;
                });
                $("#formCadastro")[0].reset();
            }
        });
    })
    
})

function ModalDialogErro(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}


function ModalDialogSucess(title, content, onClose) {
    var modalHtml = `
        <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitle">${title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;


    $("body").append(modalHtml);

    $("#successModal").modal('show');

    $("#successModal").on('hidden.bs.modal', function () {
        if (typeof onClose === 'function') {
            onClose();
        }

        $(this).remove();
    });
}

function adicionarBeneficiario() {
    var cpf = document.getElementById("cpfBeneficiario").value;
    var nome = document.getElementById("nomeBeneficiario").value;

    if (cpf && nome) {
        var table = document.getElementById("gridBeneficiarios").getElementsByTagName('tbody')[0];

        if (!validaCPF(cpf)) {
            alert('CPF inválido!');
            return;
        }

        // Verifica se o CPF já foi adicionado no grid atual
        var existingRow = Array.from(table.rows).find(row => row.cells[0].textContent === cpf);
        if (existingRow) {
            alert("Beneficiário com este CPF já foi adicionado.");
            return;
        }

        // Adiciona uma nova linha ao grid
        var newRow = table.insertRow();
        var cellCpf = newRow.insertCell(0);
        var cellNome = newRow.insertCell(1);
        var cellAcoes = newRow.insertCell(2);

        cellCpf.textContent = cpf;
        cellCpf.style = 'width: 120px';
        cellNome.textContent = nome;
        cellNome.style = 'padding-left: 60px'
        cellAcoes.style = 'padding-left: 130px';
        cellAcoes.innerHTML = `
            <button class="btn btn-primary btn-sm" onclick="editarBeneficiario(this)">Editar</button>
            <button class="btn btn-primary btn-sm" onclick="removerBeneficiario(this)">Excluir</button>
        `;

        // Limpa os campos do formulário
        document.getElementById("cpfBeneficiario").value = "";
        document.getElementById("nomeBeneficiario").value = "";

    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

function editarBeneficiario(button) {
    var row = button.parentNode.parentNode;
    var cpf = row.cells[0].textContent;
    var nome = row.cells[1].textContent;

    document.getElementById("cpfBeneficiario").value = cpf;
    document.getElementById("nomeBeneficiario").value = nome;

    // Armazena o índice da linha que está sendo editada
    document.getElementById("btnAtualizarBeneficiario").setAttribute("data-editing", row.rowIndex);

    document.getElementById("btnSalvarBeneficiario").style.display = "none";
    document.getElementById("btnAtualizarBeneficiario").style.display = "block";
}

function salvarEdicao() {
    var cpf = document.getElementById("cpfBeneficiario").value;
    var nome = document.getElementById("nomeBeneficiario").value;

    if (cpf && nome) {
        if (!validaCPF(cpf)) {
            alert('CPF inválido!');
            return;
        }

        var table = document.getElementById("gridBeneficiarios").getElementsByTagName('tbody')[0];

        var rowIndex = parseInt(document.getElementById("btnAtualizarBeneficiario").getAttribute("data-editing"), 10);

        if (rowIndex !== null) {

            var row = table.rows[rowIndex-1];
            
            if (row) {
                // Atualiza os valores das células
                row.cells[0].textContent = cpf;
                row.cells[1].textContent = nome;
            } else {
                alert('Linha para edição não encontrada.');
            }
        }

        document.getElementById("cpfBeneficiario").value = "";
        document.getElementById("nomeBeneficiario").value = "";
        document.getElementById("btnSalvarBeneficiario").style.display = "block";
        document.getElementById("btnAtualizarBeneficiario").style.display = "none";
        document.getElementById("btnAtualizarBeneficiario").removeAttribute("data-editing");
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

function removerBeneficiario(button) {

    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}
