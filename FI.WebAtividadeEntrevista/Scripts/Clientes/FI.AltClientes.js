$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);
        if (obj.Beneficiarios && obj.Beneficiarios.length > 0) {
            obj.Beneficiarios.forEach(function (beneficiario) {
                adicionarBeneficiarioNoGrid(beneficiario);
            });
        }

        function adicionarBeneficiarioNoGrid(beneficiario) {
            var row = '<tr data-id="' + beneficiario.Id + '">'
                + '<td style="width: 120px"> ' + beneficiario.CPFBeneficiario + '</td>'
                + '<td style="padding-left: 60px">' + beneficiario.NomeBeneFiciario + '</td>'
                + '<td style="padding-left: 130px">'
                + '<button type="button" class="btn btn-primary btnEditarBeneficiario" style="margin-right: 10px;">Editar</button>'
                + '<button type="button" class=" btn btn-primary btnExcluirBeneficiario">Excluir</button>'
                + '</td>'
                + '</tr>';
            $('#gridBeneficiarios tbody').append(row);
        }

        $('#gridBeneficiarios').on('click', '.btnEditarBeneficiario', function () {
            var row = $(this).closest('tr');
            var id = row.data('id');
            var cpf = row.find('td:eq(0)').text();
            var nome = row.find('td:eq(1)').text();


            $('#modalBeneficiario #CPFBeneficiario').val(cpf);
            $('#modalBeneficiario #NomeBeneFiciario').val(nome);

            $('#modalBeneficiario').modal('show');
        });

    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialogAltErro("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialogAltErro("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
                function (r) {
                    ModalDialogAltSucess("Sucesso!", r, function () {
                        window.location.href = urlRetorno;
                    });
                    $("#formCadastro")[0].reset();
                }
        });
    })

    //Incluir Beneficiario
    $('#btnSalvarBeneficiario').click(function () {
        var cpf = document.getElementById("beneficiarioCPF").value;
        var nome = document.getElementById("beneficiarioNome").value;
        if (cpf && nome) {
            validarCpfBeneficiario(cpf, function (isValid) {
                if (isValid) {
                    var beneficiario = {
                        CPFBeneficiario: cpf,
                        NomeBeneFiciario: nome,
                        IdCliente: obj.Id
                    };

                    $.ajax({
                        url: urlIncluirBene,
                        method: 'POST',
                        data: beneficiario,
                        success: function (response) {
                            var tableBody = document.querySelector("#gridBeneficiarios tbody");
                            tableBody.innerHTML = "";

                            response.forEach(function (beneficiario) {
                                adicionarBeneficiarioNoGrid(beneficiario);
                            });
                        },
                        error: function () {
                            alert('Ocorreu um erro ao salvar o beneficiário.');
                        }
                    });
                }
            });
        } else {
            alert("Por favor, preencha todos os campos.");
        }

    });

    //Função de edição do beneficiario
    $('#gridBeneficiarios').on('click', '.btnEditarBeneficiario', function (event) {
        var row = $(this).closest('tr');
        var id = row.data('id');
        var cpf = row.find('td:eq(0)').text();
        var nome = row.find('td:eq(1)').text();

        $('#modalBeneficiarios #beneficiarioCPF').val(cpf);
        $('#modalBeneficiarios #beneficiarioNome').val(nome);

        $('#modalBeneficiarios').data('id', id); 
        $('#modalBeneficiarios').attr('data-editing', 'true');

        $('#btnSalvarBeneficiario').hide();
        $('#btnAtualizarBeneficiario').show(); 

        $('#modalBeneficiarios').modal('show');
    });

    $('#btnAtualizarBeneficiario').click(function () {
        var cpf = document.getElementById("beneficiarioCPF").value;
        var nome = document.getElementById("beneficiarioNome").value;
        var id = $('#modalBeneficiarios').data('id');

        if (cpf && nome) {
            validarCpfBeneficiario(cpf, function (isValid) {
                if (isValid) {
                    var beneficiario = {
                        CPFBeneficiario: cpf,
                        NomeBeneFiciario: nome,
                        Id: id, 
                        IdCliente: obj.Id
                    };

                    $.ajax({
                        url: urlAttBene, 
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(beneficiario),
                        success: function (response) {
                            var row = $('#gridBeneficiarios').find('tr[data-id="' + id + '"]');
                            row.find('td:eq(0)').text(cpf);
                            row.find('td:eq(1)').text(nome);

                            $('#modalBeneficiarios').modal('hide');
                        },
                        error: function () {
                            alert('Ocorreu um erro ao salvar o beneficiário.');
                        }
                    });
                }
            });
        } else {
            alert("Por favor, preencha todos os campos.");
        }

        $('#modalBeneficiarios').removeAttr('data-editing').removeData('id');
        $('#btnSalvarBeneficiario').show(); 
        $('#btnAtualizarBeneficiario').hide();
    });

    //Função para Excluir beneficiario
    $('#gridBeneficiarios').on('click', '.btnExcluirBeneficiario', function () {
        var row = $(this).closest('tr');
        var id = row.data('id');

        var confirma = confirm("Tem certeza que deseja excluir este beneficiário?");
        if (confirma) {
            excluirBeneficiario(id);
        }
    });
})

function ModalDialogAltErro(titulo, texto) {
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

function ModalDialogAltSucess(title, content, onClose) {
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

function validarCpfBeneficiario(cpf, callback) {
    var idcliente = obj.Id;
    var id =  $('#modalBeneficiarios').data('id');
    $.ajax({
        url: urlValidarCPF,
        method: 'GET',
        data: { cpf: cpf, idcliente: idcliente, idbeneficiario: id },
        success: function (response) {
            if (response.Success) {
                callback(true);
            } else {
                alert(response.Message);
                callback(false);
            }
        },
        error: function () {
            alert("Ocorreu um erro ao validar o CPF.");
            callback(false);
        }
    });
}


function excluirBeneficiario(id) {
    $.ajax({
        url: urlDelBene,
        method: 'POST',
        data: { id: id },       
        success: function (response) {

            $('#gridBeneficiarios').find('tr[data-id="' + id + '"]').remove();
            alert('Beneficiário excluído com sucesso.');
        },
        error: function () {
            alert('Ocorreu um erro ao excluir o beneficiário.');
        }
    });
}