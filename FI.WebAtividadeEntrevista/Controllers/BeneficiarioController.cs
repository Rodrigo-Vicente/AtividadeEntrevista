using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {
        [HttpGet]
        public JsonResult ValidarCpfBeneficiario(string cpf, long idcliente, long? idbeneficiario = null)
        {
            BoBeneficiario bene = new BoBeneficiario();
            List<BENEFICIARIOS> beneficiarios = bene.Consultar(idcliente);

            bool cpfCadastrado = beneficiarios
                .Any(x => x.CPF == cpf && (!idbeneficiario.HasValue || x.ID != idbeneficiario.Value));

            return Json(new
            {
                Success = !cpfCadastrado,
                Message = cpfCadastrado ? "CPF já está cadastrado para este cliente" : "CPF disponível"
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public List<BeneficiarioModel> BuscarBeneficiariosPorClienteId(long clienteId)
        {
            BoBeneficiario bene = new BoBeneficiario();

            List<BENEFICIARIOS> listaBeneficiarios = bene.Consultar(clienteId);
            List<BeneficiarioModel> beneficiarios = new List<BeneficiarioModel>();
            BeneficiarioModel beneficiario = new BeneficiarioModel();

            foreach (var item in listaBeneficiarios)
            {
                beneficiario.Id = item.ID;
                beneficiario.NomeBeneFiciario = item.NOME;
                beneficiario.CPFBeneficiario = Funcoes.FormatarCPF(item.CPF);
                beneficiario.IdCliente = item.IDCLIENTE;

                beneficiarios.Add(beneficiario);
            }

            return beneficiarios;
        }

        [HttpPost]
        public JsonResult AdicionarBeneficiario(BeneficiarioModel beneficiario)
        {
            BoBeneficiario bene = new BoBeneficiario();
            try
            {
                
                if (!Funcoes.CPFvalido(beneficiario.CPFBeneficiario))
                {
                    Response.StatusCode = 400;
                    return Json(string.Join(Environment.NewLine, "CPF Invalido!"));
                }

                var ListaBeneficiarios = new List<BENEFICIARIOS>();
                BENEFICIARIOS beneficiarioNovo = new BENEFICIARIOS()
                {
                    CPF = Funcoes.RemoverMascaraCPF(beneficiario.CPFBeneficiario),
                    NOME = beneficiario.NomeBeneFiciario,
                    IDCLIENTE = beneficiario.IdCliente,
                };

                ListaBeneficiarios.Add(beneficiarioNovo);
                var idBeneficiario = bene.Incluir(ListaBeneficiarios);

                var beneficiarios = bene.Consultar(beneficiario.IdCliente);
                List<BeneficiarioModel> listaBeneCadastrado = new List<BeneficiarioModel>();

                foreach (var item in beneficiarios)
                {
                    BeneficiarioModel model = new BeneficiarioModel
                    {
                        Id = item.ID,
                        NomeBeneFiciario = item.NOME,
                        CPFBeneficiario = Funcoes.FormatarCPF(item.CPF),
                        IdCliente = item.IDCLIENTE
                    };

                    listaBeneCadastrado.Add(model);
                }
                
                return Json(listaBeneCadastrado);
            }
            catch (System.Exception ex)
            {

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, ex));
            }
        }

        [HttpPost]
        public JsonResult AtualizarBeneFiciario(BeneficiarioModel beneficiario)
        {
            BoBeneficiario bene = new BoBeneficiario();
            try
            {
                if (!Funcoes.CPFvalido(beneficiario.CPFBeneficiario))
                {
                    Response.StatusCode = 400;
                    return Json(string.Join(Environment.NewLine, "CPF Invalido!"));
                }

                BENEFICIARIOS beneficiarioAtt = new BENEFICIARIOS()
                {
                    ID = beneficiario.Id,
                    CPF = Funcoes.RemoverMascaraCPF(beneficiario.CPFBeneficiario),
                    NOME = beneficiario.NomeBeneFiciario,
                    IDCLIENTE = beneficiario.IdCliente
                };

                bene.Alterar(beneficiarioAtt);

                Response.StatusCode = 200;
                return Json(string.Join(Environment.NewLine, "Beneficiario cadastrado com sucesso"));
            }
            catch (System.Exception ex)
            {

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, ex));
            }
        }

        [HttpPost]
        public JsonResult DeletarBeneficiario(long id)
        {
            BoBeneficiario bene = new BoBeneficiario();
            try
            {

                bene.Excluir(id);

                return Json(string.Join(Environment.NewLine, "Beneficiario cadastrado com sucesso"));
            }
            catch (System.Exception ex)
            {

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, ex));
            }
        }
    }
}